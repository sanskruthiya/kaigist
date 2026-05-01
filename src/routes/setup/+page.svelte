<script lang="ts">
	import { ArrowLeft, ArrowRight, Rocket, Sparkles } from 'lucide-svelte';
	import { t } from '$lib/i18n';

	let currentStep = $state(1);
	const totalSteps = 3;

	const stepLabels: Array<'setup_step_theme' | 'setup_step_personas' | 'setup_step_settings'> = [
		'setup_step_theme',
		'setup_step_personas',
		'setup_step_settings'
	];
</script>

<div class="max-w-2xl mx-auto px-4 py-8">
	<!-- Step indicator -->
	<div class="flex items-center justify-between mb-8">
		<a href="/" class="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors">
			<ArrowLeft size={16} />
			{$t('btn_back')}
		</a>
		<div class="flex items-center gap-2 text-sm text-gray-500">
			<span>{$t('setup_step')} {currentStep}/{totalSteps}</span>
			<span class="text-gray-300">—</span>
			<span class="font-medium text-gray-700">{$t(stepLabels[currentStep - 1])}</span>
		</div>
	</div>

	<!-- Step progress bar -->
	<div class="flex gap-2 mb-8">
		{#each Array(totalSteps) as _, i}
			<div
				class="h-1 flex-1 rounded-full transition-colors {i < currentStep
					? 'bg-blue-500'
					: 'bg-gray-200'}"
			></div>
		{/each}
	</div>

	<!-- Step 1: Theme -->
	{#if currentStep === 1}
		<div class="space-y-6">
			<div>
				<label for="theme" class="block text-sm font-medium text-gray-700 mb-2">
					{$t('setup_theme_label')}
				</label>
				<input
					id="theme"
					type="text"
					maxlength={100}
					class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
					placeholder={$t('setup_theme_placeholder')}
				/>
			</div>
			<div>
				<label for="supplement" class="block text-sm font-medium text-gray-700 mb-2">
					{$t('setup_supplement_label')}
				</label>
				<textarea
					id="supplement"
					rows={4}
					maxlength={500}
					class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
					placeholder={$t('setup_supplement_placeholder')}
				></textarea>
			</div>
			<button
				class="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
				onclick={() => (currentStep = 2)}
			>
				<Sparkles size={18} />
				{$t('setup_suggest_personas')}
			</button>
		</div>
	{/if}

	<!-- Step 2: Personas -->
	{#if currentStep === 2}
		<div class="space-y-6">
			<p class="text-sm text-gray-500">ペルソナ提案・編集は Phase 3 で実装します。</p>

			<div class="flex justify-between">
				<button
					class="flex items-center gap-1 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
					onclick={() => (currentStep = 1)}
				>
					<ArrowLeft size={16} />
					{$t('btn_back')}
				</button>
				<button
					class="flex items-center gap-1 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
					onclick={() => (currentStep = 3)}
				>
					{$t('btn_next')}
					<ArrowRight size={16} />
				</button>
			</div>
		</div>
	{/if}

	<!-- Step 3: Settings -->
	{#if currentStep === 3}
		<div class="space-y-6">
			<div>
				<label for="rounds" class="block text-sm font-medium text-gray-700 mb-2">
					{$t('setup_rounds_label')}
				</label>
				<select
					id="rounds"
					class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
				>
					{#each Array.from({ length: 10 }, (_, i) => i + 1) as n}
						<option value={n} selected={n === 5}>{n}</option>
					{/each}
				</select>
			</div>

			<div>
				<label for="direction" class="block text-sm font-medium text-gray-700 mb-2">
					{$t('setup_direction_label')}
				</label>
				<textarea
					id="direction"
					rows={3}
					class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
					placeholder={$t('setup_direction_placeholder')}
				></textarea>
			</div>

			<div>
				<label for="model" class="block text-sm font-medium text-gray-700 mb-2">
					{$t('setup_model_label')}
				</label>
				<select
					id="model"
					class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
				>
					<option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
					<option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
					<option value="claude-sonnet-4-20250514">Claude Sonnet 4</option>
					<option value="claude-3-5-haiku-20241022">Claude 3.5 Haiku</option>
					<option value="gpt-4o">GPT-4o</option>
					<option value="gpt-4o-mini">GPT-4o Mini</option>
				</select>
			</div>

			<div class="flex justify-between">
				<button
					class="flex items-center gap-1 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
					onclick={() => (currentStep = 2)}
				>
					<ArrowLeft size={16} />
					{$t('btn_back')}
				</button>
				<a
					href="/discussion"
					class="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
				>
					<Rocket size={18} />
					{$t('setup_start_discussion')}
				</a>
			</div>
		</div>
	{/if}
</div>
