import typescript from "@rollup/plugin-typescript";
import del from "rollup-plugin-delete";
import resolve from '@rollup/plugin-node-resolve';

import { RollupOptions } from "rollup";
const rollupOptions: RollupOptions = {
  input: "lib/index.ts",
  output: [
    {
      format: "esm",
      file: "dist/index.mjs",
    },
  ],
  external: ["yargs", "yargs/helpers"],
  plugins: [
    typescript({
      checkJs: false,
      declaration: true,
      //编译的时候，就不要包括rollup.config.ts了
      exclude: ["rollup.config.ts"],
      declarationDir: "dist/types",
    }),
    resolve(),
    del({ targets: "dist/*" }),
  ],
}

export default rollupOptions;