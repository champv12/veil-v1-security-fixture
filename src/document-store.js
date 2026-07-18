import { readFile, realpath, stat } from "node:fs/promises";
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
  if (path.isAbsolute(decodedPath) || path.win32.isAbsolute(decodedPath)) {
    throw new Error("Document path is outside the public directory");
  }

  const targetPath = path.resolve(publicRoot, decodedPath);

  // This outer guard keeps the deliberately vulnerable exercise from reading
  // arbitrary host paths. It is not the public-directory authorization check.
  if (
    targetPath !== fixtureRoot &&
    !targetPath.startsWith(`${fixtureRoot}${path.sep}`)
  ) {
    throw new Error("Document path is outside the fixture sandbox");
  }

  const relativePath = path.relative(publicRoot, targetPath);
  if (
    relativePath === ".." ||
    relativePath.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relativePath)
  ) {
    throw new Error("Document path is outside the public directory");
  }

  const resolvedPath = await realpath(targetPath);

  // Keep the fixture-wide host-safety boundary in force for resolved links.
  if (
    resolvedPath !== fixtureRoot &&
    !resolvedPath.startsWith(`${fixtureRoot}${path.sep}`)
  ) {
    throw new Error("Document path is outside the fixture sandbox");
  }

  const resolvedRelativePath = path.relative(publicRoot, resolvedPath);
  if (
    resolvedRelativePath === ".." ||
    resolvedRelativePath.startsWith(`..${path.sep}`) ||
    path.isAbsolute(resolvedRelativePath)
  ) {
    throw new Error("Document path is outside the public directory");
  }

  if (!(await stat(resolvedPath)).isFile()) {
    throw new Error("Document path is not a regular file");
  }

  return readFile(resolvedPath, "utf8");
}

export function getPublicRoot() {
  return publicRoot;
}
