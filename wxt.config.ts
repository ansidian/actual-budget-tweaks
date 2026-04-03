import { defineConfig } from "wxt";
import { resolve } from "path";

export default defineConfig({
	srcDir: "src",
	outDir: resolve(__dirname, ".."),
	outDirTemplate: "actual-budget-tweaks-0.1.15-chrome",
	modules: ["@wxt-dev/module-svelte"],
	manifest: {
		name: "Actual Budget – Tweaks",
		description: "",
		permissions: ["storage"],
		browser_specific_settings: {
			gecko: {
				data_collection_permissions: {
					required: ["none"],
				},
			},
		},
		content_scripts: [
			{
				matches: ["<all_urls>"],
				css: ["content-scripts/income-breakdown.css"],
				js: ["content-scripts/income-breakdown-loader.js"],
			},
		],
		web_accessible_resources: [
			{
				resources: [
					"css/base.css",
					"lib/d3.min.js",
					"lib/d3-sankey.min.js",
					"content-scripts/income-breakdown.js",
				],
				matches: ["<all_urls>"],
			},
		],
	},
});
