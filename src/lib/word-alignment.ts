// Word alignment mapping: English words to Strong's Greek numbers
// This allows clicking an English word to highlight the corresponding Greek

export const englishToStrongs: Record<string, string[]> = {
	// Common words
	"god": ["G2316"],
	"God": ["G2316"],
	"lord": ["G2962"],
	"Lord": ["G2962"],
	"and": ["G2532"],
	"And": ["G2532"],
	"the": ["G3588"],
	"in": ["G1722"],
	"In": ["G1722"],
	"beginning": ["G746"],
	"made": ["G4160"],
	"make": ["G4160"],
	"created": ["G4160"],
	"heaven": ["G3772"],
	"heavens": ["G3772"],
	"earth": ["G1093"],
	"light": ["G5457"],
	"day": ["G2250"],
	"days": ["G2250"],
	"night": ["G3571"],
	"water": ["G5204"],
	"waters": ["G5204"],
	"sea": ["G2281"],
	"seas": ["G2281"],
	"spirit": ["G4151"],
	"Spirit": ["G4151"],
	"man": ["G444"],
	"men": ["G444"],
	"woman": ["G1135"],
	"tree": ["G3586"],
	"trees": ["G3586"],
	"fruit": ["G2590"],
	"seed": ["G4690"],
	"soul": ["G5590"],
	"souls": ["G5590"],
	"life": ["G2222"],
	"death": ["G2288"],
	"die": ["G2288"],
	"died": ["G2288"],
	"son": ["G5207"],
	"sons": ["G5207"],
	"children": ["G5043"],
	"father": ["G3962"],
	"serpent": ["G3789"],
	"blood": ["G129"],
	"word": ["G3056"],
	"words": ["G3056"],
	"grace": ["G5485"],

	// Verbs
	"said": ["G2036", "G3004"],
	"saw": ["G3708", "G1492"],
	"called": ["G2564"],
	"blessed": ["G2127"],
	"good": ["G2570", "G18"],

	// Numbers/Time
	"first": ["G4413"],
	"second": ["G1208"],
	"third": ["G5154"],
	"fourth": ["G5067"],
	"fifth": ["G3991"],
	"sixth": ["G1623"],
	"seventh": ["G1442"],
};

/**
 * Find Strong's numbers for an English word
 */
export function getStrongsForEnglish(word: string): string[] {
	// Clean the word (remove punctuation)
	const cleaned = word.replace(/[.,;:!?'"()]/g, '').toLowerCase();

	// Check exact match first
	if (englishToStrongs[word]) {
		return englishToStrongs[word];
	}

	// Check lowercase
	if (englishToStrongs[cleaned]) {
		return englishToStrongs[cleaned];
	}

	// Check capitalized version
	const capitalized = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
	if (englishToStrongs[capitalized]) {
		return englishToStrongs[capitalized];
	}

	return [];
}
