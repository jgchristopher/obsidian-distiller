import { App, Modal, TFile } from "obsidian";
import { Utility } from "./utils";
import type { ObsidianDistillerSettings } from "./settings/types";
import { OpenAIRequest } from "./openai/OpenAiRequest";

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
