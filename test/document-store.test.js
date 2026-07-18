import assert from "node:assert/strict";
import test from "node:test";

import { readDocument } from "../src/document-store.js";

test("reads a public document", async () => {
  assert.equal(await readDocument("welcome.txt"), "Welcome to the Veil test fixture.\n");
});

test("reads a nested public document", async () => {
  assert.equal(
    await readDocument("guides/getting-started.txt"),
    "This is a harmless nested public document.\n",
  );
});

test("rejects an empty document path", async () => {
  await assert.rejects(() => readDocument(""), {
    name: "TypeError",
    message: "requestedPath must be a non-empty string",
  });
});

test("reports a missing public document", async () => {
  await assert.rejects(() => readDocument("missing.txt"), {
    code: "ENOENT",
  });
});
