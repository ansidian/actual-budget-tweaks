import Settings from "@/lib/ActualSettings.svelte";
import { scripts } from "@/lib/scripts";
import { createElement } from "@/lib/utilities/dom";
import { getBaseUrl } from "@/lib/utilities/store";
import { mount, unmount } from "svelte";

export default defineContentScript({
	matches: ["<all_urls>"],
	cssInjectionMode: "manual",
	main(ctx) {
		function isContextInvalidated(): boolean {
			try {
				return !browser.runtime?.id;
			} catch {
				return true;
			}
		}

		async function checkAndMount() {
			if (isContextInvalidated()) return;

			const baseUrl = await getBaseUrl();
			if (baseUrl && window.location.href.startsWith(baseUrl)) {
				let baseCss: string;
				let componentCss: string;
				try {
					baseCss = browser.runtime.getURL("/css/base.css");
					componentCss = browser.runtime.getURL(
						"/content-scripts/content.css"
					);
				} catch {
					return; // Extension context invalidated
				}

				document.body.appendChild(
					createElement("link", {
						rel: "stylesheet",
						href: baseCss,
					})
				);
				document.body.appendChild(
					createElement("link", {
						rel: "stylesheet",
						href: componentCss,
					})
				);

				for (const setting of scripts.flat()) {
					if (setting.init) {
						// @ts-ignore -- TODO: fix this type error
						setting.init(setting.context);
					}
				}

				const ui = createIntegratedUi(ctx, {
					position: "inline",
					anchor: "[data-testid='settings'] > :nth-child(2)",
					onMount: (container) => {
						const parent = container.parentElement;
						if (parent) {
							parent.innerHTML = "";
							return mount(Settings, { target: parent });
						}
					},
					onRemove: (app) => {
						if (app) unmount(app);
					},
				});

				ui.autoMount();
			}
		}

		checkAndMount();
		ctx.addEventListener(window, "wxt:locationchange", () => {
			checkAndMount();
		});
	},
});
