import { ExecException, exec } from "child_process";
import { promisify } from "util";
import { watch } from "chokidar";

async function runCommand(command: string) {
  try {
    await promisify(exec)(command);
  } catch (e) {
    const error = e as ExecException & { stderr?: string };
    if (error.stderr) {
      console.error(error.stderr);
    } else {
      console.error(error.message);
    }
  }
}

function resetCursor() {
  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);
}

function displaySpinner(interval: number) {
  const spinner = ["|", "/", "-", "\\"];
  let current = 0;
  const handle = setInterval(() => {
    resetCursor();
    process.stdout.write(`${spinner[current]} Building...`);
    current = (current + 1) % spinner.length;
  }, interval);
  return handle;
}

watch("**/*.ts", { ignored: "index.ts" }).on("change", async (path) => {
  console.log(`\x1b[1m${path}\x1b[0m`);
  // Bun currently supports only esm @see https://bun.sh/docs/bundler#format
  // Bun.build({
  // 	entrypoints: [path],
  //   outdir: path.slice(0, path.lastIndexOf("/")),
  //   format: "cjs",
  // });
  const js = `${path.slice(0, path.lastIndexOf("."))}.js`;
  const handle = displaySpinner(100);
  await runCommand(`bunx swc ${path} -o ${js}`);
  await runCommand(`bunx jscad ${js}`);
  clearInterval(handle);
  resetCursor();
  console.log("Building...\nDone!");
});
