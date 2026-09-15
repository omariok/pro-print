import {
  BufferAttribute,
  BufferGeometry,
  CatmullRomCurve3,
  CylinderGeometry,
  DoubleSide,
  Group,
  Mesh,
  PlaneGeometry,
  ShaderMaterial,
  Vector3,
} from "three";

/*
 * Плёнка под шаром Hero: шар работает как печатный цилиндр.
 *
 * Прозрачная лента сходит с рулона сзади справа, проходит под сферой и
 * уходит вперёд влево уже с этикетками — краска с шара ложится на плёнку.
 * Этикетка — тот же макет, что у TrayMock в «Примерах»: цветная полоса, три
 * строки, круглый знак; печать в два ручья. Полоса берёт краски шара по
 * очереди, а пока над
 * шаром пипетка — её цвет: так печатается этикетка, которая в этот момент
 * выходит из-под сферы.
 *
 * Лента едет еле заметно — первый экран читают, а не смотрят. Курсор над
 * шаром «разгоняет машину», и новые этикетки идут чаще. Два шейдера, без
 * текстур; сфера закрывает ленту буфером глубины, как настоящий предмет.
 */

/** Плёнка лежит на полу чуть ниже точки касания — шар её прижимает. */
const FLOOR_Y = -1.004;
/** Шаг этикеток вдоль ленты и размер самой этикетки, мировые единицы. */
const PERIOD = 0.84;
const LABEL_W = 0.42;
const LABEL_L = 0.64;
/**
 * Печать в два ручья: одна форма кладёт две одинаковые этикетки поперёк
 * ленты. Между ручьями и по краям — чистая прозрачная плёнка.
 */
const LANE_GAP = 0.07;
const WIDTH = 2 * LABEL_W + LANE_GAP + 0.19;
/** Сколько этикеток помнят свой цвет: 8 × PERIOD длиннее всей ленты. */
const SLOTS = 8;
/** Скорость ленты в покое и прибавка, когда курсор перемешивает краску. */
const SPEED = 0.045;
const DRIVE = 0.32;
const ROLL_R = 0.21;
const ROLL_LEN = WIDTH + 0.04;
/** Гильза и отверстие в долях радиуса рулона: намотка толстая, гильза узкая. */
const CORE_R = 0.36;
const HOLE_R = 0.27;

/** Путь ленты по полу (x, z): от рулона под точку касания и вперёд влево. */
const PATH: [number, number][] = [
  [1.25, -1.45],
  [0.85, -0.86],
  [0.42, -0.34],
  [0.02, -0.02],
  [-0.3, 0.62],
  [-0.48, 1.26],
  [-0.6, 1.95],
  [-0.68, 2.7],
];

/** Краски шара для этикеток, по кругу. sRGB 0–255, как и цвет пипетки. */
const PALETTE: [number, number, number][] = [
  [15, 178, 220], // голубой
  [255, 0, 120], // пурпур
  [251, 195, 15], // жёлтый
  [249, 92, 60], // красно-оранжевый
  [138, 223, 214], // мятный
  [247, 147, 31], // оранжевый
];

const f = (v: number) => v.toFixed(4);

function srgb(hex: number) {
  return new Vector3(((hex >> 16) & 255) / 255, ((hex >> 8) & 255) / 255, (hex & 255) / 255);
}

