<template>
	<div class="min-h-screen bg-[#f4f7f9] dark:bg-[#0f172a]">
		<nav
			class="bg-white/80 text-white dark:bg-slate-900/80 backdrop-blur-lg border-t dark:border-slate-800 p-4 flex justify-around z-50"
		>
			<router-link
				to="/"
				class="flex flex-col items-center gap-1 transition-colors"
				active-class="text-blue-600 dark:text-blue-400"
			>
				<span class="text-xs font-bold uppercase">Отметка</span>
			</router-link>

			<router-link
				to="/report"
				class="flex flex-col items-center gap-1 transition-colors"
				active-class="text-blue-600 dark:text-blue-400"
			>
				<span class="text-xs font-bold uppercase">Журнал</span>
			</router-link>
		</nav>
		<router-view></router-view>
	</div>
</template>
