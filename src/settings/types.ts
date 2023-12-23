export interface ObsidianDistillerSettings {
	highlightsHeading: string;
	outputHeading: string;
	openAiAPIKey: string;
	openAiPrompt: string;
}

export const DEFAULT_SETTINGS: Partial<ObsidianDistillerSettings> = {
	highlightsHeading: "",
	outputHeading: "",
	openAiAPIKey: "",
	openAiPrompt: "",
};
