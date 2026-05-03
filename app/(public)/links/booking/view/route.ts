import { NextResponse } from "next/server";

export async function GET() {
  const target = "https://www.booking.com/Pulse-81UlHU";
  return NextResponse.redirect(target, 301);
}
