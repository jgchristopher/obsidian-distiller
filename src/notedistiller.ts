import { App, Modal, TFile } from "obsidian";
import { Utility } from "./utils";
import type { ObsidianDistillerSettings } from "./settings/types";

export class NoteDistiller {
	public static async distill(
		app: App,
		file: TFile,
		settings: ObsidianDistillerSettings,
	) {
		const highlightsLines = Utility.getEndAndBeginningOfHeading(
			app,
			file,
			settings.highlightsHeading,
		);

		const fileData = await app.vault.read(file);
		const fileLines = fileData.split("\n");
		const highlightData = fileLines.slice(
			highlightsLines.firstLine,
			highlightsLines.lastLine,
		);
		new TempModal(app, highlightData.join("\n")).open();

		const outputLines = Utility.getEndAndBeginningOfHeading(
			app,
			file,
			settings.outputHeading,
		);
		console.log(
			`Highlights start at ${highlightsLines.firstLine} and end at ${highlightsLines.lastLine}`,
		);
		console.log(`Output start at ${outputLines.firstLine}`);
	}
}

class TempModal extends Modal {
	private data: string;

	constructor(app: App, data: string) {
		super(app);
		this.data = data;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.setText(this.data);
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
