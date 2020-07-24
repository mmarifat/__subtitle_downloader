import axios, {AxiosInstance} from 'axios';
import {boot} from 'quasar/wrappers';

declare module 'vue/types/vue' {
	interface Vue {
		$axios: AxiosInstance;
	}
}

const Axios = axios.create({
	baseURL: process.env.BASE_URL,
	headers: {
		"X-User-Agent": "userAgent",
	}
});

export default boot(({Vue}) => {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	Vue.prototype.$axios = Axios;
});
