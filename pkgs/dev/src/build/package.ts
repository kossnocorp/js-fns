import fs from "node:fs/promises";
import path from "node:path";
import { build, type OutputChunk } from "rolldown";
import { $, glob } from "zx";

export async function buildPackage(packageDir: string) {
  const cwd = path.resolve(packageDir);
  const srcDir = path.join(cwd, "src");
  const outDir = path.join(cwd, "dist");

  await fs.rm(outDir, { recursive: true, force: true });
  await fs.mkdir(outDir, { recursive: true });

  await $({ cwd })`pnpm exec tsc --project tsconfig.dist.json`;
  await buildFormat(srcDir, outDir, "esm");
  await buildFormat(srcDir, outDir, "cjs");
  await copyStaticFiles(srcDir, outDir);
  await copyPackageFiles(cwd, outDir);
  await buildCts(outDir);
  await preparePackageJson(outDir);
  const [jsFiles, tsFiles] = await Promise.all([
    glob("**/*.*js", { cwd: outDir }),
    glob("**/*.ts", { cwd: outDir }),
  ]);
  await $({ cwd: outDir })`pnpm exec oxfmt ${jsFiles} ${tsFiles}`;
}

async function buildFormat(
  srcDir: string,
  outDir: string,
  format: "esm" | "cjs",
) {
  const entries = Object.fromEntries(
    (await listEntries(srcDir)).map((file) => [
      path.relative(srcDir, file).replace(/\.[^.]+$/, ""),
      file,
    ]),
  );

  const extension = format === "esm" ? "js" : "cjs";

  await build({
    input: entries,
    external: () => true,
    optimization: { inlineConst: false },
    resolve: { symlinks: false },
    output: {
      dir: outDir,
      preserveModules: true,
      preserveModulesRoot: srcDir,
      entryFileNames: `[name].${extension}`,
      format,
      plugins: [rewriteImportExtensions(format)],
      exports: "named",
    },
  });
}

async function listEntries(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const filePath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (isIgnoredPath(filePath)) continue;
      files.push(...(await listEntries(filePath)));
    } else if (entry.isSymbolicLink()) {
      const stats = await fs.stat(filePath);

      if (stats.isDirectory()) {
        if (isIgnoredPath(filePath)) continue;
        files.push(...(await listEntries(filePath)));
      } else if (stats.isFile() && isSourceEntry(filePath)) {
        files.push(filePath);
      }
    } else if (entry.isFile() && isSourceEntry(filePath)) {
      files.push(filePath);
    }
  }

  return files;
}

function isSourceEntry(filePath: string) {
  const ext = path.extname(filePath);
  return (
    (ext === ".ts" || ext === ".js") &&
    !filePath.endsWith(".d.ts") &&
    !isIgnoredPath(filePath)
  );
}

function isStaticFile(filePath: string) {
  return [".md", ".json", ".toml", ".kdl", ".yaml", ".yml"].includes(
    path.extname(filePath).toLowerCase(),
  );
}

function isIgnoredPath(filePath: string) {
  return (
    /(^|\/)tests?($|\/|\.)/.test(filePath) ||
    /(^|\/)tysts?($|\/|\.)/.test(filePath) ||
    /(^|\/)tp($|\/)/.test(filePath) ||
    /\.test\.[jt]s$/.test(filePath) ||
    /\.tyst\.[jt]s$/.test(filePath)
  );
}

function rewriteImportExtensions(format: "esm" | "cjs") {
  const ext = format === "esm" ? ".js" : ".cjs";
  return {
    name: "rewrite-import-extensions",
    renderChunk(code: string, chunk: OutputChunk) {
      const nextCode = code.replace(
        /(from\s*["']|import\(\s*["']|require\(\s*["'])(\.{1,2}\/[^"']+?)(\.[jt]s)(["'])/g,
        (_match, prefix, importPath, _ext, suffix) =>
          `${prefix}${importPath}${ext}${suffix}`,
      );

      return nextCode === code
        ? null
        : { code: nextCode, map: chunk.map ?? null };
    },
  };
}

async function copyPackageFiles(cwd: string, outDir: string) {
  for (const file of [
    "package.json",
    "README.md",
    "LICENSE.md",
    "CHANGELOG.md",
  ]) {
    const source = path.join(cwd, file);
    try {
      await fs.copyFile(source, path.join(outDir, file));
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }
  }
}

async function copyStaticFiles(srcDir: string, outDir: string) {
  for (const file of await listFiles(srcDir)) {
    if (!isStaticFile(file) || isIgnoredPath(file)) continue;

    const destination = path.join(outDir, path.relative(srcDir, file));
    await fs.mkdir(path.dirname(destination), { recursive: true });
    await fs.copyFile(file, destination);
  }
}

async function buildCts(outDir: string) {
  for (const file of await listFiles(outDir)) {
    if (!file.endsWith(".d.ts")) continue;
    const ctsFile = file.replace(/\.d\.ts$/, ".d.cts");
    const content = await fs.readFile(file, "utf8");
    await fs.writeFile(
      ctsFile,
      content.replace(/\.js"/g, '.cjs"').replace(/\.ts"/g, '.cts"'),
    );
  }
}

async function listFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const filePath = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await listFiles(filePath)));
    else if (entry.isFile()) files.push(filePath);
  }

  return files;
}

async function preparePackageJson(outDir: string) {
  const file = path.join(outDir, "package.json");
  const pkg = JSON.parse(await fs.readFile(file, "utf8"));
  const publishConfig = pkg.publishConfig ?? {};

  Object.assign(pkg, publishConfig);
  delete pkg.devDependencies;
  delete pkg.scripts;
  delete pkg.publishConfig;

  await fs.writeFile(file, `${JSON.stringify(pkg, null, 2)}\n`);
}
