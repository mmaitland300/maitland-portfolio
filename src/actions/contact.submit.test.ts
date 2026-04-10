import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const { sendMock } = vi.hoisted(() => ({ sendMock: vi.fn() }));

vi.mock("next/headers", () => ({
  headers: vi.fn(async () => new Headers({ "x-forwarded-for": "198.51.100.2" })),
}));

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: sendMock };
  },
}));

import { submitContact } from "./contact";

function contactForm(overrides: Partial<Record<string, string>> = {}) {
  const fd = new FormData();
  fd.set("name", overrides.name ?? "Test User");
  fd.set("email", overrides.email ?? "visitor@example.com");
  fd.set(
    "message",
    overrides.message ?? "This is a valid message body for the contact form."
  );
  fd.set("_hp", overrides._hp ?? "");
  return fd;
}

describe("submitContact server action", () => {
  beforeEach(() => {
    sendMock.mockReset();
    sendMock.mockResolvedValue({ data: { id: "re_msg_test" }, error: null });

    process.env.RESEND_API_KEY = "re_test_key";
    process.env.CONTACT_FROM_EMAIL = "from@example.com";
    process.env.CONTACT_TO_EMAIL = "to@example.com";
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
    delete process.env.DATABASE_URL;
    delete process.env.DIRECT_URL;
  });

  afterEach(() => {
    delete process.env.RESEND_API_KEY;
    delete process.env.CONTACT_FROM_EMAIL;
    delete process.env.CONTACT_TO_EMAIL;
  });

  it("sends via Resend and returns success when delivery env is configured", async () => {
    const prev = { success: false as const, message: "" };
    const result = await submitContact(prev, contactForm());

    expect(result).toEqual({
      success: true,
      message: "Thanks for reaching out! I'll get back to you soon.",
    });
    expect(sendMock).toHaveBeenCalledTimes(1);
    const payload = sendMock.mock.calls[0][0] as {
      from: string;
      to: string;
      replyTo: string;
      subject: string;
      text: string;
    };
    expect(payload.from).toBe("from@example.com");
    expect(payload.to).toBe("to@example.com");
    expect(payload.replyTo).toBe("visitor@example.com");
    expect(payload.subject).toBe("Site contact: Test User");
    expect(payload.text).toContain("visitor@example.com");
    expect(payload.text).toContain("This is a valid message body");
  });

  it("returns failure when Resend throws", async () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    try {
      sendMock.mockRejectedValueOnce(new Error("Resend outage"));

      const prev = { success: false as const, message: "" };
      const result = await submitContact(prev, contactForm());

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.message).toMatch(/try again later/i);
      }
    } finally {
      consoleError.mockRestore();
    }
  });

  it("does not call Resend when honeypot is filled (bot)", async () => {
    const prev = { success: false as const, message: "" };
    const result = await submitContact(
      prev,
      contactForm({ _hp: "http://spam.example" })
    );

    expect(result.success).toBe(false);
    expect(sendMock).not.toHaveBeenCalled();
  });
});
