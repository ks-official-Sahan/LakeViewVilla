import { NextResponse } from "next/server";

export async function GET() {
  const target = "https://www.airbnb.com/l/CfK96vPd";
  return NextResponse.redirect(target, 301);
}
