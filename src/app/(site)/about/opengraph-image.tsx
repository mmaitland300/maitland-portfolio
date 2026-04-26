import { createOgImage, ogSize } from "@/lib/og-image";

export const runtime = "edge";
export const alt = "About | Matt Maitland";
export const size = ogSize;
export const contentType = "image/png";

export default function OgImage() {
  return createOgImage(
    "About",
    "Technical support specialist and practical software builder"
  );
}
