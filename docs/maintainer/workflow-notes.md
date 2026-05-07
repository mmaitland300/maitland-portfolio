# Maintainer Workflow Notes

This file captures private-maintenance guidance for future repo work. It is not part of the public site narrative.

## Framework version check

This project tracks a current Next.js release. Before changing routing, server actions, metadata, caching, or config behavior, verify the local Next.js docs and migration notes that match the installed package version.

## Git and release

- Use a new branch from current `main` for routine work.
- Do not push to any remote unless the maintainer explicitly asked you to publish.
- Never push `origin/main` without explicit maintainer approval after review. See [CONTRIBUTING.md](../../CONTRIBUTING.md).
