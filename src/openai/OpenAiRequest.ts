import { requestUrl } from "obsidian";
import { encodingForModel } from "js-tiktoken";

const model = "gpt-4-1106-preview";

type ReqResponse = {
	id: string;
	model: string;
	object: string;
	usage: {
		prompt_tokens: number;
		completion_tokens: number;
		total_tokens: number;
	};
	choices: {
		finish_reason: string;
		index: number;
		message: { content: string; role: string };
	}[];
	created: number;
};

const getTokenCount = (text: string) => {
	return encodingForModel(model).encode(text).length;
};

export function OpenAIRequest(
	apiKey: string,
	systemPrompt = "I am a helpful assistant that provides thorough summaries",
) {
	return async function makeRequest(prompt: string) {
		const tokenCount = getTokenCount(prompt) + getTokenCount(systemPrompt);
		const maxTokens = 128000;

		if (tokenCount > maxTokens) {
			throw new Error(
				`The ${model} API has a token limit of ${maxTokens}. Your prompt has ${tokenCount} tokens.`,
			);
		}

		try {
			const _response = requestUrl({
				url: `https://api.openai.com/v1/chat/completions`,
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${apiKey}`,
				},
				body: JSON.stringify({
					model,
					temperature: 0.2,
					top_p: 1,
					frequency_penalty: 0,
					presence_penalty: 0,
					messages: [
						{ role: "system", content: systemPrompt },
						{ role: "user", content: prompt },
					],
				}),
			});

			const response = await _response;

			return response.json as ReqResponse;
		} catch (error) {
			console.log(error);
			throw new Error(
				`Error while making request to OpenAI API: ${
					(error as { message: string }).message
				}`,
			);
		}
	};
}
