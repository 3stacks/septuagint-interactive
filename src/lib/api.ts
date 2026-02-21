// API utilities for fetching Septuagint data from Bolls.life

const API_BASE = "https://bolls.life";

export interface Book {
	bookid: number;
	chronorder: number;
	name: string;
	chapters: number;
}

export interface Verse {
	pk: number;
	verse: number;
	text: string;
}

export interface StrongsDefinition {
	topic: string;
	definition: string;
	lexeme: string;
	transliteration: string;
	pronunciation: string;
	short_definition: string;
}

// Cache for API responses
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

async function fetchWithCache<T>(url: string): Promise<T> {
	const cached = cache.get(url);
	if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
		return cached.data as T;
	}

	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`API error: ${response.status}`);
	}

	const data = await response.json();
	cache.set(url, { data, timestamp: Date.now() });
	return data as T;
}

/**
 * Fetch all books in the LXX
 */
export async function getBooks(): Promise<Book[]> {
	return fetchWithCache<Book[]>(`${API_BASE}/get-books/LXX/`);
}

/**
 * Fetch a specific chapter from the LXX
 */
export async function getChapter(bookId: number, chapter: number): Promise<Verse[]> {
	return fetchWithCache<Verse[]>(`${API_BASE}/get-text/LXX/${bookId}/${chapter}/`);
}

/**
 * Fetch a Strong's definition
 */
export async function getStrongsDefinition(reference: string): Promise<StrongsDefinition | null> {
	try {
		const data = await fetchWithCache<StrongsDefinition[]>(
			`${API_BASE}/dictionary-definition/BDBT/${reference.toUpperCase()}/`
		);
		return data[0] || null;
	} catch {
		return null;
	}
}

/**
 * Parse HTML definition to plain text
 */
export function parseDefinition(htmlDef: string): {
	original: string;
	transliteration: string;
	phonetic: string;
	definitions: string[];
	origin: string;
	partOfSpeech: string;
} {
	// Extract original word
	const originalMatch = htmlDef.match(/<el>([^<]+)<\/el>/);
	const original = originalMatch ? originalMatch[1] : "";

	// Extract transliteration
	const translitMatch = htmlDef.match(/Transliteration:[^<]*<b>([^<]+)<\/b>/);
	const transliteration = translitMatch ? translitMatch[1] : "";

	// Extract phonetic
	const phoneticMatch = htmlDef.match(/Phonetic:[^<]*<b>([^<]+)<\/b>/);
	const phonetic = phoneticMatch ? phoneticMatch[1] : "";

	// Extract numbered definitions
	const definitions: string[] = [];
	const defMatches = htmlDef.matchAll(/<p><b>\d+\.<\/b>\s*([^<]+)<\/p>/g);
	for (const match of defMatches) {
		definitions.push(match[1].trim());
	}

	// Extract origin
	const originMatch = htmlDef.match(/Origin:[^"]*"([^"]+)"/);
	const origin = originMatch ? originMatch[1] : "";

	// Extract part of speech
	const posMatch = htmlDef.match(/Part\(s\) of speech:\s*([^<]+)/);
	const partOfSpeech = posMatch ? posMatch[1].trim() : "";

	return {
		original,
		transliteration,
		phonetic,
		definitions,
		origin,
		partOfSpeech,
	};
}

// Book name mapping (Greek to English slug)
export const bookSlugs: Record<number, string> = {
	1: "genesis",
	2: "exodus",
	3: "leviticus",
	4: "numbers",
	5: "deuteronomy",
	6: "joshua",
	7: "judges",
	8: "ruth",
	9: "1-samuel",
	10: "2-samuel",
	11: "1-kings",
	12: "2-kings",
	13: "1-chronicles",
	14: "2-chronicles",
	15: "ezra",
	17: "esther",
	18: "job",
	19: "psalms",
	20: "proverbs",
	21: "ecclesiastes",
	22: "song-of-songs",
	23: "isaiah",
	24: "jeremiah",
	25: "lamentations",
	26: "ezekiel",
	27: "daniel",
	28: "hosea",
	29: "joel",
	30: "amos",
	31: "obadiah",
	32: "jonah",
	33: "micah",
	34: "nahum",
	35: "habakkuk",
	36: "zephaniah",
	37: "haggai",
	38: "zechariah",
	39: "malachi",
	// Deuterocanonical books
	67: "1-esdras",
	68: "tobit",
	69: "judith",
	70: "wisdom",
	71: "sirach",
	73: "baruch",
	74: "1-maccabees",
	75: "2-maccabees",
	76: "3-maccabees",
	78: "susanna",
	79: "bel-and-dragon",
	80: "4-maccabees",
	85: "psalms-of-solomon",
	86: "odes",
};

// Reverse mapping
export const slugToBookId: Record<string, number> = Object.fromEntries(
	Object.entries(bookSlugs).map(([id, slug]) => [slug, parseInt(id)])
);

// English book names
export const bookNames: Record<string, string> = {
	genesis: "Genesis",
	exodus: "Exodus",
	leviticus: "Leviticus",
	numbers: "Numbers",
	deuteronomy: "Deuteronomy",
	joshua: "Joshua",
	judges: "Judges",
	ruth: "Ruth",
	"1-samuel": "1 Samuel",
	"2-samuel": "2 Samuel",
	"1-kings": "1 Kings",
	"2-kings": "2 Kings",
	"1-chronicles": "1 Chronicles",
	"2-chronicles": "2 Chronicles",
	ezra: "Ezra",
	esther: "Esther",
	job: "Job",
	psalms: "Psalms",
	proverbs: "Proverbs",
	ecclesiastes: "Ecclesiastes",
	"song-of-songs": "Song of Songs",
	isaiah: "Isaiah",
	jeremiah: "Jeremiah",
	lamentations: "Lamentations",
	ezekiel: "Ezekiel",
	daniel: "Daniel",
	hosea: "Hosea",
	joel: "Joel",
	amos: "Amos",
	obadiah: "Obadiah",
	jonah: "Jonah",
	micah: "Micah",
	nahum: "Nahum",
	habakkuk: "Habakkuk",
	zephaniah: "Zephaniah",
	haggai: "Haggai",
	zechariah: "Zechariah",
	malachi: "Malachi",
	"1-esdras": "1 Esdras",
	tobit: "Tobit",
	judith: "Judith",
	wisdom: "Wisdom of Solomon",
	sirach: "Sirach",
	baruch: "Baruch",
	"1-maccabees": "1 Maccabees",
	"2-maccabees": "2 Maccabees",
	"3-maccabees": "3 Maccabees",
	susanna: "Susanna",
	"bel-and-dragon": "Bel and the Dragon",
	"4-maccabees": "4 Maccabees",
	"psalms-of-solomon": "Psalms of Solomon",
	odes: "Odes",
};
