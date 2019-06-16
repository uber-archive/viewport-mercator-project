import path from "path";
import babel from "rollup-plugin-babel";
import pkg from "./package.json";

const input = "./src/index.js";
const external = id => !id.startsWith(".") && !path.isAbsolute(id);

export default [
  {
    input,
    output: {
      file: pkg.main,
      format: "cjs",
      exports: "named",
      sourcemap: true
    },
    external,
    plugins: [
      babel({
        runtimeHelpers: true,
        presets: ["@babel/env"],
        plugins: ["@babel/transform-runtime", "version-inline"]
      })
    ]
  },
  {
    input,
    output: { file: pkg.module, format: "esm", sourcemap: true },
    external,
    plugins: [
      babel({
        runtimeHelpers: true,
        presets: ["@babel/env"],
        plugins: [
          ["@babel/transform-runtime", { useESModules: true }],
          "version-inline"
        ]
      })
    ]
  },
  {
    input,
    output: { file: pkg.esnext, format: "esm", sourcemap: true },
    external,
    plugins: [
      babel({
        runtimeHelpers: true,
        presets: [
          [
            "@babel/env",
            {
              targets: {
                chrome: "60",
                edge: "15",
                firefox: "53",
                ios: "10.3",
                safari: "10.1",
                node: "8"
              }
            }
          ]
        ],
        plugins: [
          ["@babel/transform-runtime", { useESModules: true }],
          "version-inline"
        ]
      })
    ]
  }
];