const FILM_VERTEX = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vPosW;

  void main() {
    vUv = uv;
    vec4 world = modelMatrix * vec4(position, 1.0);
    vPosW = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const FILM_FRAGMENT = /* glsl */ `
  uniform float uScroll;
  uniform float uPrint;
  uniform float uEnd;
  uniform vec3 uLabels[${SLOTS}];
  uniform vec3 uCard;
  uniform vec3 uInk;
  uniform vec3 uLine;
  uniform vec3 uSand;
  uniform vec3 uAccent;
  uniform vec3 uShade;
  uniform vec3 uTint;
  uniform vec2 uFade;

  varying vec2 vUv;
  varying vec3 vPosW;

  const float WIDTH = ${f(WIDTH)};
  const float PERIOD = ${f(PERIOD)};
  const float LW = ${f(LABEL_W)};
  const float LL = ${f(LABEL_L)};
  const float GAP = ${f(LANE_GAP)};

  // Покрытие фигуры по её расстоянию со знаком — край сглажен в один пиксель.
  float fill(float d) { return clamp(0.5 - d / max(fwidth(d), 1e-5), 0.0, 1.0); }

  float rbox(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + r;
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
  }

  void main() {
    // Плёнка лежит на полу, нормаль — вверх.
    vec3 V = normalize(cameraPosition - vPosW);
    float fres = pow(1.0 - clamp(V.y, 0.0, 1.0), 3.0);

    // Сама плёнка прозрачна: бумага видна сквозь неё почти без изменений.
    // Выдают её только тонкая тёмная кромка с бликом рядом и неподвижные
    // отражения софтбокса — узкая полоса и широкий мягкий отсвет, — по
    // которым лента едет.
    float e = min(vUv.x, 1.0 - vUv.x) * WIDTH;
    float px = fwidth(e);
    float rim = 1.0 - smoothstep(0.0, px * 1.3, e);
    float lip = (1.0 - smoothstep(px * 1.3, px * 3.2, e)) * (1.0 - rim);
    float band = vPosW.x * 0.8 + vPosW.z * 0.55;
    float glint = smoothstep(0.16, 0.0, abs(band - 0.33));
    float sheen = smoothstep(0.8, 0.0, abs(band - 0.1));
    vec3 col = mix(uTint, vec3(1.0), max(glint, lip));
    col = mix(col, uInk, rim * 0.6);
    float a = 0.012 + fres * 0.035 + sheen * 0.03 + glint * 0.17 + lip * 0.34 + rim * 0.3;

    // Координаты этикетки своего ручья: x — слева направо, y — от дальнего
    // края к ближнему. Ряд этикеток печатается одной краской.
    float v = vUv.y - uScroll;
    float k = floor(v / PERIOD);
    float xs = (vUv.x - 0.5) * WIDTH;
    float lane = xs < 0.0 ? -1.0 : 1.0;
    vec2 q = vec2(xs - lane * (LW + GAP) * 0.5 + LW * 0.5, v - k * PERIOD - (PERIOD - LL) * 0.5);
    int slot = int(mod(k, ${SLOTS}.0));
    vec3 ink = uLabels[0];
    for (int i = 1; i < ${SLOTS}; i++) if (i == slot) ink = uLabels[i];

    vec2 hs = vec2(LW, LL) * 0.5;
    float body = fill(rbox(q - hs, hs, 0.045));
    vec3 lc = uCard;
    lc = mix(lc, ink, fill(q.y - LL * 0.34));
    lc = mix(lc, uInk, fill(rbox(q - vec2(0.14, LL * 0.5), vec2(0.09, 0.024), 0.024)));
    lc = mix(lc, uLine, fill(rbox(q - vec2(0.11, LL * 0.64), vec2(0.06, 0.021), 0.021)));
    lc = mix(lc, uSand, fill(rbox(q - vec2(0.085, LL * 0.78), vec2(0.035, 0.021), 0.021)));
    lc = mix(lc, uAccent, fill(length((q - vec2(0.325, LL * 0.64)) * vec2(1.0, 0.9)) - 0.056));

    // До точки касания плёнка чистая: краска ложится там, где шар её прижал.
    float la = body * smoothstep(uPrint - 0.02, uPrint + 0.02, vUv.y) * 0.96;

    float A = la + a * (1.0 - la);
    vec3 C = (lc * la + col * a * (1.0 - la)) / max(A, 1e-4);
    C = mix(C, vec3(1.0), glint * 0.35);

    // У точки касания плёнка в тени шара.
    float sh = exp(-dot(vPosW.xz, vPosW.xz) * 7.0);
    C = mix(C, uShade, sh * 0.45);

    // Края холста и конец ленты растворяются в бумаге — без резкого среза.
    A *= smoothstep(0.0, uFade.x, gl_FragCoord.x) * smoothstep(0.0, uFade.y, gl_FragCoord.y);
    A *= 1.0 - smoothstep(uEnd - 0.6, uEnd, vUv.y);

    gl_FragColor = vec4(clamp(C, 0.0, 1.0), A);
  }
`;

const ROLL_VERTEX = /* glsl */ `
  varying vec3 vObj;
  varying vec3 vObjN;
  varying vec3 vNormalW;
  varying vec3 vPosW;

  void main() {
    vObj = position;
    vObjN = normal;
    vec4 world = modelMatrix * vec4(position, 1.0);
    vPosW = world.xyz;
    vNormalW = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const ROLL_FRAGMENT = /* glsl */ `
  uniform vec3 uGlass;
  uniform vec3 uDeep;
  uniform vec3 uKraft;
  uniform vec3 uCore;

  varying vec3 vObj;
  varying vec3 vObjN;
  varying vec3 vNormalW;
  varying vec3 vPosW;

  void main() {
    vec3 N = normalize(vNormalW);
    vec3 V = normalize(cameraPosition - vPosW);
    vec3 L = normalize(vec3(-0.55, 0.75, 0.65));
    vec3 H = normalize(L + V);
    float lam = dot(N, L) * 0.5 + 0.5;
    vec3 col;
    float a;
    if (abs(vObjN.y) > 0.5) {
      // Торец: сотни витков прозрачной плёнки в торец дают стеклянный
      // серо-зелёный тон с тонкими кольцами; узкая картонная гильза, отверстие.
      float r = length(vObj.xz) / ${f(ROLL_R)};
      float rings = 0.5 + 0.5 * sin(r * 170.0);
      col = mix(uDeep, uGlass, 0.3 + 0.25 * rings + 0.35 * smoothstep(0.55, 1.0, r));
      col = mix(col, vec3(1.0), smoothstep(0.93, 1.0, r) * 0.6);
      col *= 0.86 + 0.14 * lam;
      a = 0.9;
      float core = step(r, ${f(CORE_R)});
      col = mix(col, uKraft, core);
      col = mix(col, uCore, step(r, ${f(HOLE_R)}));
      a = mix(a, 1.0, core);
    } else {
      // Намотка: гладкий холодный глянец, сквозь который чуть видно пол;
      // вдоль рулона — резкий блик софтбокса, к силуэту плотнее.
      float fres = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 2.0);
      float spec = pow(max(dot(N, H), 0.0), 90.0);
      float sheen = pow(max(dot(N, H), 0.0), 7.0);
      col = mix(uDeep, uGlass, lam);
      col = mix(col, vec3(1.0), clamp(spec * 0.95 + sheen * 0.22, 0.0, 1.0));
      // Кромки витков у торцов ловят свет.
      col = mix(col, vec3(1.0), smoothstep(${f(ROLL_LEN / 2 - 0.018)}, ${f(ROLL_LEN / 2)}, abs(vObj.y)) * 0.55);
      a = 0.66 + fres * 0.3 + spec * 0.3;
    }
    gl_FragColor = vec4(clamp(col, 0.0, 1.0), clamp(a, 0.0, 1.0));
  }
