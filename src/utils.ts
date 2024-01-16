import { Notice, type App, TFile, type HeadingCache } from "obsidian";

export class Utility {
	public static assertNotNull<T>(
		value: T | null | undefined,
	): asserts value is T {
		if (!value) {
			throw new Error("Value is null");
		}
	}

	//  Check to see if the user passed in a literal markdown heading and not just the text
	public static cleanHeading(heading: string) {
		let cleanHeading = heading;
		if (heading.startsWith("#") && heading[1] == " ") {
			cleanHeading = heading.substring(2);
		}
		return cleanHeading;
	}

	public static async write(
		app: App,
		file: TFile,
		clippedData: string,
		startLine: number,
	): Promise<void> {
		const fileData = await app.vault.read(file);
		const fileLines = fileData.split("\n");

		const preSectionContent = fileLines.slice(0, startLine);
		const restOfContent = fileLines.slice(startLine);
		const text = [...preSectionContent, clippedData, ...restOfContent].join(
			"\n",
		);

		return await app.vault.modify(file, text);
	}

	public static getEndAndBeginningOfHeading(
		app: App,
		file: TFile,
		heading: string,
	): { lastLine: number; firstLine: number } {
		// Get the CachedMetadata for this file
		const cache = app.metadataCache.getFileCache(file);
		Utility.assertNotNull(cache);
		heading = Utility.cleanHeading(heading);
		try {
			const cachedHeadings = cache.headings;
			Utility.assertNotNull(cachedHeadings);
			// We need to see if the configured heading exists in the document
			const foundHeadingIndex = cachedHeadings.findIndex(
				(cachedHeading) => {
					return cachedHeading.heading === heading;
				},
			);

			if (foundHeadingIndex !== -1) {
				const foundHeading = cachedHeadings[foundHeadingIndex];
				let nextHeading: HeadingCache | null = null;
				// Need to find the next heading greater than our found heading, if any
				for (
					let i = foundHeadingIndex + 1;
					i < cachedHeadings?.length;
					i++
				) {
					const cachedHeading = cachedHeadings[i];

					if (cachedHeading.level <= foundHeading.level) {
						nextHeading = cachedHeading;
						break;
					}
				}

				const prependLine = foundHeading.position.start.line + 2; // I think this is a bug, but the start line always seems to be the line before the Heading text
				let appendLine = -1;
				if (nextHeading) {
					// Figure out Append location based on the nextHeading
					appendLine = nextHeading.position.start.line;
				}
				return { lastLine: appendLine, firstLine: prependLine };
			} else {
				throw Error("Heading not found");
			}
		} catch (e) {
			new Notice("Can't find heading");
			throw Error("Heading not found");
		}
	}

	public static containsHeadings(
		app: App,
		file: TFile,
		heading1: string,
		heading2: string,
	): boolean {
		let headingsFound = false;
		// Get the CachedMetadata for this file
		const cache = app.metadataCache.getFileCache(file);
		Utility.assertNotNull(cache);
		heading1 = Utility.cleanHeading(heading1);
		heading2 = Utility.cleanHeading(heading2);
		try {
			const cachedHeadings = cache.headings;
			Utility.assertNotNull(cachedHeadings);
			// We need to see if the configured heading exists in the document
			const foundHeadingIndex1 = cachedHeadings.findIndex(
				(cachedHeading) => {
					return cachedHeading.heading === heading1;
				},
			);

			const foundHeadingIndex2 = cachedHeadings.findIndex(
				(cachedHeading) => {
					return cachedHeading.heading === heading2;
				},
			);

			headingsFound =
				foundHeadingIndex1 !== -1 && foundHeadingIndex2 !== -1;
		} catch (_e) {
			return headingsFound;
		}
		return headingsFound;
	}
}
