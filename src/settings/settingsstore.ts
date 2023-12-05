import type ObsidianDistillerPlugin from "src/main";
import type { ObsidianDistillerSettings } from "src/settings/types";
import { type Writable, writable } from "svelte/store";

export let settings: Writable<ObsidianDistillerSettings>;

export function init(plugin: ObsidianDistillerPlugin) {
	if (settings) {
		return;
	}
	const { subscribe, set, update } = writable(plugin.settings);
	settings = {
		subscribe,
		update,
		// save the plugin values when setting the store
		set: (value: ObsidianDistillerSettings) => {
			set(value);
			plugin.saveSettings();
		},
	};
}
