<template>
	<div class="p-4 bg-[#f4f7f9] min-h-screen dark:bg-[#0f172a]">
		<h1 class="text-2xl font-black mb-6 text-slate-800 dark:text-white">
			Журнал за месяц
		</h1>

		<div
			class="overflow-x-auto bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700"
		>
			<table class="w-full text-left border-collapse text-white">
				<thead>
					<tr class="bg-slate-50 dark:bg-slate-900/50">
						<th
							class="p-4 sticky left-0 bg-slate-50 dark:bg-slate-900 z-10 font-bold border-r dark:border-slate-700"
						>
							Студент
						</th>
						<th
							v-for="day in daysInMonth"
							:key="day"
							class="p-2 text-center text-xs font-bold border-r dark:border-slate-700 min-w-[40px]"
						>
							{{ day }}
						</th>
					</tr>
				</thead>
				<tbody>
					<tr
						v-for="student in students"
						:key="student.id"
						class="border-t dark:border-slate-700"
					>
						<td
							class="p-4 sticky left-0 bg-white dark:bg-slate-800 z-10 font-medium text-sm border-r dark:border-slate-700 shadow-md"
						>
							{{ student.name.split(' ')[0] }}
						</td>
						<td
							v-for="day in daysInMonth"
							:key="day"
							class="p-2 border-r dark:border-slate-700 text-center"
						>
							<div
								v-if="getStatus(student.id, day)"
								class="bg-red-500 text-white text-[10px] rounded-lg py-1 px-0.5 font-bold animate-pulse"
							>
								{{ getStatus(student.id, day) }}
							</div>
							<div
								v-else
								class="text-slate-200 dark:text-slate-700 text-[10px]"
							>
								•
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { students } from '../data/students.js'

const API_URL = 'https://69e5f9a8ce4e908a155eba75.mockapi.io/api/v1/attendance'

const history = ref([])

// Генерируем массив дней текущего месяца
const daysInMonth = computed(() => {
	const now = new Date()
	const year = now.getFullYear()
	const month = now.getMonth()
	const lastDay = new Date(year, month + 1, 0).getDate()
	return Array.from({ length: lastDay }, (_, i) => i + 1)
})

// Проверка отсутствия для таблицы
const getStatus = (studentId, day) => {
	const year = new Date().getFullYear()
	const month = String(new Date().getMonth() + 1).padStart(2, '0')
	const dateStr = `${year}-${month}-${String(day).padStart(2, '0')}`

	// Ищем все записи за этот день, где этот студент в списке absent_list
	const dailyAbsences = history.value.filter(
		(h) => h.date === dateStr && h.absent_list.includes(studentId),
	)

	if (dailyAbsences.length === 0) return null
	// Возвращаем номера пар, на которых его не было (например: "1, 3")
	return dailyAbsences
		.map((h) => h.lesson)
		.sort()
		.join(',')
}

onMounted(async () => {
	const { data } = await axios.get(API_URL)
	history.value = data
})
</script>
