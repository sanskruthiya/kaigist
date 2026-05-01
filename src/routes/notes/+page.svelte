<script lang="ts">
	import { ArrowLeft, Download, Copy } from 'lucide-svelte';
	import { t } from '$lib/i18n';
</script>

<div class="max-w-3xl mx-auto px-4 py-8">
	<div class="flex items-center justify-between mb-8">
		<a
			href="/discussion"
			class="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
		>
			<ArrowLeft size={16} />
			{$t('notes_back')}
		</a>
		<div class="flex items-center gap-2">
			<button class="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg border transition-colors">
				<Copy size={14} />
				{$t('notes_copy')}
			</button>
			<button class="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg border transition-colors">
				<Download size={14} />
				{$t('notes_export_md')}
			</button>
			<button class="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg border transition-colors">
				<Download size={14} />
				{$t('notes_export_json')}
			</button>
		</div>
	</div>

	<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
		<h1 class="text-2xl font-bold text-gray-900 mb-6">{$t('notes_title')}</h1>
		<p class="text-gray-400">議事メモの生成・表示は Phase 6 で実装します。</p>
	</div>
</div>
