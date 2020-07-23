<template>
	<section class="row justify-center">
		<q-card class="q-mt-lg" flat>
			<q-card-section class="text-center">
				<q-avatar size="150px" class="shadow-22">
					<img src="images/me.jpg" alt="">
				</q-avatar>
			</q-card-section>

			<q-card-section class="q-pt-none text-center ">
				<div class="text-h6  text-grey-8">
					Minhaz Ahamed Rifat
				</div>
				<div class="text-caption text-grey-8">
					Software Engineer
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

		stars: number = 4

		created() {
		}
	}
</script>

<style lang='scss'>
	.about-card {
		width: 100%;
		max-width: 300px
	}
</style>