import type { Metadata } from "next";
import { MainContentAnchor } from "@/components/layout/main-content-anchor";
import { ContactForm } from "@/components/sections/contact-form";
import { Mail, MapPin } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { getPublicContactEmail } from "@/lib/site-contact";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Reach out about a project, technical question, or collaboration.",
};

export default function ContactPage() {
  const publicEmail = getPublicContactEmail();
  return (
    <div className="py-32">
      <MainContentAnchor />
      <div className="mx-auto max-w-4xl px-6">
        <SectionHeader
          eyebrow="Contact"
          title="Get in Touch"
          description="Have a question, a project to discuss, or something to troubleshoot? Send a message and I will get back to you."
          className="mb-16"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Info */}
          <div className="space-y-6 lg:col-span-1">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-brand-violet/10 shrink-0">
                <Mail className="h-5 w-5 text-brand-violet" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Email</h3>
                <p className="text-sm text-muted-foreground">{publicEmail}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-brand-cyan/10 shrink-0">
                <MapPin className="h-5 w-5 text-brand-cyan" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Location</h3>
                <p className="text-sm text-muted-foreground">
                  Colorado, USA
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
