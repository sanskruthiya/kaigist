<script lang="ts">
	import { Rocket, FolderOpen } from 'lucide-svelte';
	import { t } from '$lib/i18n';
</script>

<div class="flex flex-col items-center justify-center min-h-[calc(100vh-57px)] px-4">
	<div class="text-center mb-12">
		<h1 class="text-4xl sm:text-5xl font-bold text-gray-900 mb-3">{$t('app_name')}</h1>
		<p class="text-lg text-gray-500">{$t('app_tagline')}</p>
	</div>

	<div class="flex flex-col gap-4 w-full max-w-sm">
		<a
			href="/setup"
			class="flex items-center justify-center gap-3 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all"
		>
			<Rocket size={22} />
			{$t('home_new_discussion')}
		</a>

		<button
			class="flex items-center justify-center gap-3 px-6 py-4 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-xl border border-gray-200 shadow-sm hover:shadow transition-all"
		>
			<FolderOpen size={22} />
			<div class="text-left">
				<div>{$t('home_import_discussion')}</div>
				<div class="text-xs text-gray-400 font-normal">{$t('home_import_hint')}</div>
			</div>
		</button>
	</div>
</div>
