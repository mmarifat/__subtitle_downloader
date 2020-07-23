<template>
	<q-layout view="lHr lpR lfr" class="custom-background">
		<q-header elevated class="custom-background text-indigo-10 text-uppercase">
			<q-toolbar>
				<q-item clickable :to="{name: 'dashboard'}" exact>
					<q-item-label overline>
						<q-avatar icon="subtitles" rounded size="50px" :text-color="$colors.indigo[10]"/>
						<span>Subtitle Downloader</span>
					</q-item-label>
				</q-item>
				<q-space/>
				<q-btn dense flat round icon="menu" @click="right = !right"/>
			</q-toolbar>
		</q-header>

		<q-drawer v-model="right" side="right" behavior="mobile" elevated>
			<q-img src="images/subtitle.png" style="width: 100%">
				<div class="absolute-bottom text-subtitle1 text-center bg-blue-10">
					Subtitle Downloader
				</div>
			</q-img>
			<q-list bordered>
				<q-item clickable v-ripple :to="{name: 'dashboard'}" exact>
					<q-item-section avatar>
						<q-icon :color="$colors.blue[10]" name="dashboard"/>
					</q-item-section>
					<q-item-section>HOME</q-item-section>
				</q-item>
				<q-item clickable v-ripple :to="{name: 'aboutMe'}" exact>
					<q-item-section avatar>
						<q-icon :color="$colors.blue[10]" name="fa fa-user-cog"/>
					</q-item-section>
					<q-item-section>DEVELOPER</q-item-section>
				</q-item>
			</q-list>
		</q-drawer>

		<q-page-container>
			<router-view class="q-pt-md q-mt-md"/>
		</q-page-container>

		<!--<q-footer elevated class="bg-grey-8 text-white">
			<q-toolbar>
				<q-toolbar-title>
					<q-avatar>
						<img src="">
					</q-avatar>
					Title
				</q-toolbar-title>
			</q-toolbar>
		</q-footer>-->

	</q-layout>
</template>

<script lang="ts">
	import {Component, Vue} from 'vue-property-decorator';

	@Component
	export default class MainLayout extends Vue {
		right: boolean = false
	}
</script>

<style lang="scss">

</style>
