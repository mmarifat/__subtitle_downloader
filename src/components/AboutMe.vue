<template>
	<section class="row justify-center">
		<q-card class="q-mt-lg bg-transparent" flat>
			<q-card-section class="text-center">
				<q-img  position="0 0" contain src="/images/me.jpg" class="custom-image shadow-22" alt="msub"/>
			</q-card-section>

			<q-card-section class="q-pt-none text-center ">
				<div class="text-h6  text-grey-8">
					Minhaz Ahamed Rifat
				</div>
				<div class="text-caption text-grey-8">
					Software Developer, Simec System Ltd.
				</div>
			</q-card-section>

			<q-card-actions align="center">
				<q-btn flat round icon="fab fa-facebook" class="bg-indigo-7 text-white" :to="{name: 'facebook'}"/>
				<q-btn flat round icon="fab fa-github" class="bg-dark text-white" :to="{name: 'github'}"/>
				<q-btn flat round icon="fab fa-instagram" class="bg-pink-14 text-white" :to="{name: 'instagram'}"/>
			</q-card-actions>
		</q-card>
	</section>
</template>

<script lang='ts'>
	import {Component, Vue} from "vue-property-decorator";

	@Component
	export default class AboutMe extends Vue {

	}
</script>

<style lang='scss'>
	.about-card {
		width: 100%;
		max-width: 300px
	}

	.custom-image {
		border-radius: 20%;
	}
</style>