`;

const SHADOW_FRAGMENT = /* glsl */ `
  uniform vec3 uShade;
  varying vec2 vUv;

  void main() {
    float d = length(vUv * 2.0 - 1.0);
    float a = 1.0 - smoothstep(0.0, 1.0, d);
    gl_FragColor = vec4(uShade, a * a * 0.42);
  }
`;

/** Вершины ленты: по две на каждое сечение, uv = (поперёк 0–1, длина вдоль пути). */
function ribbon(curve: CatmullRomCurve3, segments: number) {
  const length = curve.getLength();
  const pos = new Float32Array((segments + 1) * 6);
  const uv = new Float32Array((segments + 1) * 4);
  const index: number[] = [];
  const side = new Vector3();
  const up = new Vector3(0, 1, 0);
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const p = curve.getPointAt(t);
    side.crossVectors(up, curve.getTangentAt(t)).setY(0).normalize();
    const l = p.clone().addScaledVector(side, -WIDTH / 2);
    const r = p.clone().addScaledVector(side, WIDTH / 2);
    pos.set([l.x, l.y, l.z, r.x, r.y, r.z], i * 6);
    uv.set([0, t * length, 1, t * length], i * 4);
    if (i < segments) {
      const a = i * 2;
      index.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
    }
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(pos, 3));
  geometry.setAttribute("uv", new BufferAttribute(uv, 2));
  geometry.setIndex(index);
  return { geometry, length };
}

/**
 * Точка касания (дальше плёнка уже с краской) и место, где лента выходит
 * из-под сферы в кадр: первая точка пути после касания, которую камера видит
 * мимо шара. Этикетка на выходе — та, что «печатается» сейчас.
 */
function findNip(curve: CatmullRomCurve3, length: number, cameraZ: number) {
  const cam = new Vector3(0, 0, cameraZ);
  const d = new Vector3();
  let contact = -1;
  for (let i = 0; i <= 400; i++) {
    const t = i / 400;
    const p = curve.getPointAt(t);
    if (contact < 0) {
      if (p.z > 0) contact = t * length;
      continue;
    }
    d.subVectors(p, cam);
    const s = Math.min(1, Math.max(0, -cam.dot(d) / d.lengthSq()));
    if (cam.clone().addScaledVector(d, s).length() > 1.01) return { contact, nip: t * length };
  }
  return { contact: length * 0.4, nip: length * 0.5 };
}

export function createFilm(cameraZ: number) {
  const curve = new CatmullRomCurve3(
    PATH.map(([x, z]) => new Vector3(x, FLOOR_Y, z)),
    false,
    "centripetal",
  );
  const { geometry, length } = ribbon(curve, 220);
  const { contact, nip } = findNip(curve, length, cameraZ);

  // Первая этикетка уже вышла из-под шара — статичный кадр тоже с печатью.
  let scroll = nip + 0.55 - PERIOD / 2;
  let printing = Math.floor((contact - scroll) / PERIOD);
  let next = SLOTS;

  const filmUniforms = {
    uScroll: { value: scroll },
    uPrint: { value: contact },
    uEnd: { value: length },
    uLabels: { value: Array.from({ length: SLOTS }, (_, i) => rgb(PALETTE[i % PALETTE.length])) },
    uCard: { value: srgb(0xfffcf4) },
    uInk: { value: srgb(0x2e3c45) },
    uLine: { value: srgb(0xc5ced1) },
    uSand: { value: srgb(0xf4d47c) },
    uAccent: { value: srgb(0xff5b04) },
    uShade: { value: srgb(0x2b1204) },
    uTint: { value: srgb(0xb4c6ca) },
    uFade: { value: [1, 1] as [number, number] },
  };
  const filmMaterial = new ShaderMaterial({
    vertexShader: FILM_VERTEX,
    fragmentShader: FILM_FRAGMENT,
    uniforms: filmUniforms,
    transparent: true,
    depthWrite: false,
    side: DoubleSide,
  });
  const film = new Mesh(geometry, filmMaterial);
  film.renderOrder = 1;

  // Рулон стоит в начале ленты, ось — поперёк неё.
  const start = curve.getPointAt(0);
  const axis = new Vector3().crossVectors(new Vector3(0, 1, 0), curve.getTangentAt(0)).setY(0).normalize();
  const rollGeometry = new CylinderGeometry(ROLL_R, ROLL_R, ROLL_LEN, 64, 1);
  const rollMaterial = new ShaderMaterial({
    vertexShader: ROLL_VERTEX,
    fragmentShader: ROLL_FRAGMENT,
    uniforms: {
      uGlass: { value: srgb(0xe6eeee) },
      uDeep: { value: srgb(0x9cb1b2) },
      uKraft: { value: srgb(0xc79a5b) },
      uCore: { value: srgb(0x2b1204) },
    },
    transparent: true,
  });
  const roll = new Mesh(rollGeometry, rollMaterial);
  // Полупрозрачный рулон рисуется после ленты и своей тени.
  roll.renderOrder = 3;
  roll.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), axis);
  roll.position.set(start.x, FLOOR_Y + ROLL_R, start.z);

  const shadowGeometry = new PlaneGeometry(1, 1).rotateX(-Math.PI / 2);
  const shadowMaterial = new ShaderMaterial({
    vertexShader: FILM_VERTEX,
    fragmentShader: SHADOW_FRAGMENT,
    uniforms: { uShade: { value: srgb(0x2b1204) } },
    transparent: true,
    depthWrite: false,
  });
  const shadow = new Mesh(shadowGeometry, shadowMaterial);
  shadow.rotation.y = Math.atan2(-axis.z, axis.x);
  shadow.scale.set(ROLL_LEN * 1.35, 1, ROLL_R * 3.6);
  shadow.position.set(start.x, FLOOR_Y + 0.002, start.z);
  shadow.renderOrder = 2;

  const group = new Group();
  group.add(film, roll, shadow);

  const setSlot = (k: number, c: [number, number, number]) => {
    const [r, g, b] = c;
    filmUniforms.uLabels.value[((k % SLOTS) + SLOTS) % SLOTS].set(r / 255, g / 255, b / 255);
  };

  return {
    group,
    /**
     * Шаг ленты. drive — насколько курсор перемешивает краску (0–1+),
     * ink — цвет пипетки, пока она над шаром.
     */
    step(dt: number, drive: number, ink: [number, number, number] | null) {
      scroll += dt * (SPEED + DRIVE * Math.min(drive, 1));
      // В шейдер — остаток: номер слота от этого не меняется, а float не теряет точность.
      filmUniforms.uScroll.value = scroll % (SLOTS * PERIOD);
      // Новая этикетка получает цвет, когда доходит до точки касания.
      const k = Math.floor((contact - scroll) / PERIOD);
      if (k !== printing) {
        printing = k;
        setSlot(k, ink ?? PALETTE[next++ % PALETTE.length]);
      }
      // Пипетка перекрашивает и ту, что прямо сейчас выходит из-под шара:
      // так её цвет виден сразу, а не через полминуты.
      if (ink) {
        setSlot(k, ink);
        const out = Math.floor((nip - scroll) / PERIOD);
        if (out !== k) setSlot(out, ink);
      }
    },
    /** Ширина растворения у левого и нижнего края холста, px буфера. */
    setFade(x: number, y: number) {
      filmUniforms.uFade.value = [Math.max(1, x), Math.max(1, y)];
    },
    dispose() {
      geometry.dispose();
      filmMaterial.dispose();
      rollGeometry.dispose();
      rollMaterial.dispose();
      shadowGeometry.dispose();
      shadowMaterial.dispose();
    },
  };
}

function rgb([r, g, b]: [number, number, number]) {
  return new Vector3(r / 255, g / 255, b / 255);
}
