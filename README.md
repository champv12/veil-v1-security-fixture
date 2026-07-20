# Veil V1 Security Fixture

> **Test-only infrastructure — not a Veil product or distribution repository.**

This is an intentionally vulnerable, dependency-free Node.js repository created solely for testing Veil V1. Do not deploy it, reuse its file-access implementation, or treat it as a production example. Veil downloads, Homebrew files, and the Codex marketplace live only in [`champv12/veil-releases`](https://github.com/champv12/veil-releases).

The repository contains only synthetic fixture data. Its outer sandbox prevents the exercise from accessing files outside this repository's `fixtures` directory. The intentional authorization flaw is still sufficient for a repair agent and an independent evaluator to exercise Veil's private-brief, snapshot, comparison, and selective-publication workflow.

## Public API contract

`readDocument(requestedPath)` in `src/document-store.js` must:

- accept a non-empty string path relative to `fixtures/public`;
- decode URL-encoded path input;
- return the selected UTF-8 public document;
- preserve valid nested reads such as `guides/getting-started.txt`;
- reject invalid input and unavailable documents;
- never expose documents outside `fixtures/public`.

The last requirement is intentionally not satisfied by the initial implementation. The repository does not contain the repair, a private security brief, or the maintainer-owned evaluation suite.

## Requirements

- Node.js 24 or newer
- npm

## Run the public baseline

```bash
npm install
npm test
```

The public tests intentionally cover normal behavior only and pass on the vulnerable base commit. A Veil test should provide its security objective privately and evaluate candidate snapshots independently.

## Safety boundary

All apparent sensitive content is fake and lives inside `fixtures`. Do not alter the fixture to point at real credentials, home-directory files, environment files, or external services.
