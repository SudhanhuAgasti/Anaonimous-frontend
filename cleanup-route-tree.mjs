import { unlink } from "node:fs/promises";
import { resolve } from "node:path";

const routeTreeTsPath = resolve(process.cwd(), "src/routeTree.gen.ts");

try {
  await unlink(routeTreeTsPath);
  console.log("Removed generated TypeScript route tree:", routeTreeTsPath);
} catch (error) {
  if (error && error.code === "ENOENT") {
    console.log("No generated TypeScript route tree found.");
  } else {
    console.error("Failed to remove generated TypeScript route tree:", error);
    process.exit(1);
  }
}
