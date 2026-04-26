import { createOgImage, ogSize } from "@/lib/og-image";

export const runtime = "edge";
export const alt = "Blog | Matt Maitland";
export const size = ogSize;
export const contentType = "image/png";

export default function OgImage() {
  return createOgImage(
    "Blog",
    "Technical writing on web development, DSP, and implementation tradeoffs"
  );
}
