import type { Session } from '$lib/types/session';

function sanitizeFilename(text: string): string {
	return text.replace(/[^a-zA-Z0-9\u3000-\u9FFF\u4E00-\u9FFF]/g, '_').slice(0, 30);
}

function formatDate(): string {
	return new Date().toISOString().slice(0, 10);
}

function buildFilename(theme: string, ext: string): string {
	return `kaigist-${sanitizeFilename(theme)}-${formatDate()}.${ext}`;
}

function downloadFile(content: string, filename: string, mimeType: string) {
	const blob = new Blob([content], { type: mimeType });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}

export function exportJSON(session: Session) {
	const data = {
		version: '1.0',
		exportedAt: new Date().toISOString(),
		...session
	};
	const json = JSON.stringify(data, null, 2);
	downloadFile(json, buildFilename(session.setup.theme, 'json'), 'application/json');
}

export function exportMarkdown(session: Session, meetingNotes: string) {
	const personaMap = new Map(session.setup.personas.map((p) => [p.id, p.name]));

	let md = meetingNotes + '\n\n---\n\n';
	md += `## 議論ログ\n\n`;

	let currentRound = 0;
	for (const u of session.utterances) {
		if (u.round !== currentRound) {
			currentRound = u.round;
			md += `\n### ラウンド ${currentRound}\n\n`;
		}
		if (u.speakerPersonaId === '__facilitator__') {
			md += `**🎙 ファシリテーター**: ${u.content}\n\n`;
		} else {
			const name = personaMap.get(u.speakerPersonaId) ?? '?';
			md += `**${name}**: ${u.content}\n\n`;
		}
	}

	downloadFile(md, buildFilename(session.setup.theme, 'md'), 'text/markdown');
}

export async function copyToClipboard(text: string): Promise<boolean> {
	try {
		await navigator.clipboard.writeText(text);
		return true;
	} catch {
		return false;
	}
}

export function importJSON(file: File): Promise<Session> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			try {
				const data = JSON.parse(reader.result as string);
				if (!data.setup || !data.utterances) {
					throw new Error('Invalid Kaigist session file');
				}
				resolve(data as Session);
			} catch (err) {
				reject(err);
			}
		};
		reader.onerror = () => reject(new Error('Failed to read file'));
		reader.readAsText(file);
	});
}
