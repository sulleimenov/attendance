<template>
	<div class="min-h-screen bg-[#f4f7f9] dark:bg-[#0f172a] pb-32 p-6 font-sans">
		<header class="mb-8">
			<h1
				class="text-3xl font-black bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent"
			>
				Аналитика
			</h1>
			<p class="text-xs font-bold opacity-40 uppercase tracking-widest">
				Отчет ПР-25
			</p>
		</header>

		<div class="grid grid-cols-2 gap-4 mb-8">
			<div
				class="bg-white dark:bg-slate-800 p-5 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700"
			>
				<p class="text-[10px] font-bold opacity-40 uppercase mb-1">
					Посещаемость
				</p>
				<p class="text-2xl font-black text-blue-600">{{ attendanceRate }}%</p>
			</div>
			<div
				class="bg-white dark:bg-slate-800 p-5 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700"
			>
				<p class="text-[10px] font-bold opacity-40 uppercase mb-1">
					Всего пропусков
				</p>
				<p class="text-2xl font-black text-red-500">{{ totalAbsences }}</p>
			</div>
		</div>

		<section
			class="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] shadow-xl mb-8 border border-slate-100 dark:border-slate-700"
		>
			<h3 class="text-lg font-black mb-6 flex items-center gap-2">
				<span class="w-2 h-6 bg-blue-500 rounded-full"></span>
				Пропуски по парам
			</h3>

			<div class="flex items-end justify-between h-40 px-2">
				<div
					v-for="(count, lesson) in lessonStats"
					:key="lesson"
					class="flex flex-col items-center gap-2 w-full"
				>
					<div
						class="w-8 bg-gradient-to-t from-blue-600 to-indigo-400 rounded-t-xl transition-all duration-1000 relative group"
						:style="{
							height: `${(count / Math.max(...Object.values(lessonStats), 1)) * 100}%`,
						}"
					>
						<div
							class="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-black opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white px-2 py-1 rounded"
						>
							{{ count }}
						</div>
					</div>
					<span class="text-[10px] font-bold opacity-40 uppercase">{{
						lesson
					}}</span>
				</div>
			</div>
		</section>

		<section
			class="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-700"
		>
			<h3 class="text-lg font-black mb-6 flex items-center gap-2">
				<span class="w-2 h-6 bg-red-500 rounded-full"></span>
				Лидеры пропусков
			</h3>

			<div class="space-y-6">
				<div
					v-for="student in topAbsentStudents"
					:key="student.id"
					class="space-y-2"
				>
					<div class="flex justify-between items-end px-1">
						<span class="text-sm font-bold">{{ student.name }}</span>
						<span class="text-xs font-black text-red-500"
							>{{ student.count }} НБ</span
						>
					</div>
					<div
						class="w-full h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden"
					>
						<div
							class="h-full bg-gradient-to-r from-red-500 to-pink-500 transition-all duration-1000"
							:style="{ width: `${(student.count / maxAbsences) * 100}%` }"
						></div>
					</div>
				</div>
			</div>
		</section>
	</div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { students } from '../data/students.js'

const API_URL = 'https://69e5f9a8ce4e908a155eba75.mockapi.io/api/v1/attendance'
const history = ref([])

// 1. Считаем общие пропуски
const totalAbsences = computed(() => {
	return history.value.reduce((acc, curr) => acc + curr.absent_list.length, 0)
})

// 2. Процент посещаемости (условно: 6 пар в день * кол-во студентов * кол-во дней в истории)
const attendanceRate = computed(() => {
	if (history.value.length === 0) return 0
	const totalPossible = history.value.length * students.length
	const totalPresent = totalPossible - totalAbsences.value
	return Math.round((totalPresent / totalPossible) * 100)
})

// 3. Статистика по парам (какую пару прогуливают чаще)
const lessonStats = computed(() => {
	const stats = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }
	history.value.forEach((report) => {
		stats[report.lesson] += report.absent_list.length
	})
	return stats
})

// 4. Список студентов с количеством пропусков
const topAbsentStudents = computed(() => {
	const counts = {}
	history.value.forEach((report) => {
		report.absent_list.forEach((id) => {
			counts[id] = (counts[id] || 0) + 1
		})
	})

	return students
		.map((s) => ({ ...s, count: counts[s.id] || 0 }))
		.sort((a, b) => b.count - a.count)
		.slice(0, 5) // Берем топ-5
})

const maxAbsences = computed(() =>
	Math.max(...topAbsentStudents.value.map((s) => s.count), 1),
)

onMounted(async () => {
	const { data } = await axios.get(API_URL)
	history.value = data
})
</script>
