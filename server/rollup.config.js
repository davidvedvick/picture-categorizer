import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

const env = process.env.NODE_ENV || 'development';

export default {
  input: './index.ts',
  output: {
    file: './build/index.mjs',
    sourcemap: env === 'development',
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