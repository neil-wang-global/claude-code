#!/usr/bin/env bun
/**
 * Build script for Claude Code source project.
 *
 * Usage: bun run build.ts
 *
 * Bundles src/entrypoints/cli.tsx → cli.js (single ESM file)
 */

import { type BunPlugin } from "bun";
import fs from "node:fs";
import path from "node:path";

const ROOT = import.meta.dir;
const VERSION = JSON.parse(
  fs.readFileSync(path.join(ROOT, "package.json"), "utf-8")
).version;

// ─── Step 1: Create stubs for missing source files ───────────────────────

function createMissingStubs() {
  console.log("[build] Creating stubs for missing source files...");
  let count = 0;

  const stubs: Record<string, string> = {
    // Missing internal tools
    "src/tools/REPLTool/REPLTool.ts": `export const REPLTool = {
  name: "REPLTool", isEnabled: () => false, isReadOnly: () => false,
  async call() { return { data: {} }; }, userFacingName() { return "REPLTool"; },
  prompt: "", description: "REPLTool (stub)",
};\nexport default REPLTool;\n`,
    "src/tools/SuggestBackgroundPRTool/SuggestBackgroundPRTool.ts": `export const SuggestBackgroundPRTool = {
  name: "SuggestBackgroundPRTool", isEnabled: () => false, isReadOnly: () => false,
  async call() { return { data: {} }; }, userFacingName() { return "SuggestBackgroundPRTool"; },
  prompt: "", description: "SuggestBackgroundPRTool (stub)",
};\nexport default SuggestBackgroundPRTool;\n`,
    "src/tools/VerifyPlanExecutionTool/VerifyPlanExecutionTool.ts": `export const VerifyPlanExecutionTool = {
  name: "VerifyPlanExecutionTool", isEnabled: () => false, isReadOnly: () => false,
  async call() { return { data: {} }; }, userFacingName() { return "VerifyPlanExecutionTool"; },
  prompt: "", description: "VerifyPlanExecutionTool (stub)",
};\nexport default VerifyPlanExecutionTool;\n`,

    // Missing internal components
    "src/components/agents/SnapshotUpdateDialog.tsx":
      'import React from "react";\nexport default function SnapshotUpdateDialog() { return null; }\nexport function showSnapshotUpdateDialog() {}\n',
    "src/assistant/AssistantSessionChooser.tsx":
      'import React from "react";\nexport default function AssistantSessionChooser() { return null; }\n',
    "src/commands/assistant/assistant.ts":
      "export function register() {}\nexport default { register };\n",

    // Missing compact service
    "src/services/compact/cachedMicrocompact.ts":
      "export function cachedMicrocompact() { return null; }\nexport default {};\n",

    // Missing ink devtools
    "src/ink/devtools.ts": "export {};\n",
  };

  for (const [relPath, content] of Object.entries(stubs)) {
    const absPath = path.join(ROOT, relPath);
    if (fs.existsSync(absPath)) continue;
    fs.mkdirSync(path.dirname(absPath), { recursive: true });
    fs.writeFileSync(absPath, content);
    count++;
  }

  console.log(`[build]   Created ${count} stub files`);
}

// ─── Step 2: Bun plugins ─────────────────────────────────────────────────

const bunBundlePlugin: BunPlugin = {
  name: "bun-bundle-shim",
  setup(build) {
    build.onResolve({ filter: /^bun:bundle$/ }, () => ({
      path: "bun:bundle",
      namespace: "bun-bundle-shim",
    }));
    build.onLoad({ filter: /.*/, namespace: "bun-bundle-shim" }, () => ({
      contents: `export function feature() { return true; }`,
      loader: "js",
    }));
  },
};

const srcAliasPlugin: BunPlugin = {
  name: "src-alias",
  setup(build) {
    build.onResolve({ filter: /^src\// }, (args) => {
      const basePath = path.join(ROOT, args.path);
      if (fs.existsSync(basePath)) return { path: basePath };
      const withoutExt = basePath.replace(/\.js$/, "");
      for (const ext of [".ts", ".tsx", ".js", ".jsx", ".mjs"]) {
        const c = withoutExt + ext;
        if (fs.existsSync(c)) return { path: c };
      }
      for (const idx of ["/index.ts", "/index.tsx", "/index.js"]) {
        const c = withoutExt + idx;
        if (fs.existsSync(c)) return { path: c };
      }
      return undefined;
    });
  },
};

