<template>
	<q-layout view="lHr lpR lfr">
		<q-header elevated class="bg-amber-1 text-overline text-black">
			<q-toolbar>
				<q-toolbar-title>
					<q-avatar icon="subtitles" rounded size="50px"/>
					Subtitle Downloader
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
				<q-item clickable v-ripple :to="{name: 'aboutMe'}">
					<q-item-section avatar>
						<q-icon color="primary" name="perm_contact_calendar"/>
					</q-item-section>
					<q-item-section>About Me</q-item-section>
				</q-item>
			</q-list>
		</q-drawer>

		<q-page-container>
			<router-view class="q-pt-md"/>
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
