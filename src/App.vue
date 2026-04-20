<template>
	<div
		class="min-h-screen bg-[#f4f7f9] dark:bg-[#0f172a] pb-32 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300"
	>
		<header
			class="sticky top-0 z-30 backdrop-blur-md bg-white/70 dark:bg-slate-900/70 border-b border-slate-200/50 dark:border-slate-700/50 p-5 px-6"
		>
			<div class="max-w-md mx-auto flex justify-between items-center flex-col">
				<div
					class="text-2xl font-black tracking-tight bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent"
				>
					Посещаемость ПР-25
				</div>
			</div>
		</header>

		<main class="max-w-md mx-auto p-6 space-y-8">
			<section>
				<div class="text-center text-2xl mb-5 font-bold">Пара</div>
				<div
					class="flex justify-between p-1 bg-slate-200/50 dark:bg-slate-800/50 rounded-2xl"
				>
					<button
						v-for="n in 6"
						:key="n"
						@click="selectLesson(n)"
						:class="[
							'h-15 w-full rounded-xl text-md font-black transition-all duration-300 flex flex-col items-center justify-center relative',
							lessonNumber === n
								? 'bg-white dark:bg-slate-700 shadow-md scale-105 text-blue-600 dark:text-blue-400'
								: 'text-slate-400 hover:text-slate-600',
						]"
					>
						{{ n }}

						<div
							v-if="isLessonDone(n)"
							class="absolute bg-green-500 rounded-full w-8 h-8 flex items-center justify-center shadow-sm border-2 border-[#f4f7f9]"
						>
							<svg
								class="w-3 h-3 text-white"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="4"
									d="M5 13l4 4L19 7"
								/>
							</svg>
						</div>
					</button>
				</div>
			</section>

			<section class="space-y-3">
				<div
					class="text-center text-2xl mb-5 font-bold text-slate-700 dark:text-slate-200"
				>
					Список группы
				</div>

				<div
					v-for="student in students"
					:key="student.id"
					@click="toggleStudent(student.id)"
					:class="[
						'group relative flex items-center justify-between p-4 rounded-3xl transition-all duration-300 cursor-pointer border-2',
						// Одинаковый стиль для ручной отметки и для данных из API
						isAbsent(student.id)
							? 'bg-red-50/50 dark:bg-red-900/10 border-red-200 dark:border-red-800/50 shadow-sm'
							: 'bg-white dark:bg-slate-800 border-transparent hover:border-slate-100 dark:hover:border-slate-700 shadow-sm hover:shadow-md',
					]"
				>
					<div class="flex items-center gap-4">
						<div
							:class="[
								'w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all duration-500 shadow-inner',
								isAbsent(student.id)
									? 'bg-gradient-to-br from-red-500 to-pink-600 text-white rotate-12 scale-90'
									: 'bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 text-slate-500',
							]"
						>
							{{ student.name.charAt(0) }}
						</div>

						<div>
							<p
								:class="[
									'font-bold text-base transition-all',
									isAbsent(student.id)
										? 'text-red-600 dark:text-red-400 opacity-60 line-through'
										: 'text-slate-700 dark:text-slate-200',
								]"
							>
								{{ student.name }}
							</p>
							<p class="text-[10px] font-medium opacity-30 uppercase">
								{{ isAbsent(student.id) ? 'Отсутствует' : 'Присутствует' }}
							</p>
						</div>
					</div>

					<div
						:class="[
							'w-8 h-8 rounded-2xl border-2 flex items-center justify-center transition-all duration-300',
							isAbsent(student.id)
								? 'bg-red-500 border-red-500 scale-110 shadow-lg shadow-red-500/40'
								: 'border-slate-200 dark:border-slate-700',
						]"
					>
						<svg
							v-if="isAbsent(student.id)"
							class="w-5 h-5 text-white"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="3"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
						<div
							v-else
							class="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700"
						></div>
					</div>
				</div>
			</section>
		</main>

		<footer
			class="fixed bottom-0 left-0 right-0 p-6 backdrop-blur-lg bg-white/80 dark:bg-slate-900/80 border-t border-slate-200/50 dark:border-slate-700/50"
		>
			<div class="max-w-md mx-auto">
				<button
					@click="sendReport"
					:disabled="loading"
					class="group relative w-full overflow-hidden bg-slate-900 dark:bg-blue-600 text-white font-black py-4 rounded-[2rem] transition-all active:scale-95 disabled:opacity-50"
				>
					<div class="relative z-10 flex justify-center items-center gap-3">
						<span
							v-if="loading"
							class="animate-spin border-2 border-white/30 border-t-white rounded-full w-5 h-5"
						></span>
						<span class="tracking-tight uppercase text-sm">
							{{ loading ? 'Сохраняем...' : 'Сохранить ' }}
						</span>
					</div>
					<div
						class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
					></div>
				</button>
			</div>
		</footer>
	</div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

