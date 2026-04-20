import { createRouter, createWebHistory } from 'vue-router'
// Импортируй свои компоненты
import AttendanceManager from '../components/AttendanceManager.vue'
import MonthlyReport from '../components/MonthlyReport.vue'

const routes = [
	{
		path: '/',
		name: 'Home',
		component: AttendanceManager,
	},
	{
		path: '/report',
		name: 'Report',
		component: MonthlyReport,
	},
]

const router = createRouter({
	history: createWebHistory(),
	routes,
})

export default router
