import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

export default {
  input: './index.ts',
  output: {
    file: './build/index.js',
  },
  plugins: [
    commonjs({
      ignoreDynamicRequires: true,
    }),
    nodeResolve({
      preferBuiltins: true,
      // include: "node_modules/**",
    }),
    json(),
    typescript(),
  ]
};