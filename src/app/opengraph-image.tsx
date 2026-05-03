import { createOgImage, ogSize } from "@/lib/og-image";

export const runtime = "edge";
export const alt =
  "Matt Maitland | Technical support specialist and practical software builder";
export const size = ogSize;
export const contentType = "image/png";

export default function OgImage() {
  return createOgImage(
    "Matt Maitland",
    "Technical support specialist building practical web software, audio tools, and research prototypes"
  );
}
