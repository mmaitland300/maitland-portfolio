"use client";

import { useActionState, useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { submitContact, type ContactState } from "@/actions/contact";

const initialState: ContactState = {
  success: false,
  message: "",
};

export function ContactForm() {
  const [instanceKey, setInstanceKey] = useState(0);

  return (
    <ContactFormInstance
      key={instanceKey}
      onReset={() => setInstanceKey((key) => key + 1)}
    />
  );
}

interface ContactFormInstanceProps {
  onReset: () => void;
}

function ContactFormInstance({ onReset }: ContactFormInstanceProps) {
  const [state, formAction, pending] = useActionState(
    submitContact,
    initialState
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {state.success ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="p-3 rounded-full bg-success/10 mb-4">
            <CheckCircle2 className="h-8 w-8 text-success" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
          <p className="text-muted-foreground mb-6">{state.message}</p>
          <Button
            variant="outline"
            onClick={onReset}
          >
            Send Another Message
          </Button>
        </div>
      ) : (
        <form
          action={formAction}
          className="space-y-6"
        >
          {state.message && !state.success && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {state.message}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Your name"
                required
                className="bg-card/50"
              />
              {state.errors?.name && (
                <p className="text-xs text-destructive">{state.errors.name[0]}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                className="bg-card/50"
              />
              {state.errors?.email && (
                <p className="text-xs text-destructive">
                  {state.errors.email[0]}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Tell me about your project, idea, or just say hi..."
              rows={6}
              required
              className="bg-card/50 resize-none"
            />
            {state.errors?.message && (
              <p className="text-xs text-destructive">
                {state.errors.message[0]}
              </p>
            )}
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
                <Send className="h-4 w-4" /> Send Message
              </span>
            )}
          </Button>
        </form>
      )}
    </motion.div>
  );
}
