<script lang="ts">
	import { Settings, Globe } from 'lucide-svelte';
	import { t, toggleLocale, locale } from '$lib/i18n';

	let showSettings = $state(false);
</script>

<header class="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 shadow-sm">
	<a href="/" class="flex items-center gap-2">
		<span class="text-xl font-bold text-gray-900">{$t('app_name')}</span>
		<span class="hidden sm:inline text-sm text-gray-500">{$t('app_tagline')}</span>
	</a>

	<div class="flex items-center gap-2">
		<button
			onclick={toggleLocale}
			class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
			title={$t('nav_language')}
		>
			<Globe size={20} />
			<span class="sr-only">{$t('nav_language')}</span>
		</button>

		<button
			onclick={() => (showSettings = true)}
			class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
			title={$t('nav_api_settings')}
		>
			<Settings size={20} />
			<span class="sr-only">{$t('nav_api_settings')}</span>
		</button>
	</div>
</header>

{#if showSettings}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
		role="dialog"
		aria-modal="true"
	>
		<div class="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
			<div class="flex items-center justify-between mb-4">
				<h2 class="text-lg font-bold">{$t('settings_title')}</h2>
				<button
					onclick={() => (showSettings = false)}
					class="p-1 text-gray-400 hover:text-gray-600 rounded"
				>
					✕
				</button>
			</div>

			<p class="text-sm text-gray-500 mb-4">API設定の詳細は Phase 2 で実装します。</p>

			<div class="flex justify-end">
				<button
					onclick={() => (showSettings = false)}
					class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
				>
					{$t('settings_close')}
				</button>
			</div>
		</div>
	</div>
{/if}
