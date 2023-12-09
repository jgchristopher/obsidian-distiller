export interface ObsidianDistillerSettings {
	highlightsHeading: string;
	outputHeading: string;
	openAiAPIKey: string;
}

export const DEFAULT_SETTINGS: Partial<ObsidianDistillerSettings> = {
	highlightsHeading: "",
	outputHeading: "",
	openAiAPIKey: "",
};
