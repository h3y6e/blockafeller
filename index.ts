import { watch } from "node:fs";
import path from "node:path";
import { $ } from "bun";

const watcher = watch(
  process.cwd(),
  { recursive: true },
  async (_, filename) => {
    if (
      !filename ||
      !filename.endsWith(".ts") ||
      filename.includes("node_modules") ||
      filename === "index.ts"
    ) {
      return;
    }

    try {
      const filePath = path.resolve(filename);
      const { outputs } = await Bun.build({
        entrypoints: [filePath],
        outdir: path.dirname(filePath),
        format: "cjs",
        packages: "external",
      });
      await $`bunx jscad ${outputs[0].path}`;
    } finally {
      process.stdout.write(`\rBuilding ${filename}... Done!     \n`);
    }
  },
);

process.on("SIGINT", () => {
  watcher.close();
  process.exit(0);
});
