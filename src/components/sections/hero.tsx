"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";

export function Hero() {
  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden pb-16 md:pb-20">
      <div className="cyber-frame mx-auto max-w-6xl px-6 py-24 text-center sm:py-28 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="cyber-pill mb-6 inline-flex items-center gap-3 rounded-full px-4 py-2 text-xs font-medium uppercase tracking-[0.24em] text-[rgba(196,206,223,0.82)] backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[rgba(136,212,255,0.95)] shadow-[0_0_12px_rgba(67,188,255,0.45)]" />
            Systems Troubleshooting - Web Application Design - Audio DSP
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="text-5xl font-semibold leading-[1.02] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
        >
          <span className="hero-lead">Hi, I&apos;m</span>{" "}
          <span className="cyber-title hero-name">Matt Maitland</span>
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          className="mt-5 mx-auto max-w-4xl text-2xl font-semibold leading-tight text-foreground/95 sm:text-3xl"
        >
          I debug production systems and build software around the same discipline.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="mt-6 mx-auto max-w-3xl text-lg leading-relaxed text-[rgba(194,203,220,0.82)] sm:text-xl"
        >
          I work at Auxillium supporting Full Swing simulator environments where
          hardware, software, networking, and OS behavior overlap. Outside of work
          I build web software and other side projects that interest me. This site
          is where those interests meet: troubleshooting, software, and sound.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.22, ease: "easeOut" }}
          className="mx-auto mt-5 max-w-xl space-y-1.5 text-center text-sm leading-relaxed text-[rgba(194,203,220,0.78)] sm:text-base"
        >
          <p>
            <Link
              href="/stringflux"
              className="font-medium text-foreground/90 underline-offset-4 hover:underline"
            >
              StringFlux
            </Link>
            <span className="text-muted-foreground">
              {" "}
              — JUCE plugin: transient-aware granular delay and freeze for guitar
            </span>
          </p>
          <p>
            <Link
              href="/music"
              className="font-medium text-foreground/90 underline-offset-4 hover:underline"
            >
              NEUROCHEMICAL ENTROPY
            </Link>
            <span className="text-muted-foreground">
              {" "}
              — original music (write, record, produce, master)
            </span>
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: "easeOut" }}
          className="mt-4 mx-auto max-w-2xl text-center text-sm leading-relaxed text-muted-foreground sm:text-base"
        >
          <Link
            href="/projects"
            className="text-foreground/90 underline-offset-4 hover:underline"
          >
            Case studies
          </Link>
          {" and "}
          <Link
            href="/blog"
            className="text-foreground/90 underline-offset-4 hover:underline"
          >
            engineering notes
          </Link>
          {" document constraints, evidence, and limits."}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/projects"
            className={buttonVariants({
              size: "lg",
              className:
                "bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white border-0 shadow-lg shadow-purple-500/25",
            })}
          >
            See Case Studies <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link
            href="/contact"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            Get in Touch
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className="mt-4 flex items-center justify-center gap-6 text-sm text-muted-foreground"
        >
          <a
            href="https://github.com/mmaitland300"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            GitHub
          </a>
          <Link href="/music" className="hover:text-foreground transition-colors">
            Music
          </Link>
        </motion.div>

        {/* Scroll cue: in document flow so it clears ProofStrip / featured cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85, duration: 0.8 }}
          className="mt-10 flex justify-center sm:mt-12"
          aria-hidden={true}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="flex h-10 w-6 justify-center rounded-full border-2 border-muted-foreground/30 pt-2"
          >
            <div className="h-2 w-1 rounded-full bg-muted-foreground/50" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
