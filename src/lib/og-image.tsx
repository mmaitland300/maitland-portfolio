import { ImageResponse } from "next/og";
import { PAGE_TITLE_GRADIENT } from "@/lib/page-title-gradient";

export const ogSize = { width: 1200, height: 630 };

export function createOgImage(title: string, subtitle: string) {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
          }}
        >
          <div
            style={{
              fontSize: 60,
              fontWeight: 800,
              background: PAGE_TITLE_GRADIENT,
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 26,
              color: "#a1a1aa",
              textAlign: "center",
              maxWidth: 800,
            }}
          >
            {subtitle}
          </div>
          <div
            style={{
              fontSize: 18,
              color: "#52525b",
              marginTop: 12,
            }}
          >
            mmaitland.dev
          </div>
        </div>
      </div>
    ),
    { ...ogSize }
  );
}
