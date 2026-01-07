import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate metric data
    if (!body.name || typeof body.value !== "number") {
      return NextResponse.json({ error: "Invalid metric data" }, { status: 400 })
    }

    // Log metrics (in production, send to analytics service)
    console.log("[Web Vitals]", {
      name: body.name,
      value: body.value,
      rating: body.rating,
      url: body.url,
      timestamp: body.timestamp,
    })

    return NextResponse.json(
      { success: true },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      },
    )
  } catch (error) {
    return NextResponse.json({ error: "Failed to process metric" }, { status: 500 })
  }
}
