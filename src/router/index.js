import { createRouter, createWebHistory } from 'vue-router'
// Импортируй свои компоненты
import AttendanceManager from '../components/AttendanceManager.vue'
import MonthlyReport from '../components/MonthlyReport.vue'
import AnalyticsPage from '../components/AnalyticsPage.vue'

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
	{
		path: '/analytics',
		name: 'Analytics',
		component: AnalyticsPage,
	},
]

const router = createRouter({
	history: createWebHistory(),
	routes,
})

export default router
