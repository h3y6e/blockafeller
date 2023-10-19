import { exec } from "child_process";
import { promisify } from "util";
import { watch } from "chokidar";

async function runCommand(command: string) {
  try {
    await promisify(exec)(command);
  } catch (e) {
    // biome-ignore lint/suspicious/noExplicitAny: any is fine here
    console.error((e as any).stderr.toString());
  }
}

watch("**/*.ts", { ignored: "index.ts" }).on("change", (path) => {
  console.log(`Building ${path}...`);
  // Bun currently supports only esm @see https://bun.sh/docs/bundler#format
  // Bun.build({
  // 	entrypoints: [path],
  //   outdir: path.slice(0, path.lastIndexOf("/")),
  //   format: "cjs",
  // });
  const js = `${path.slice(0, path.lastIndexOf("."))}.js`;
  runCommand(`bunx swc ${path} -o ${js}`);
  runCommand(`bunx jscad ${js}`);
});