const tg = window.Telegram?.WebApp
const API_URL = 'https://69e5f9a8ce4e908a155eba75.mockapi.io/api/v1/attendance'

const lessonNumber = ref(1)
const loading = ref(false)
const absentIds = ref([])
const history = ref([]) // Здесь будем хранить все отчеты за сегодня

const currentDate = new Date().toLocaleDateString('ru-RU', {
	day: 'numeric',
	month: 'long',
	weekday: 'short',
})

const students = ref([
	{ id: 1, name: 'Александр Сергеев' },
	{ id: 2, name: 'Дмитрий Иванов' },
	{ id: 3, name: 'Мария Петрова' },
	{ id: 4, name: 'Артем Сидоров' },
	{ id: 5, name: 'Елена Кузнецова' },
	{ id: 6, name: 'Иван Волков' },
])

// Получаем список номеров пар, которые уже были отмечены сегодня
const completedLessons = computed(() => {
	const today = new Date().toISOString().split('T')[0]
	return history.value
		.filter((item) => item.date === today)
		.map((item) => Number(item.lesson))
})

// Проверка: отмечена ли конкретная пара
const isLessonDone = (n) => completedLessons.value.includes(n)

// Загрузка истории с сервера
const fetchHistory = async () => {
	try {
		const { data } = await axios.get(API_URL)
		history.value = data
	} catch (e) {
		console.error('Ошибка загрузки истории', e)
	}
}

// 2. Функция проверки (остается без изменений, как ты и просил)
const isAbsent = (id) => absentIds.value.includes(id)

// 3. Главная функция для смены пары
const selectLesson = (n) => {
	lessonNumber.value = n

	const today = new Date().toISOString().split('T')[0]

	// Ищем в загруженной из API истории отчет за эту пару и за сегодня
	const savedReport = history.value.find(
		(item) => item.date === today && Number(item.lesson) === n,
	)

	if (savedReport) {
		// Если нашли — просто копируем список ID в наш активный массив
		// Функция isAbsent(id) тут же увидит эти ID и покрасит список
		absentIds.value = [...savedReport.absent_list]
	} else {
		// Если отчета нет — обнуляем список для новой отметки
		absentIds.value = []
	}

	tg?.HapticFeedback.impactOccurred('light')
}

const toggleStudent = (id) => {
	const index = absentIds.value.indexOf(id)
	if (index > -1) {
		absentIds.value.splice(index, 1)
		tg?.HapticFeedback.impactOccurred('medium')
	} else {
		absentIds.value.push(id)
		tg?.HapticFeedback.notificationOccurred('error')
	}
}

const sendReport = async () => {
	if (loading.value) return

	// Проверка перед отправкой
	if (isLessonDone(lessonNumber.value)) {
		tg?.showAlert(
			`Отчет за ${lessonNumber.value} пару уже был отправлен ранее!`,
		)
		return
	}

	loading.value = true
	try {
		const report = {
			lesson: lessonNumber.value,
			absent_list: absentIds.value,
			date: new Date().toISOString().split('T')[0],
		}

		await axios.post(API_URL, report)

		tg?.HapticFeedback.notificationOccurred('success')
		tg?.showPopup(
			{
				title: 'Успешно!',
				message: `Отчет за ${lessonNumber.value} пару принят.`,
				buttons: [{ type: 'close', text: 'Понятно' }],
			},
			() => tg.close(),
		)
	} catch (e) {
		tg?.showAlert('Сбой сети. Попробуйте еще раз.')
	} finally {
		loading.value = false
	}
}

onMounted(async () => {
	tg?.ready()
	tg?.expand()
	if (tg) {
		tg.headerColor = '#ffffff'
		tg.backgroundColor = '#f4f7f9'
	}
	await fetchHistory()
	selectLesson(1) // Добавь это, чтобы первая пара сразу проверилась по базе
})
</script>
