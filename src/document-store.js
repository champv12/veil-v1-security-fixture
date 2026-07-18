import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const moduleDirectory = path.dirname(fileURLToPath(import.meta.url));
const fixtureRoot = path.resolve(moduleDirectory, "../fixtures");
const publicRoot = path.join(fixtureRoot, "public");

/**
 * Read a UTF-8 document from the public fixture collection.
 *
 * The implementation is intentionally vulnerable for the Veil V1 exercise.
 * A separate outer boundary keeps the exercise confined to files under
 * this repository's fixtures directory.
 */
export async function readDocument(requestedPath) {
  if (typeof requestedPath !== "string" || requestedPath.length === 0) {
    throw new TypeError("requestedPath must be a non-empty string");
  }

  const decodedPath = decodeURIComponent(requestedPath);
  const targetPath = path.resolve(publicRoot, decodedPath);

  // This outer guard keeps the deliberately vulnerable exercise from reading
  // arbitrary host paths. It is not the public-directory authorization check.
  if (
    targetPath !== fixtureRoot &&
    !targetPath.startsWith(`${fixtureRoot}${path.sep}`)
  ) {
    throw new Error("Document path is outside the fixture sandbox");
  }

  return readFile(targetPath, "utf8");
}

export function getPublicRoot() {
  return publicRoot;
}
