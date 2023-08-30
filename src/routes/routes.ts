import AdminLayout from '@/layouts/AdminLayout.vue';
import LoginPage from '@/pages/LoginPage.vue';
import PatientsIndex from '@/pages/PatientsIndex.vue';
import SurveysIndex from '@/pages/SurveysIndex.vue';
import QuestionsIndex from '@/pages/QuestionsIndex.vue';
import TestPage from '@/pages/TestPage.vue';
import ResultsPage from '@/pages/ResultsPage.vue';
import PageNotFound from '@/pages/PageNotFound.vue';
import ScoresPage from '@/pages/ScoresPage.vue';
import PatientsShowVue from '@/pages/PatientsShow.vue';
import SurveysShowVue from '@/pages/SurveysShow.vue';

export const routes = [
	{
		path: '/',
		component: AdminLayout,
		name: 'admin',
		redirect: '/pazienti',
		meta: {
			requiresAdmin: true,
		},
		children: [
			{
				path: '/pazienti',
				name: 'patients',
				children: [
					{
						path: '/pazienti',
						component: PatientsIndex,
						name: 'patients.index',
					},
					{
						path: '/pazienti/:id',
						component: PatientsShowVue,
						name: 'patients.show',
					},
				],
			},
			{
				path: '/sondaggi',
				name: 'surveys',
				children: [
					{
						path: '/sondaggi',
						component: SurveysIndex,
						name: 'surveys.index',
					},
					{
						path: '/sondaggi/:id',
						component: SurveysShowVue,
						name: 'surveys.show',
					},
				],
			},
			{
				path: '/questionari',
				name: 'questions',
				children: [
					{
						path: '/questionari',
						component: QuestionsIndex,
						name: 'questions.index',
					},
				],
			},
		],
	},
	{
		path: '/login',
		component: LoginPage,
		name: 'login',
		meta: {
			requiresGuest: true,
		},
	},
	{
		path: '/questionario/:token',
		component: TestPage,
		name: 'test',
		meta: {
			title: 'Dellasanta Psicologo | Questionario',
		},
	},
	{
		path: '/risposte/:id',
		component: ResultsPage,
		name: 'results',
		meta: {
			title: 'Risposte Test',
		},
	},
	{
		path: '/risultati/:id',
		component: ScoresPage,
		name: 'scores',
		meta: {
			title: 'Risultati Test',
		},
	},
	{
		path: '/:pathMatch(.*)*',
		component: PageNotFound,
	},
	{
		path: '/page-not-found',
		component: PageNotFound,
		name: '404',
	},
];
