# Contributing

This repo uses a lightweight workflow. Keep changes small, reviewable, and consistent.

## Branch and release workflow

- **Branch first:** do all work on a **new branch** off up-to-date `main` (one logical change per branch when practical). Do not commit directly on `main` for routine work.
- **Review before live:** open a **pull request** (or hand off the branch) and let the **maintainer review** before anything is merged to **`main`** / deployed.
- **No unapproved `git push`:** do not push to **any** remote (including feature branches) unless the maintainer explicitly asked you to publish that work. Never push **`origin/main`** without explicit approval after review.
- **CI:** keep PRs green with the same checks as [`.github/workflows/ci.yml`](.github/workflows/ci.yml) before requesting merge.

## Project intent

Contributions should respect the portfolio's **evidence-first** bar (see **Goals and intent** in [README.md](README.md)):

- **Featured projects** are expected to stay aligned with a real case study: constraints, outcomes, honest limits, and proof links where the site makes verifiable claims.
- **Copy and marketing-style changes** that affect what the site claims in public should be checked against [docs/proof-audit.md](docs/proof-audit.md); prefer tightening or softening language over unfounded claims.
- **Optional features** should remain safely gated by environment configuration so default and CI paths stay predictable.

## Commit Message Convention

Use this format:

`type(scope): summary`

Examples:

- `feat(contact): add reply status badges`
- `fix(ci): decouple build from migrate deploy`
- `docs(readme): clarify prisma env placeholders`

Rules:

- Use lowercase `type`.
- Keep `summary` concise and imperative.
- Add `scope` when a specific area is clear (`ci`, `admin`, `projects`, `docs`, etc.).
- Recommended types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`.
- Avoid generic subjects like `update` or `misc` for local WIP commits.
- GitHub merge commits titled `Merge pull request #...` are normal on `main` and do not need to follow the `type(scope):` pattern.

## Merge policy

- **Default:** land work on **`main`** only through a **pull request** after **maintainer review**, with **CI green** before merge.
- **No direct-to-`main` pushes** for routine changes; use a branch and PR (see **Branch and release workflow** above).
- **Default for this repo:** use GitHub's **merge commit** option (not squash-only) so PR boundaries stay visible in history. Write a clear **PR title** (and edit the merge commit subject when GitHub allows) so `git log` stays readable - conventional `type(scope):` titles are welcome when they fit.
- **Squash merge** is fine for small, single-concern PRs when you want one commit on `main`.
- Keep each PR focused on one concern; avoid unrelated drive-by changes in the same PR.

## Author Identity Checklist

Before opening a PR or committing:

1. Verify identity:
    - `git config user.name`
    - `git config user.email`
2. Confirm it matches your chosen project identity (pick one and keep it stable), including how you want commits to appear on GitHub (local Git vs web edits can use different emails if you are not deliberate about it).
3. If signing in via another machine/account, re-check before first commit.
4. After commit, confirm author on latest commit:
    - `git log -1 --format='%h %an <%ae> %s'`
5. Read the **full** commit message before you finalize; remove any trailing body lines you do not want in public history.

## Text and Encoding Guardrails

- Use ASCII punctuation in first-party docs/UI copy when possible.
- Avoid smart quotes/em dashes/bullets that can render as mojibake in some terminals.
- If copying text from external sources, quickly scan for encoding artifacts before commit.
