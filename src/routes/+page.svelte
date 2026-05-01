<script lang="ts">
	import { Rocket, FolderOpen, AlertTriangle } from 'lucide-svelte';
	import { t } from '$lib/i18n';
	import { goto } from '$app/navigation';
	import { session } from '$lib/stores/session';
	import { importJSON } from '$lib/utils/export';

	let fileInput: HTMLInputElement | undefined = $state();
	let importError = $state('');

	async function handleImport(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		importError = '';
		try {
			const data = await importJSON(file);
			session.init(data.setup);
			// Restore full state
			for (const u of data.utterances) {
				session.addUtterance(u.speakerPersonaId, u.content, u.round);
			}
			if (data.status) session.setStatus(data.status);
			if (data.currentRound) session.setRound(data.currentRound);
			if (data.meetingNotes) session.setMeetingNotes(data.meetingNotes);
			goto('/discussion');
		} catch (err) {
			importError = err instanceof Error ? err.message : String(err);
		}
		input.value = '';
	}
</script>

<div class="flex flex-col items-center justify-center min-h-[calc(100vh-57px)] px-4">
	<div class="text-center mb-10">
		<img
			src="/images/kAIgistLogo.webp"
			alt="Kaigist"
			class="w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-6 drop-shadow-lg"
		/>
		<h1 class="text-4xl sm:text-5xl font-bold text-gray-900 mb-3">{$t('app_name')}</h1>
		<p class="text-lg text-gray-500 max-w-sm mx-auto">{$t('app_tagline')}</p>
	</div>

	<div class="flex flex-col gap-4 w-full max-w-sm">
		<a
			href="/setup"
			class="flex items-center justify-center gap-3 px-6 py-4 bg-amber-400 hover:bg-amber-500 text-gray-900 font-medium rounded-xl shadow-lg hover:shadow-xl transition-all"
		>
			<Rocket size={22} />
			{$t('home_new_discussion')}
		</a>

		<button
			onclick={() => fileInput?.click()}
			class="flex items-center justify-center gap-3 px-6 py-4 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-xl border border-gray-200 shadow-sm hover:shadow transition-all"
		>
			<FolderOpen size={22} />
			<div class="text-left">
				<div>{$t('home_import_discussion')}</div>
				<div class="text-xs text-gray-400 font-normal">{$t('home_import_hint')}</div>
			</div>
		</button>
		<input
			bind:this={fileInput}
			type="file"
			accept=".json"
			class="hidden"
			onchange={handleImport}
		/>

		{#if importError}
			<div class="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
				<AlertTriangle size={14} />
				<span>{importError}</span>
			</div>
		{/if}
	</div>
</div>
