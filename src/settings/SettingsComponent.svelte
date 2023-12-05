<script lang="ts">
	import type { App } from "obsidian";
	import SettingItem from "./components/SettingItem.svelte";
	import { settings } from "./settingsstore";

	export let app: App;
</script>

<SettingItem>
	<span slot="name">Setting #1 in Vault {app.vault.getName()}</span>
	<span slot="description"> It's a secret </span>
	<input
		slot="control"
		type="text"
		bind:value={$settings.mySetting}
		spellcheck="false"
		placeholder=""
	/>
</SettingItem>
