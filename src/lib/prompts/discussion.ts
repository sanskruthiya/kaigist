import type { Locale } from '$lib/i18n';
import type { Persona } from '$lib/types/persona';
import type { Utterance } from '$lib/types/session';

const MAX_HISTORY_UTTERANCES = 20;
const MAX_UTTERANCE_CHARS = 800;
const TRUNCATE_LIMIT = 600;

function getLanguageDirective(locale: Locale): string {
	return locale === 'ja'
		? 'すべての出力は日本語で行うこと。'
		: 'All output must be in English.';
}

function formatPersonas(personas: Persona[], locale: Locale): string {
	return personas
		.map(
			(p) =>
				`- ${p.name}（${p.ageGroup}）: ${p.expertise} / ${p.stance} / ${p.personality}`
		)
		.join('\n');
}

function formatHistory(
	utterances: Utterance[],
	personas: Persona[]
): string {
	const personaMap = new Map(personas.map((p) => [p.id, p.name]));
	const recent = utterances.slice(-MAX_HISTORY_UTTERANCES);
	return recent
		.map((u) => {
			const name = personaMap.get(u.speakerPersonaId) ?? u.speakerPersonaId;
			const text =
				u.content.length > MAX_UTTERANCE_CHARS
					? u.content.slice(0, MAX_UTTERANCE_CHARS) + '…'
					: u.content;
			return `[R${u.round}] ${name}: ${text}`;
		})
		.join('\n');
}

function getAlreadySpoken(
	utterances: Utterance[],
	currentRound: number,
	personas: Persona[]
): string[] {
	const personaMap = new Map(personas.map((p) => [p.id, p.name]));
	return utterances
		.filter((u) => u.round === currentRound)
		.map((u) => personaMap.get(u.speakerPersonaId) ?? '');
}

export function buildDiscussionPrompt(opts: {
	theme: string;
	direction: string;
	personas: Persona[];
	utterances: Utterance[];
	currentRound: number;
	maxRounds: number;
	facilitatorComment: string;
	locale: Locale;
}): string {
	const lang = getLanguageDirective(opts.locale);
	const personaList = formatPersonas(opts.personas, opts.locale);
	const history = formatHistory(opts.utterances, opts.personas);
	const alreadySpoken = getAlreadySpoken(
		opts.utterances,
		opts.currentRound,
		opts.personas
	);

	const spokenNote =
		alreadySpoken.length > 0
			? `\n既にこのラウンドで発言済み: ${alreadySpoken.join(', ')}\nまだ発言していないペルソナから選んでください。`
			: '';

	const facilitator = opts.facilitatorComment
		? `\nファシリテーターの指示: ${opts.facilitatorComment}`
		: '';

	if (opts.locale === 'ja') {
		return `${lang}

あなたは議論シミュレーターです。以下の設定に基づき、次のペルソナの発言を生成してください。

テーマ: ${opts.theme}
${opts.direction ? `方向性: ${opts.direction}` : ''}

ペルソナ一覧:
${personaList}

現在のラウンド: ${opts.currentRound}/${opts.maxRounds}
${spokenNote}
${facilitator}

これまでの議論:
${history || '（まだ発言なし）'}

要件:
- まだこのラウンドで発言していないペルソナから1名を選び、そのペルソナとして発言を生成すること
- 発言は150〜400字程度にすること
- 他のペルソナの発言に対する反応・反論・深掘りを含めること
- キャラクターの専門性と立場を反映した発言にすること
- 必ず以下のJSON形式のみを出力し、それ以外のテキストは含めないこと

出力形式:
{
  "speaker": "発言者の名前",
  "content": "発言内容"
}`;
	}

	return `${lang}

You are a discussion simulator. Generate the next persona's statement based on the following settings.

Theme: ${opts.theme}
${opts.direction ? `Direction: ${opts.direction}` : ''}

Personas:
${personaList}

Current round: ${opts.currentRound}/${opts.maxRounds}
${spokenNote}
${facilitator}

Discussion so far:
${history || '(No statements yet)'}

Requirements:
- Choose one persona who has NOT spoken in this round yet and generate their statement
- Keep the statement between 150-400 characters
- Include reactions, rebuttals, or deeper exploration of other personas' statements
- Reflect the character's expertise and stance
- Output ONLY the following JSON format with no additional text

Output format:
{
  "speaker": "Speaker's name",
  "content": "Statement content"
}`;
}

export interface ParsedUtterance {
	speaker: string;
	content: string;
}

export function parseDiscussionResponse(raw: string): ParsedUtterance {
	if (!raw || !raw.trim()) {
		throw new Error('Empty response from LLM');
	}

	// Strip markdown code blocks if present
	let cleaned = raw.trim();
	const codeBlockMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
	if (codeBlockMatch) {
		cleaned = codeBlockMatch[1].trim();
	}

	const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
	if (!jsonMatch) {
		const preview = raw.slice(0, 200).replace(/\n/g, '\\n');
		throw new Error(`No JSON object found in response: "${preview}"`);
	}

	let parsed: Record<string, unknown>;
	try {
		parsed = JSON.parse(jsonMatch[0]);
	} catch {
		const preview = jsonMatch[0].slice(0, 200).replace(/\n/g, '\\n');
		throw new Error(`Invalid JSON in response: "${preview}"`);
	}

	if (!parsed.speaker || !parsed.content) {
		throw new Error(`Missing speaker or content: ${JSON.stringify(parsed).slice(0, 200)}`);
	}

	return {
		speaker: String(parsed.speaker),
		content: truncateUtterance(String(parsed.content))
	};
}

export function truncateUtterance(text: string): string {
	if (text.length <= TRUNCATE_LIMIT) return text;

	const cutPoint = text.slice(0, TRUNCATE_LIMIT);
	const lastPunctuation = Math.max(
		cutPoint.lastIndexOf('。'),
		cutPoint.lastIndexOf('！'),
		cutPoint.lastIndexOf('？'),
		cutPoint.lastIndexOf('.'),
		cutPoint.lastIndexOf('!'),
		cutPoint.lastIndexOf('?')
	);

	if (lastPunctuation > TRUNCATE_LIMIT * 0.5) {
		return text.slice(0, lastPunctuation + 1) + '…';
	}
	return cutPoint + '…';
}
