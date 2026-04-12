# Security

Please do not file public issues for undisclosed security problems.

**Preferred:** If private vulnerability reporting is enabled on this repository, use [Report a vulnerability](https://github.com/mmaitland300/mmaitland-portfolio/security) (GitHub Security) for this repo.

**Alternative:** Contact the maintainer privately via [www.mmaitland.dev](https://www.mmaitland.dev) or the GitHub profile linked there.

## Abuse resistance (public forms)

Contact and Stringflux waitlist server actions validate input with **Zod** and use a **honeypot** field. **IP-based sliding-window rate limiting** (Upstash Redis) runs only when both `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are configured. Without Redis, abuse resistance is **validation + honeypot only**; treat Redis as recommended for any deployment that expects meaningful public traffic.

## Admin access

There is **no `middleware.ts` auth gate**. `/admin` is protected by a **layout** that checks the session and **`isAdmin()`** (GitHub user ID allowlist). That is intentional and consistent with optional auth: unauthenticated users see login or unavailable states without a global middleware dependency.

## HTTP headers and CSP

`next.config.ts` sets **X-Frame-Options**, **X-Content-Type-Options**, **Referrer-Policy**, and **Permissions-Policy** on responses. A full **Content-Security-Policy** is **not** deployed: third-party embeds (for example audio players), MDX content, and framework behavior make a strict CSP non-trivial without a dedicated tuning pass. Adding CSP later would be a security hardening improvement, not a prerequisite for the current threat model.

## Errors and observability

Server-side failures that matter for operators are logged with **`console.error`** (for example Resend failures, optional DB persistence). There is no Sentry, Datadog, or similar APM wired in; at current scale that is acceptable. For a production operations story, add an error reporting integration in a dedicated change.
