import { NextResponse } from "next/server";

export async function GET() {
  const target = "https://www.instagram.com/lakeviewvillatangalle";
  return NextResponse.redirect(target, 301);
}
