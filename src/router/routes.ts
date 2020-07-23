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
	{
		path: '/facebook',
		name: 'facebook',
		beforeEnter() {
			window.open("https://www.facebook.com/mma.rifat6", "_blank");
		},
	},
	{
		path: '/github',
		name: 'github',
		beforeEnter() {
			window.open("https://www.github.com/mmarifat", "_blank");
		},
	},
	{
		path: '/instagram',
		name: 'instagram',
		beforeEnter() {
			window.open("https://www.instagram.com/mma.rifat", "_blank");
		},
	},

	// Always leave this as last one,
	// but you can also remove it
	{
		path: '*',
		component: () => import('pages/Error404.vue')
	}
];

export default routes;
