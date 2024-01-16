import { App, Plugin, PluginSettingTab, TFile } from "obsidian";
import SettingsComponent from "./settings/SettingsComponent.svelte";
import type { SvelteComponent } from "svelte";
import {
	DEFAULT_SETTINGS,
	type ObsidianDistillerSettings,
} from "./settings/types";
import { init } from "./settings/settingsstore";
import { Utility } from "./utils";
import { NoteDistiller } from "./notedistiller";

export default class ObsidianDistillerPlugin extends Plugin {
	settings: ObsidianDistillerSettings;

	async onload() {
		await this.loadSettings();

		// Add a menu item to the file-menu
		this.registerEvent(
			this.app.workspace.on("file-menu", (menu, file) => {
				menu.addItem((item) => {
					item.setTitle("Distill this Note")
						.setIcon("document")
						.onClick(async () => {
							Utility.assertNotNull(file);
							NoteDistiller.distill(
								this.app,
								file as TFile,
								this.settings,
							);
						});
				});
			}),
		);

		// This adds a command to the editor
		this.addCommand({
			id: "obsidian-distilled-plugin-distill-note",
			name: "Distill the current note if it is a Mardown Note in Edit Mode",
			// checkCallback: async (checking:boolean) => {
			editorCallback: async (editor, ctx) => {
				Utility.assertNotNull(ctx.file);
				NoteDistiller.distillEditor(
					this,
					ctx.file,
					editor,
					this.settings,
				);
			},
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SettingsTab(this.app, this));
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData(),
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SettingsTab extends PluginSettingTab {
	plugin: ObsidianDistillerPlugin;
	private view: SvelteComponent;

	constructor(app: App, plugin: ObsidianDistillerPlugin) {
		super(app, plugin);
		this.plugin = plugin;
		init(this.plugin);
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		this.view = new SettingsComponent({
			target: containerEl,
			props: {},
		});
	}

	async hide() {
		super.hide();
		this.view.$destroy();
	}
}
