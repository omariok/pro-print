import { NextResponse } from "next/server";

/**
 * Проверка состояния для хостинга: Timeweb опрашивает этот адрес и
 * перезапускает приложение, если оно перестало отвечать.
 */
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({ ok: true });
}
