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

for (const requestedPath of [
  "../restricted/decoy-record.txt",
  "%2e%2e%2frestricted%2fdecoy-record.txt",
  "../public-safe/decoy-record.txt",
  "/etc/passwd",
  "C:\\Windows\\win.ini",
]) {
  test(`rejects unauthorized path: ${requestedPath}`, async () => {
    await assert.rejects(() => readDocument(requestedPath));
  });
}

test("rejects a directory instead of reading it as a document", async () => {
  await assert.rejects(() => readDocument("guides"), {
    message: "Document path is not a regular file",
  });
});
