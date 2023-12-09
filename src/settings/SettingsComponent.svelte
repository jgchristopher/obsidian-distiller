<script lang="ts">
	import SettingItem from "./components/SettingItem.svelte";
	import { settings } from "./settingsstore";
</script>

<SettingItem>
	<span slot="name">Highlights Location</span>
	<span slot="description">
		Under which heading can we find the highlights we want openAI to use?
		(Don't include the #)
	</span>
	<input
		slot="control"
		type="text"
		bind:value={$settings.highlightsHeading}
		spellcheck="false"
		placeholder=""
	/>
</SettingItem>
<SettingItem>
	<span slot="name">Output Location</span>
	<span slot="description">
		Under which heading can we append the distilled response from openAI?
		(Don't include the #)
	</span>
	<input
		slot="control"
		type="text"
		bind:value={$settings.outputHeading}
		spellcheck="false"
		placeholder=""
	/>
</SettingItem>
<SettingItem>
	<span slot="name">OpenAi API Key</span>
	<span slot="description"> Please put in your API Key </span>
	<input
		slot="control"
		type="text"
		bind:value={$settings.openAiAPIKey}
		spellcheck="false"
		placeholder=""
	/>
</SettingItem>
