# QCBE-AISTUDIO (monorepo scaffold)

This repository is a TypeScript monorepo scaffold using pnpm workspaces. It contains three packages:

- packages/shared — a small TypeScript library (example `greet` function).
- packages/api — an Express API that imports `@qcbe/shared`.
- packages/ui — a Vite + React TypeScript app.

Quick start (after files are pushed):

1. Install pnpm (if you don't have it): https://pnpm.io/installation
2. From repo root:
   - pnpm install
   - pnpm -w build
   - cd packages/api && pnpm start        # runs built API
   - cd packages/ui && pnpm dev          # runs the UI in dev mode

Useful scripts (run from repo root):
- pnpm -w build         — build all packages
- pnpm -w -r build      — same, recursively
- pnpm -w test          — run tests (if any)
- pnpm -w lint          — run eslint across workspace

Notes:
- This scaffold uses TypeScript project references for the `shared` package (composite).
- The API expects the `shared` package to be built for `node` (tsc -b will produce dist files).
- The UI uses Vite and can import source TS files from workspace during development.