const textLoaderPlugin: BunPlugin = {
  name: "text-loader",
  setup(build) {
    build.onLoad({ filter: /\.md$/ }, (args) => ({
      contents: `export default ${JSON.stringify(
        fs.existsSync(args.path) ? fs.readFileSync(args.path, "utf-8") : ""
      )};`,
      loader: "js",
    }));
    build.onLoad({ filter: /\.txt$/ }, (args) => ({
      contents: `module.exports = ${JSON.stringify(
        fs.existsSync(args.path) ? fs.readFileSync(args.path, "utf-8") : ""
      )};`,
      loader: "js",
    }));
  },
};

// ─── Step 3: Build ───────────────────────────────────────────────────────

async function runBuild() {
  createMissingStubs();

  console.log(`[build] Building Claude Code v${VERSION}...`);
  const startTime = Date.now();

  const result = await Bun.build({
    entrypoints: [path.join(ROOT, "src/entrypoints/cli.tsx")],
    outdir: ROOT,
    naming: "cli.[ext]",
    target: "node",
    format: "esm",
    sourcemap: "external",
    minify: false,

    define: {
      "MACRO.VERSION": JSON.stringify(VERSION),
      "MACRO.BUILD_TIME": JSON.stringify(new Date().toISOString()),
      "MACRO.PACKAGE_URL": JSON.stringify("@anthropic-ai/claude-code"),
      "MACRO.NATIVE_PACKAGE_URL": JSON.stringify("@anthropic-ai/claude-code"),
      "MACRO.README_URL": JSON.stringify(
        "https://code.claude.com/docs/en/overview"
      ),
      "MACRO.FEEDBACK_CHANNEL": JSON.stringify(
        "https://github.com/anthropics/claude-code/issues"
      ),
      "MACRO.ISSUES_EXPLAINER": JSON.stringify(
        "report the issue at https://github.com/anthropics/claude-code/issues"
      ),
      "MACRO.VERSION_CHANGELOG": JSON.stringify(""),
    },

    plugins: [bunBundlePlugin, srcAliasPlugin, textLoaderPlugin],

    external: [
      // Native addons
      "*.node",
      "bun:ffi",
      "sharp",
      "detect-libc",
      // Optional cloud/provider SDKs (dynamic imports, not needed at build time)
      "@anthropic-ai/bedrock-sdk",
      "@anthropic-ai/foundry-sdk",
      "@anthropic-ai/vertex-sdk",
      "@azure/identity",
      "@aws-sdk/client-bedrock",
      "@aws-sdk/client-bedrock-runtime",
      "@aws-sdk/client-sts",
      // Optional telemetry exporters
      "@opentelemetry/exporter-metrics-otlp-grpc",
      "@opentelemetry/exporter-metrics-otlp-http",
      "@opentelemetry/exporter-metrics-otlp-proto",
      "@opentelemetry/exporter-prometheus",
      "@opentelemetry/exporter-logs-otlp-grpc",
      "@opentelemetry/exporter-logs-otlp-http",
      "@opentelemetry/exporter-logs-otlp-proto",
      "@opentelemetry/exporter-trace-otlp-grpc",
      "@opentelemetry/exporter-trace-otlp-http",
      "@opentelemetry/exporter-trace-otlp-proto",
      // Optional heavy deps
      "turndown",
    ],
  });

  if (!result.success) {
    console.error("[build] Build failed:");
    for (const log of result.logs) {
      console.error(" ", log);
    }
    process.exit(1);
  }

  // Add shebang
  const cliPath = path.join(ROOT, "cli.js");
  if (fs.existsSync(cliPath)) {
    const content = fs.readFileSync(cliPath, "utf-8");
    if (!content.startsWith("#!")) {
      fs.writeFileSync(
        cliPath,
        `#!/usr/bin/env node\n// Claude Code v${VERSION}\n${content}`
      );
    }
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  const size = fs.existsSync(cliPath)
    ? (fs.statSync(cliPath).size / 1024 / 1024).toFixed(1)
    : "?";
  console.log(`[build] Done in ${elapsed}s — cli.js (${size} MB)`);
}

runBuild().catch((err) => {
  console.error("[build] Fatal:", err);
  process.exit(1);
});
