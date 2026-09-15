import {
  IcosahedronGeometry,
  Mesh,
  PerspectiveCamera,
  Raycaster,
  Scene,
  ShaderMaterial,
  Sphere,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";

/*
 * Живой шар Hero: глянцевая сфера с полосой печатных красок, как на исходном
 * ролике.
 *
 * Весь вид — в шейдерах, без текстур и карт окружения: поперёк шара течёт
 * полоса CMYK-красок (пурпур слева, жёлтый в центре, голубой справа), сверху
 * светлый купол, снизу краска уходит в тёмный глянец, по краю радужная плёнка.
 * Курсор продавливает поверхность (ямка с пружинной задержкой и короткая
 * волна) и перемешивает краски вокруг себя. Каждый кадр — один draw call.
 *
 * Модуль грузится динамическим import() из HeroOrb, поэтому three.js не
 * попадает в первый бандл страницы.
 */

const NOISE = /* glsl */ `
  // 3D simplex noise — Ashima Arts / Stefan Gustavson, MIT.
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }
`;

const VERTEX = /* glsl */ `
  uniform float uTime;
  uniform vec3 uHit;
  uniform float uPress;

  varying vec3 vNormalW;
  varying vec3 vPosW;
  varying vec3 vObj;

  ${NOISE}

  // Точка единичной сферы -> точка деформированной поверхности.
  vec3 displace(vec3 n) {
    // Медленное «дыхание»: шар живой, даже когда его не трогают.
    // Слабее, чем кажется нужным: сильнее — и силуэт идёт буграми.
    float breathe = snoise(n * 1.1 + vec3(0.0, uTime * 0.16, uTime * 0.1)) * 0.006;

    // Ямка под курсором и валик вокруг неё — объём «перетекает», а не пропадает.
    float d = dot(n, uHit);
    float dent = smoothstep(0.8, 1.0, d);
    float ring = smoothstep(0.52, 0.8, d) * (1.0 - smoothstep(0.8, 0.96, d));
    float press = (-0.09 * dent * dent + 0.025 * ring) * uPress;

    // Короткая волна, расходящаяся от точки касания.
    float angle = acos(clamp(d, -1.0, 1.0));
    float ripple = sin(angle * 10.0 - uTime * 5.5) * exp(-angle * 3.0) * 0.01 * abs(uPress);

    return n * (1.0 + breathe + press + ripple);
  }

  void main() {
    vec3 n = normalize(position);
    vec3 t = normalize(cross(n, abs(n.y) < 0.99 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0)));
    vec3 b = cross(n, t);

    // Нормаль деформированной поверхности — по двум соседним точкам.
    const float e = 0.012;
    vec3 p0 = displace(n);
    vec3 p1 = displace(normalize(n + t * e));
    vec3 p2 = displace(normalize(n + b * e));
    vec3 dn = normalize(cross(p1 - p0, p2 - p0));

    vec4 world = modelMatrix * vec4(p0, 1.0);
    vObj = n;
    vPosW = world.xyz;
    vNormalW = normalize(mat3(modelMatrix) * dn);
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const FRAGMENT = /* glsl */ `
  uniform float uTime;
  uniform vec3 uHitW;
  uniform float uStir;
  uniform vec2 uDrag;
  uniform vec3 uInks[8];
  uniform float uStops[8];
  uniform vec2 uBand;
  uniform vec3 uPale;
  uniform vec3 uDeep;
  uniform vec3 uGround;

  varying vec3 vNormalW;
  varying vec3 vPosW;
  varying vec3 vObj;

  ${NOISE}

  // Полоса печатных красок слева направо: пурпур -> красный -> оранжевый ->
  // жёлтый -> салатовый -> мятный -> голубой. uStops — где стоит каждая краска.
  vec3 inks(float x) {
    vec3 c = uInks[0];
    for (int i = 1; i < 8; i++) c = mix(c, uInks[i], smoothstep(uStops[i - 1], uStops[i], x));
    return c;
  }

  void main() {
    vec3 N = normalize(vNormalW);
    vec3 V = normalize(cameraPosition - vPosW);
    float ndv = clamp(dot(N, V), 0.0, 1.0);
    float fres = pow(1.0 - ndv, 2.4);

    // Краска лежит под стеклом в плоскости экрана — как отражение в глянцевом
    // шаре на исходном ролике. Смотрим на неё по преломлённому лучу, поэтому
    // ямка под курсором работает как линза.
    vec3 r = refract(-V, N, 0.7);
    vec2 p = vPosW.xy + r.xy * 0.3;

    // Перемешивание под курсором: воронка вокруг точки касания, мазок вслед
    // за движением и мелкая рябь. Когда курсор уходит, краски отстаиваются.
    vec2 d = p - uHitW.xy;
    float fall = exp(-dot(d, d) * 3.0);
    float a = fall * uStir * 1.7;
    float sa = sin(a);
    float ca = cos(a);
    p = uHitW.xy + mat2(ca, sa, -sa, ca) * d;
    p -= uDrag * fall;
    p += vec2(snoise(vec3(p * 2.4, uTime * 0.8)), snoise(vec3(p * 2.4 + 4.7, uTime * 0.8))) * fall * uStir * 0.08;

    // Краски переливаются и без курсора: медленное течение, как краска под
    // глянцем на свету. Тише перемешивания под курсором — главным остаётся оно.
    p += vec2(snoise(vec3(p * 1.2, uTime * 0.21)), snoise(vec3(p * 1.2 + 5.3, uTime * 0.21 + 2.0))) * 0.1;

    float n1 = snoise(vec3(p * 0.85, uTime * 0.15) + vObj * 0.25);
    float n2 = snoise(vec3(p * 1.3 + 3.1, uTime * 0.17) - vObj * 0.2);

    // Полоса красок течёт по шуму и гуляет из стороны в сторону двумя
    // несоизмеримыми волнами — рисунок не повторяется.
    // uBand (сдвиг, масштаб) сжимает её в видимую часть шара, когда тот
    // наполовину уходит за край экрана.
    float sway = sin(uTime * 0.23) * 0.1 + sin(uTime * 0.41 + 1.7) * 0.05;
    vec3 band = inks((p.x - uBand.x) * uBand.y + n1 * 0.26 + sway);

    // Светлый купол сверху и тёмный глянцевый низ, как на ролике. Под
    // курсором краска проступает сквозь них — её есть что перемешивать.
    float lift = fall * min(uStir, 1.0) * 0.6;
    float by = p.y + n2 * 0.07;
    float hb = by + 0.14 * p.x * p.x; // горизонт чуть выгнут по форме шара
    float cap = smoothstep(-0.26, 0.4, by) * (1.0 - lift);
    float dark = smoothstep(-0.16, -0.42, hb) * (1.0 - lift);
    float deep = smoothstep(-0.4, -0.92, hb) * (1.0 - lift);

    vec3 col = mix(band, mix(uPale, band, 0.12), cap);
    // Внизу тёмный глянец с оттенком краски над ним: под жёлтой — коричневый,
    // под пурпурной — винный, под голубой — тёмная бирюза.
    col = mix(col, uDeep + band * band * 0.24, dark);
    col = mix(col, uDeep, deep);
    // Цветной отсвет по нижней кромке.
    col += band * pow(max(-N.y, 0.0), 3.0) * fres * 0.45;

    // Радужная плёнка и прозрачная кромка стекла.
    vec3 film = 0.5 + 0.5 * cos(6.2831 * (vec3(0.0, 0.33, 0.67) + fres * 1.4 + n1 * 0.2 + uTime * 0.05));
    col = mix(col, film, fres * 0.35);
    col = mix(col, uGround + film * 0.06, smoothstep(0.6, 1.0, fres) * 0.5 * (1.0 - 0.6 * dark));

    // Блики: точечный сверху слева и мягкое «окно» в отражении.
    vec3 L = normalize(vec3(-0.55, 0.75, 0.65));
    vec3 H = normalize(L + V);
    float spec = pow(max(dot(N, H), 0.0), 140.0) * 0.95 + pow(max(dot(N, H), 0.0), 18.0) * 0.1;
    vec3 R = reflect(-V, N);
    float box = smoothstep(0.3, 0.62, R.y) * (1.0 - smoothstep(0.1, 0.6, abs(R.x + 0.3))) * 0.14;
    col += vec3(spec + box);

    gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
  }
`;

/*
 * Краски сняты с исходного ролика шара — это цвета печатного процесса
 * (триада CMYK и их смеси), по которым на производстве меряют ΔE. Второе
 * число — где краска стоит по горизонтали шара (-1 — левый край, 1 — правый).
 */
const INKS: [number, number][] = [
  [0xff0078, -0.62], // пурпур
  [0xf81a55, -0.52], // малиновый
  [0xf95c3c, -0.4], // красно-оранжевый
  [0xf7931f, -0.2], // оранжевый
  [0xfbc30f, 0.02], // жёлтый
  [0xdfe06c, 0.3], // салатовый
  [0x8adfd6, 0.52], // мятный
  [0x0fb2dc, 0.76], // голубой
];

const CAMERA_Z = 5;
/** Полувысота кадра в плоскости шара: переводит скорость курсора из NDC в мировые единицы. */
const HALF_VIEW = CAMERA_Z * Math.tan((14 * Math.PI) / 180);

/** Цвет в sRGB 0–1: шейдер пишет в экран напрямую, без конвертации цветового пространства. */
function srgb(hex: number) {
  return new Vector3(((hex >> 16) & 255) / 255, ((hex >> 8) & 255) / 255, (hex & 255) / 255);
}

/** Замер «пипеткой»: где курсор стоит на сфере и какой цвет под ним. */
export type Probe = {
  /** Курсор над сферой. */
  active: boolean;
  /** Положение курсора относительно холста, CSS px. */
  x: number;
  y: number;
  /** Цвет пикселя под курсором, sRGB 0–255; null, пока замера не было. */
  rgb: [number, number, number] | null;
};

type Options = {
  /** prefers-reduced-motion: один статичный кадр, без анимации и реакции на курсор. */
  still: boolean;
  onReady: () => void;
  /** Вызывается каждый кадр, пока курсор над сферой, и один раз, когда он уходит. */
  onProbe?: (probe: Probe) => void;
};

/** Как часто снимать цвет под курсором: readPixels останавливает конвейер GPU. */
const SAMPLE_MS = 70;

export function createOrb(host: HTMLElement, { still, onReady, onProbe }: Options) {
  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  } catch {
    return null;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const canvas = renderer.domElement;
  canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";
  host.appendChild(canvas);

  const scene = new Scene();
  // Узкий объектив и дальняя камера: шар почти без перспективных искажений,
  // радиус 1 занимает ~82% ширины холста — остальное запас под деформацию
  // и контактную тень.
  const camera = new PerspectiveCamera(28, 1, 0.1, 20);
  camera.position.set(0, 0, CAMERA_Z);

  const uniforms = {
    uTime: { value: 7 },
    uHit: { value: new Vector3(0, 0, 1) },
    uPress: { value: 0 },
    uHitW: { value: new Vector3(0, 0, 1) },
    uStir: { value: 0 },
    uDrag: { value: new Vector2() },
    uInks: { value: INKS.map(([hex]) => srgb(hex)) },
    uStops: { value: INKS.map(([, x]) => x) },
    uBand: { value: new Vector2(0, 1) },
    uPale: { value: srgb(0xf6ecd9) },
    uDeep: { value: srgb(0x2b1204) },
    uGround: { value: srgb(0xf9f7ee) },
  };

  const geometry = new IcosahedronGeometry(1, 40);
  const material = new ShaderMaterial({ vertexShader: VERTEX, fragmentShader: FRAGMENT, uniforms });
  const mesh = new Mesh(geometry, material);
  scene.add(mesh);

  const render = () => renderer.render(scene, camera);

  const resize = () => {
    const w = host.clientWidth;
    const h = host.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    // Раскладку полосы задаёт вёрстка (--orb-band-x / --orb-band-k): она
    // знает, какая часть шара видна на этой ширине. Смена брейкпоинта меняет
    // и размер сцены, так что ResizeObserver её не пропустит.
    const css = getComputedStyle(host);
    const bandX = parseFloat(css.getPropertyValue("--orb-band-x"));
    const bandK = parseFloat(css.getPropertyValue("--orb-band-k"));
    uniforms.uBand.value.set(Number.isFinite(bandX) ? bandX : 0, Number.isFinite(bandK) ? bandK : 1);
    if (still) render();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(host);
  resize();

  if (still) {
    render();
    onReady();
    return {
      dispose() {
        ro.disconnect();
        geometry.dispose();
        material.dispose();
        renderer.dispose();
        canvas.remove();
      },
    };
  }

  /* ---------- курсор ---------- */

  // Координаты курсора храним экранные, а в NDC холста переводим каждый кадр:
  // если страницу прокрутили колесом, не двигая мышь, ямка остаётся под курсором.
  const ndc = new Vector2();
  let clientX = 0;
  let clientY = 0;
  let pointerActive = false;
  let mouse = false;

  const onPointer = (e: PointerEvent) => {
    clientX = e.clientX;
    clientY = e.clientY;
    mouse = e.pointerType === "mouse";
    // Мышь давит, пока она над страницей; палец — только пока касается экрана.
    pointerActive = e.pointerType === "mouse" || e.type === "pointerdown" || e.buttons > 0;
  };
  const onRelease = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") pointerActive = false;
  };
  const onLeave = () => {
    pointerActive = false;
  };
  window.addEventListener("pointermove", onPointer, { passive: true });
  window.addEventListener("pointerdown", onPointer, { passive: true });
  window.addEventListener("pointerup", onRelease, { passive: true });
  window.addEventListener("pointercancel", onRelease, { passive: true });
  document.documentElement.addEventListener("mouseleave", onLeave);

  /* ---------- физика ---------- */

  const raycaster = new Raycaster();
  const bounds = new Sphere(new Vector3(), 1);
  const hitWorld = new Vector3();
  const hitTarget = new Vector3(0, 0, 1);
  const hitDir = uniforms.uHit.value;
  const hitPointTarget = new Vector3(0, 0, 1);
  const hitPoint = uniforms.uHitW.value;
  const drag = uniforms.uDrag.value;
  const dragTarget = new Vector2();
  const prevNdc = new Vector2();

  let press = 0;
  let pressVel = 0;
  let stir = 0;
  let spin = 0;
  let tiltX = 0;
  let tiltY = 0;
  let onSphere = false;
  let rect = canvas.getBoundingClientRect();

  const step = (dt: number) => {
    uniforms.uTime.value += dt;

    rect = canvas.getBoundingClientRect();
    ndc.set(((clientX - rect.left) / rect.width) * 2 - 1, -(((clientY - rect.top) / rect.height) * 2 - 1));
    // Скорость курсора в плоскости шара, мировых единиц в секунду.
    const vx = dt > 0 ? ((ndc.x - prevNdc.x) / dt) * HALF_VIEW : 0;
    const vy = dt > 0 ? ((ndc.y - prevNdc.y) / dt) * HALF_VIEW : 0;
    prevNdc.copy(ndc);

    // Шар медленно вращается и чуть поворачивается к курсору.
    spin += dt * 0.09;
    const tx = pointerActive ? Math.max(-1.5, Math.min(1.5, -ndc.y)) * 0.16 : 0;
    const ty = pointerActive ? Math.max(-1.5, Math.min(1.5, ndc.x)) * 0.22 : 0;
    const ease = 1 - Math.exp(-dt * 3);
    tiltX += (tx - tiltX) * ease;
    tiltY += (ty - tiltY) * ease;
    mesh.rotation.set(tiltX, spin + tiltY, 0);
    mesh.updateMatrixWorld();

    let target = 0;
    let stirTarget = 0;
    dragTarget.set(0, 0);
    onSphere = false;
    if (pointerActive) {
      raycaster.setFromCamera(ndc, camera);
      if (raycaster.ray.intersectSphere(bounds, hitWorld)) {
        onSphere = true;
        hitPointTarget.copy(hitWorld);
        hitTarget.copy(mesh.worldToLocal(hitWorld)).normalize();
        target = 1;
        // Навёл — краски начинают кружиться, повёл — перемешиваются сильнее
        // и тянутся мазком за курсором.
        stirTarget = 0.6 + Math.min(Math.hypot(vx, vy), 5) * 0.2;
        dragTarget.set(vx, vy).multiplyScalar(0.07);
        if (dragTarget.length() > 0.35) dragTarget.setLength(0.35);
      }
    }

    // Ямка догоняет курсор с небольшой задержкой, глубина — недодемпфированная
    // пружина: при касании и отпускании поверхность пару раз «качнётся».
    hitDir.lerp(hitTarget, 1 - Math.exp(-dt * 12)).normalize();
    pressVel += ((target - press) * 70 - pressVel * 9) * dt;
    press += pressVel * dt;
    uniforms.uPress.value = press;

    // Перемешивание набирается быстро, а отстаивается медленно — пару секунд
    // после ухода курсора краски ещё плывут.
    hitPoint.lerp(hitPointTarget, 1 - Math.exp(-dt * 10));
    stir += (stirTarget - stir) * (1 - Math.exp(-dt * (stirTarget > stir ? 4 : 1.1)));
    uniforms.uStir.value = stir;
    drag.lerp(dragTarget, 1 - Math.exp(-dt * 5));
  };

  /* ---------- пипетка ---------- */

  // Цвет читаем из только что нарисованного кадра, в той же задаче, что и
  // render(): буфер ещё не отдан композитору, preserveDrawingBuffer не нужен.
  const gl = renderer.getContext();
  const pixel = new Uint8Array(4);
  const probe: Probe = { active: false, x: 0, y: 0, rgb: null };
  let lastSample = -Infinity;

  const measure = (t: number) => {
    // Пипетка — это курсор: палец, который водит по шару, её не вызывает.
    const hovering = onSphere && mouse;
    if (!onProbe || (!hovering && !probe.active)) return;
    const entered = hovering && !probe.active;
    probe.active = hovering;
    probe.x = clientX - rect.left;
    probe.y = clientY - rect.top;
    if (hovering && (entered || t - lastSample > SAMPLE_MS)) {
      lastSample = t;
      const k = canvas.width / rect.width;
      const px = Math.min(canvas.width - 1, Math.max(0, Math.floor(probe.x * k)));
      const py = Math.min(canvas.height - 1, Math.max(0, canvas.height - 1 - Math.floor(probe.y * k)));
      gl.readPixels(px, py, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
      probe.rgb = [pixel[0], pixel[1], pixel[2]];
    }
    onProbe(probe);
  };

  /* ---------- цикл ---------- */

  let raf = 0;
  let last = 0;
  let running = false;
  let visible = true;
  let ready = false;

  const frame = (t: number) => {
    raf = requestAnimationFrame(frame);
    const dt = Math.min((t - last) / 1000, 1 / 30);
    last = t;
    step(dt);
    render();
    measure(t);
    if (!ready) {
      ready = true;
      onReady();
    }
  };
  const start = () => {
    if (running || !visible || document.hidden) return;
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  };
  const stop = () => {
    running = false;
    cancelAnimationFrame(raf);
    // Цикл встал (шар ушёл с экрана, вкладка в фоне) — пипетку убираем.
    if (probe.active) {
      probe.active = false;
      onProbe?.(probe);
    }
  };

  // За пределами экрана и во фоновой вкладке GPU не тратится.
  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) start();
    else stop();
  });
  io.observe(host);
  const onVisibility = () => (document.hidden ? stop() : start());
  document.addEventListener("visibilitychange", onVisibility);

  start();

  return {
    dispose() {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("pointerup", onRelease);
      window.removeEventListener("pointercancel", onRelease);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      canvas.remove();
    },
  };
}
