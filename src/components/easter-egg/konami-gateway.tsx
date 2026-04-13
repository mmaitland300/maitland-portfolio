"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { advanceKonamiIndex } from "@/lib/konami-sequence";

const VAULT_PATH = "/vault";

function isTypingTarget(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false;
  if (el.closest("input, textarea, select, [contenteditable]")) return true;
  return el.isContentEditable;
}

/**
 * Listens for the Konami code on the marketing shell and navigates to `/vault`.
 * Renders nothing; skips when focus is in form fields.
 */
export function KonamiGateway() {
  const router = useRouter();
  const indexRef = useRef(0);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target)) return;

      const { index, complete } = advanceKonamiIndex(indexRef.current, e.code);
      indexRef.current = index;

      if (complete) {
        indexRef.current = 0;
        e.preventDefault();
        router.push(VAULT_PATH);
        return;
      }

      if (indexRef.current > 0) {
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", onKeyDown, { capture: true });
    return () => window.removeEventListener("keydown", onKeyDown, { capture: true });
  }, [router]);

  return null;
}
