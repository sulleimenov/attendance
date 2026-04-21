<script setup>
import { ref, onMounted } from 'vue'

const tg = window.Telegram?.WebApp
const isAuthorized = ref(false)

// Твой список разрешенных ID
const ALLOWED_IDS = [388956764, 7876069353]

onMounted(() => {
	tg?.ready()
	tg?.expand()
	console.log(tg)

	const user = tg?.initDataUnsafe?.user

	if (user && ALLOWED_IDS.includes(user.id)) {
		isAuthorized.value = true
	} else {
		console.log('Доступ запрещен для:', user?.id)
	}
})
</script>

<template>
	<div class="min-h-screen bg-[#f4f7f9] dark:bg-[#0f172a]" v-if="isAuthorized">
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
			<router-link
				to="/analytics"
				class="flex flex-col items-center gap-1 transition-colors"
				active-class="text-blue-600 dark:text-blue-400"
			>
				<span class="text-xs font-bold uppercase">Аналитика</span>
			</router-link>
		</nav>
		<router-view></router-view>
	</div>

	<div
		v-else
		class="flex flex-col items-center justify-center min-h-screen p-10 bg-[#f4f7f9] dark:bg-[#0f172a] text-white"
	>
		<div class="text-6xl mb-4">🚫</div>
		<h1 class="text-xl font-black text-white">Доступ ограничен</h1>
		<p class="text-sm opacity-60 mt-2 text-center">
			Это приложение только для старост группы ПР-25.
		</p>
	</div>
</template>
