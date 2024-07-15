import babel from "rollup-plugin-babel";
import resolve from "rollup-plugin-node-resolve";
import postcss from "rollup-plugin-postcss";

export default {
	input: "src/index.js",
	output: {
		file: "dist/index.esm.js",
		format: "esm",
	},
	plugins: [
		postcss({
			modules: true,
		}),
		resolve({
			extensions: [".js", ".jsx"],
		}),
		babel({
			exclude: "node_modules/**",
			presets: ["@babel/preset-env", "@babel/preset-react"],
		}),
	],
    external: ['react']
};
