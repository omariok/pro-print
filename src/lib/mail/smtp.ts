import tls from "node:tls";

/**
 * Минимальный SMTP-клиент без зависимостей: одно письмо в текстовом виде
 * через SSL (порт 465). Для Яндекс Почты нужен пароль приложения, а не
 * пароль от аккаунта: id.yandex.ru → Безопасность → Пароли приложений.
 */
export type SmtpConfig = { host: string; port: number; user: string; pass: string };
export type Mail = { from: string; to: string; replyTo?: string; subject: string; text: string };

const TIMEOUT_MS = 15_000;

const b64 = (value: string) => Buffer.from(value, "utf8").toString("base64");
/** Заголовок в UTF-8 по RFC 2047: кириллица в теме письма. */
const encodeHeader = (value: string) => `=?UTF-8?B?${b64(value)}?=`;
/** Адреса попадают в заголовки и команды: переводы строк там недопустимы. */
const clean = (value: string) => value.replace(/[\r\n<>]/g, "").trim();

export async function sendMail(config: SmtpConfig, mail: Mail): Promise<void> {
  const socket = tls.connect({ host: config.host, port: config.port, servername: config.host });
  socket.setEncoding("utf8");
  socket.setTimeout(TIMEOUT_MS);

  let buffer = "";
  let waiting: { resolve: (reply: string) => void; reject: (error: Error) => void } | null = null;
  let failure: Error | null = null;

  const fail = (error: Error) => {
    failure = error;
    waiting?.reject(error);
    waiting = null;
  };

  // Ответ SMTP может быть многострочным: «250-…» продолжается, «250 …» завершает.
  const flush = () => {
    if (!waiting) return;
    const lines = buffer.split("\r\n");
    for (let i = 0; i < lines.length - 1; i++) {
      if (/^\d{3} /.test(lines[i])) {
        const reply = lines.slice(0, i + 1).join("\n");
        buffer = lines.slice(i + 1).join("\r\n");
        const done = waiting;
        waiting = null;
        done.resolve(reply);
        return;
      }
    }
  };

  socket.on("data", (chunk: string) => {
    buffer += chunk;
    flush();
  });
  socket.on("timeout", () => fail(new Error("SMTP: timeout")));
  socket.on("error", (error) => fail(error));
  socket.on("close", () => fail(new Error("SMTP: connection closed")));

  const read = (expect: number) =>
    new Promise<string>((resolve, reject) => {
      if (failure) return reject(failure);
      waiting = { resolve, reject };
      flush();
    }).then((reply) => {
      if (!reply.startsWith(String(expect))) throw new Error(`SMTP: expected ${expect}, got «${reply}»`);
      return reply;
    });

  const command = (line: string, expect: number) => {
    socket.write(line + "\r\n");
    return read(expect);
  };

  const from = clean(mail.from);
  const to = clean(mail.to);
  const headers = [
    `From: ${encodeHeader("Сайт Про-Принт")} <${from}>`,
    `To: <${to}>`,
    ...(mail.replyTo ? [`Reply-To: <${clean(mail.replyTo)}>`] : []),
    `Subject: ${encodeHeader(mail.subject)}`,
    `Date: ${new Date().toUTCString().replace("GMT", "+0000")}`,
    `Message-ID: <${Date.now()}.${Math.random().toString(36).slice(2)}@${from.split("@")[1] ?? "localhost"}>`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: base64",
  ];
  // base64 по 76 символов: строки тела никогда не начинаются с точки.
  const body = b64(mail.text).replace(/.{1,76}/g, "$&\r\n");

  let delivered = false;
  try {
    await read(220);
    await command("EHLO pro-print.pro", 250);
    await command(`AUTH PLAIN ${Buffer.from(`\0${config.user}\0${config.pass}`, "utf8").toString("base64")}`, 235);
    await command(`MAIL FROM:<${from}>`, 250);
    await command(`RCPT TO:<${to}>`, 250);
    await command("DATA", 354);
    await command(`${headers.join("\r\n")}\r\n\r\n${body}.`, 250);
    socket.write("QUIT\r\n");
    delivered = true;
  } finally {
    socket.removeAllListeners("close");
    // После сбоя или таймаута вежливо закрывать не с кем: рвём соединение,
    // иначе сокет висел бы открытым до таймаута сервера Яндекса.
    if (delivered) socket.end();
    else socket.destroy();
  }
}
