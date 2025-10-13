import { NextResponse } from "next/server";

export async function GET() {
  const target = "https://www.facebook.com/share/17M3VXHKbZ/?mibextid=wwXIfr";
  return NextResponse.redirect(target, 301);
}
