import typescript from "@rollup/plugin-typescript";
import del from "rollup-plugin-delete";
import resolve from '@rollup/plugin-node-resolve';
import linkGlobal from "./rollupPlugins/linkGlobal.js";

/**
 * @type {import('rollup').RollupOptions}
 */
const rollupOptions = [{
  input: "lib/index.ts",
  output: [
    {
      format: "esm",
      file: "dist/index.mjs",
    },
  ],
  external: ["yargs"],
  plugins: [
    typescript({
      checkJs: false,
      declaration: true,
      exclude: ["rollup.config.ts"],
      declarationDir: "dist/types",
    }),
    resolve(),
    del({ targets: "dist/*" }),
    // linkGlobal()
  ],
}]

export default rollupOptions;