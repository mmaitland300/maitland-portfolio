"use client";

import { useActionState } from "react";
import { CheckCircle2, AlertCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { joinWaitlist, type WaitlistState } from "@/actions/stringflux-waitlist";

const initialState: WaitlistState = {
  success: false,
  message: "",
};

export function StringFluxWaitlistForm() {
  const [state, formAction, pending] = useActionState(joinWaitlist, initialState);

  if (state.success) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div className="p-3 rounded-full bg-green-500/10 mb-4">
          <CheckCircle2 className="h-8 w-8 text-green-500" />
        </div>
        <h3 className="text-xl font-semibold mb-2">You&apos;re on the list.</h3>
        <p className="text-muted-foreground max-w-sm">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      {state.message && !state.success && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {state.message}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="wl-email">Email address</Label>
        <Input
          id="wl-email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          className="bg-card/50"
          aria-describedby="wl-consent"
        />
        {state.errors?.email && (
          <p className="text-xs text-destructive">{state.errors.email[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="wl-interest" className="flex items-center gap-1">
          What draws you to StringFlux?
          <span className="text-xs text-muted-foreground font-normal ml-1">(optional)</span>
        </Label>
        <Input
          id="wl-interest"
          name="interest"
          type="text"
          placeholder="e.g. guitar texture layers, live performance, studio use..."
          maxLength={200}
          className="bg-card/50"
        />
      </div>

      {/* Honeypot */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <input type="text" name="_hp" tabIndex={-1} autoComplete="off" />
      </div>

      <Button
        type="submit"
        variant="brandCta"
        disabled={pending}
        className="w-full sm:w-auto"
      >
        {pending ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Sending...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Mail className="h-4 w-4" /> Request beta updates
          </span>
        )}
      </Button>

      <p id="wl-consent" className="text-xs text-muted-foreground leading-relaxed">
        You&apos;ll get one email when StringFlux is ready for beta or release. No spam.
        You can unsubscribe at any time by replying to that email.
      </p>
    </form>
  );
}
