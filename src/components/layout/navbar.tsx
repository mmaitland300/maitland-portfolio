"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteNavLinks } from "@/lib/site-nav";
import { VAULT_ROUTE } from "@/lib/vault-route";

const LOGO_VAULT_TAPS = 7;
/** Reset partial tap sequence after this many ms without another tap. */
const LOGO_VAULT_IDLE_MS = 2800;

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const logoVaultTapRef = useRef(0);
  const logoVaultIdleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const scheduleLogoVaultReset = useCallback(() => {
    if (logoVaultIdleTimerRef.current) {
      clearTimeout(logoVaultIdleTimerRef.current);
    }
    logoVaultIdleTimerRef.current = setTimeout(() => {
      logoVaultTapRef.current = 0;
      logoVaultIdleTimerRef.current = null;
    }, LOGO_VAULT_IDLE_MS);
  }, []);

  const onLogoClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (logoVaultIdleTimerRef.current) {
        clearTimeout(logoVaultIdleTimerRef.current);
        logoVaultIdleTimerRef.current = null;
      }

      logoVaultTapRef.current += 1;
      if (logoVaultTapRef.current >= LOGO_VAULT_TAPS) {
        logoVaultTapRef.current = 0;
        e.preventDefault();
        e.stopPropagation();
        router.push(VAULT_ROUTE);
        return;
      }

      scheduleLogoVaultReset();
    },
    [router, scheduleLogoVaultReset]
  );

  useEffect(() => {
    return () => {
      if (logoVaultIdleTimerRef.current) {
        clearTimeout(logoVaultIdleTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;

    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMobile();
    };

    const onClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        toggleRef.current &&
        !toggleRef.current.contains(e.target as Node)
      ) {
        closeMobile();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onClickOutside);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [mobileOpen, closeMobile]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/80 backdrop-blur-lg border-b border-border shadow-sm"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight"
          onClick={(e) => {
            closeMobile();
            onLogoClick(e);
          }}
        >
          <span className="brand-mark">
            M<span className="brand-accent">M</span>
          </span>
        </Link>

        {/* Desktop */}
        <ul className="hidden md:flex items-center gap-1">
          {siteNavLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="navbar-indicator"
                      className="absolute inset-x-1 -bottom-px h-0.5 rounded-full bg-[linear-gradient(to_right,var(--brand-line-from),var(--brand-line-to))]"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Mobile toggle */}
        <button
          ref={toggleRef}
          className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-background/95 backdrop-blur-lg border-b border-border"
          >
            <ul
              data-testid="mobile-nav-menu"
              className="flex flex-col px-6 py-4 gap-1"
            >
              {siteNavLinks.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={closeMobile}
                      className={cn(
                        "block px-4 py-3 text-sm font-medium rounded-md transition-colors",
                        isActive
                          ? "text-foreground bg-muted"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
