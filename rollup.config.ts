import typescript from "@rollup/plugin-typescript";
import del from "rollup-plugin-delete";
import resolve from '@rollup/plugin-node-resolve';
import linkGlobal from "./rollupPlugins/linkGlobal";

import { RollupOptions } from "rollup";
const rollupOptions: RollupOptions = {
  input: "lib/index.ts",
  output: [
    {
      format: "esm",
      file: "dist/index.mjs",
    },
  ],
  external: ["yargs"],
  plugins: [
    resolve(),
    typescript({
      checkJs: false,
      declaration: true,
      //编译的时候，就不要包括rollup.config.ts了
      exclude: ["rollup.config.ts"],
      declarationDir: "dist/types",
    }),
    del({ targets: "dist/*" }),
    linkGlobal(),
  ],
}

export default rollupOptions;