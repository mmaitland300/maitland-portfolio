import { ImageResponse } from "next/og";

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
              /* Align with `.page-title` in globals.css (not Tailwind default purple/cyan) */
              background:
                "linear-gradient(105deg, rgba(236, 241, 247, 0.96) 0%, rgba(221, 229, 241, 0.94) 42%, rgba(161, 223, 255, 0.9) 82%, rgba(188, 160, 250, 0.88) 100%)",
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
