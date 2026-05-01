<script lang="ts">
	import { Pause, Play, MessageSquare, FileText, Download } from 'lucide-svelte';
	import { t } from '$lib/i18n';
</script>

<div class="flex flex-col lg:flex-row h-[calc(100vh-57px)]">
	<!-- Sidebar: Personas + Controls (desktop) -->
	<aside class="hidden lg:flex flex-col w-64 border-r border-gray-200 bg-white p-4">
		<h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Personas</h2>
		<p class="text-sm text-gray-400">ペルソナパネルは Phase 4 で実装</p>

		<div class="mt-auto space-y-2">
			<button class="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
				<Pause size={16} />
				{$t('discussion_pause')}
			</button>
			<button class="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
				<MessageSquare size={16} />
				{$t('discussion_intervene')}
			</button>
			<button class="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
				<FileText size={16} />
				{$t('discussion_generate_notes')}
			</button>
			<button class="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
				<Download size={16} />
				{$t('discussion_export')}
			</button>
		</div>
	</aside>

	<!-- Main: Discussion Timeline -->
	<div class="flex-1 flex flex-col">
		<div class="flex-1 overflow-y-auto p-4 lg:p-8">
			<div class="max-w-3xl mx-auto">
				<div class="text-center py-16">
					<p class="text-gray-400">議論タイムラインは Phase 4 で実装します。</p>
				</div>
			</div>
		</div>

		<!-- Status bar -->
		<div class="flex items-center justify-between px-4 py-2 bg-white border-t border-gray-200 text-xs text-gray-500">
			<span>{$t('discussion_round')} 0/5 — {$t('status_round_progress')}</span>
			<span>{$t('status_tokens')}: 0 / {$t('status_cost')}: $0.00</span>
		</div>
	</div>

	<!-- Mobile: Floating controls -->
	<div class="lg:hidden fixed bottom-4 right-4 flex flex-col gap-2">
		<button class="p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors">
			<Pause size={20} />
		</button>
		<button class="p-3 bg-white text-gray-700 rounded-full shadow-lg border hover:bg-gray-50 transition-colors">
			<MessageSquare size={20} />
		</button>
	</div>
</div>
