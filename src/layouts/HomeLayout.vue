<template>
	<q-layout view="lHr lpR lfr">
		<q-header elevated class="bg-amber text-indigo-10 text-uppercase">
			<q-toolbar>
				<q-toolbar-title>
					<q-avatar icon="subtitles" rounded size="50px" :text-color="$colors.indigo[10]"/>
					<span>Subtitle Downloader</span>
				</q-toolbar-title>
				<q-btn dense flat round icon="menu" @click="right = !right"/>
			</q-toolbar>
		</q-header>

		<q-drawer v-model="right" side="right" behavior="mobile" elevated>
			<q-img src="images/subtitle.png" style="width: 100%">
				<div class="absolute-bottom text-subtitle1 text-center">
					Subtitle Downloader
				</div>
			</q-img>
			<q-list bordered>
				<q-item clickable v-ripple :to="{name: 'dashboard'}" exact>
					<q-item-section avatar>
						<q-icon :color="$colors.primary" name="dashboard"/>
					</q-item-section>
					<q-item-section>Home</q-item-section>
				</q-item>
				<q-item clickable v-ripple :to="{name: 'aboutMe'}" exact>
					<q-item-section avatar>
						<q-icon :color="$colors.primary" name="perm_contact_calendar"/>
					</q-item-section>
					<q-item-section>About Developer</q-item-section>
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
