import {RouteConfig} from 'vue-router';

const routes: RouteConfig[] = [
	{
		path: '/',
		component: () => import('layouts/HomeLayout.vue'),
		children: [
			{path: '', name: 'dashboard', component: () => import('pages/Home.vue')},
			{path: '/about', name: 'aboutMe', component: () => import('components/AboutMe.vue')}
		]
	},

	// Always leave this as last one,
	// but you can also remove it
	{
		path: '*',
		component: () => import('pages/Error404.vue')
	}
];

export default routes;
