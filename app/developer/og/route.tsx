import { ImageResponse } from "next/og";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg,#0e8e9a,#2dd4bf)",
          color: "white",
          padding: 60,
          fontSize: 44,
        }}
      >
        <div style={{ fontSize: 22, opacity: 0.85 }}>Developer – Sahan</div>
        <div
          style={{
            fontWeight: 800,
            marginTop: 12,
            fontSize: 70,
            lineHeight: 1.05,
          }}
        >
          Hyper-Luxury Full-Stack Engineer
        </div>
        <div style={{ marginTop: "auto", fontSize: 24, opacity: 0.9 }}>
          lakeviewvillatangalle.com/developer
        </div>
      </div>
    ),
    { ...size }
  );
}
