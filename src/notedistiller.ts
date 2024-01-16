import { App, Editor, Modal, TFile } from "obsidian";
import { Utility } from "./utils";
import type { ObsidianDistillerSettings } from "./settings/types";
import { OpenAIRequest } from "./openai/OpenAiRequest";
import type ObsidianDistillerPlugin from "./main";

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

		const promptTemplate = settings.openAiPrompt;
		let prompt = promptTemplate.replaceAll(
			"{Note_Title}",
			file.name.split(".")[0],
		);

		prompt = `${prompt} \n ${highlightData.join("\n")}`;

		const modal = new TempModal(
			app,
			"Distilling Note... Please Be Patient",
		);
		modal.open();

		const openAiResponse = await OpenAIRequest(settings.openAiAPIKey)(
			prompt,
		);

		modal.close();

		const distilledInfo = openAiResponse.choices[0].message.content;

		const outputLines = Utility.getEndAndBeginningOfHeading(
			app,
			file,
			settings.outputHeading,
		);

		await Utility.write(app, file, distilledInfo, outputLines.firstLine);
	}

	public static async distillEditor(
		plugin: ObsidianDistillerPlugin,
		file: TFile,
		editor: Editor,
		settings: ObsidianDistillerSettings,
	) {
		if (
			Utility.containsHeadings(
				plugin.app,
				file,
				settings.highlightsHeading,
				settings.outputHeading,
			)
		) {
			const highlightsLines = Utility.getEndAndBeginningOfHeading(
				plugin.app,
				file,
				settings.highlightsHeading,
			);

			const fileData = await plugin.app.vault.read(file);
			const fileLines = fileData.split("\n");
			const highlightData = fileLines.slice(
				highlightsLines.firstLine,
				highlightsLines.lastLine,
			);

			const promptTemplate = settings.openAiPrompt;
			let prompt = promptTemplate.replaceAll(
				"{Note_Title}",
				file.name.split(".")[0],
			);

			const line = editor.getCursor().line;

			prompt = `${prompt} \n ${highlightData.join("\n")}`;

			const waitingTexts = [
				"openAi Api can take while...",
				"No, seriously, it can take a long time...",
				"We just need to be patient. Almost there...",
			];

			let waitingInterval = null;
			plugin.registerInterval(
				(waitingInterval = window.setInterval(() => {
					editor.setLine(
						line,
						waitingTexts[
							Math.floor(Math.random() * waitingTexts.length)
						],
					);
				}, 1000)),
			);

			const openAiResponse = await OpenAIRequest(settings.openAiAPIKey)(
				prompt,
			);

			clearInterval(waitingInterval);

			const distilledInfo = openAiResponse.choices[0].message.content;

			editor.setLine(line, distilledInfo);
		}
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
