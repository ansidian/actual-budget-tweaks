function isContextInvalidated(): boolean {
	try {
		return !browser.runtime?.id;
	} catch {
		return true;
	}
}

export async function getValue(key: string, defaultValue: unknown) {
	if (isContextInvalidated()) return defaultValue;
	try {
		const result = await browser.storage.local.get("local:" + key);
		return result["local:" + key] ?? defaultValue;
	} catch {
		return defaultValue;
	}
}

export function setValue(key: string, value: unknown) {
	if (isContextInvalidated()) return Promise.resolve();
	try {
		return browser.storage.local.set({ ["local:" + key]: value });
	} catch {
		return Promise.resolve();
	}
}

export async function getBaseUrl() {
	const userLink = await getValue("user-link", null);
	if (!userLink) return null;
	try {
		const url = new URL(userLink);
		return `${url.protocol}//${url.host}/`;
	} catch (e) {
		return null;
	}
}
