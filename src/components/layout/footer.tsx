import Link from "next/link";
import { Github, Mail, Music2 } from "lucide-react";
import { getPublicMailtoHref } from "@/lib/site-contact";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/music", label: "Music" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  const socialLinks = [
    {
      href: "https://github.com/mmaitland300",
      label: "GitHub",
      icon: Github,
    },
    {
      href: "https://soundcloud.com/matthew_maitland",
      label: "SoundCloud",
      icon: Music2,
    },
    {
      href: getPublicMailtoHref(),
      label: "Email",
      icon: Mail,
    },
  ];

  return (
    <footer className="relative z-10 border-t border-border bg-background/50 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Brand */}
          <div>
            <Link href="/" className="text-xl font-bold tracking-tight">
              <span className="brand-mark">
                Matt <span className="brand-accent">Maitland</span>
              </span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground max-w-xs">
              Engineer focused on reliable web systems, production
              troubleshooting, and delivery under tight constraints.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Navigation
            </h3>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Connect
            </h3>
            <div className="flex gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel={
                    link.href.startsWith("mailto:")
                      ? undefined
                      : "noopener noreferrer"
                  }
                  className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  aria-label={link.label}
                >
                  <link.icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Matt Maitland. All rights
            reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built with Next.js, TypeScript & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
