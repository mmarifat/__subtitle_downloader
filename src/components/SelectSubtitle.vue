<template>
	<q-dialog v-model="showSelectSubtitleDialog" position="top" transition-show="slide-up" transition-hide="slide-down">
		<q-card class="mma-card" v-if="subtitleLists.length">
			<q-linear-progress :value="1" :color="$colors.positive"/>
			<q-card-section>
				<q-row>
					<q-col class="col-8">
						<span class="text-h6 text-uppercase">Select Subtitle</span>
					</q-col>
					<q-col class="col-4 text-right">
						<q-icon name="close" :color="$colors.dark" size="md" v-close-popup/>
					</q-col>
				</q-row>

			</q-card-section>

			<q-card-section class="q-pr-lg">
				<q-row class="q-col-gutter-sm" v-for="eachSub in subtitleLists" :key="Math.random()">
					<q-col class="col-12" v-for="each in eachSub" :key="each.id+String(Math.random())">
						<q-list bordered padding dense>
							<q-item clickable @click="selectedSubtitle(each)">
								<q-item-section>
									<q-item-label overline v-html="'['+each.langcode+'] '+each.filename"/>
									<q-tooltip :offset="[0,0]" anchor="top middle" self="center middle"
									           content-class="bg-primary text-white shadow-4 q-pa-xs">
										Download
									</q-tooltip>
								</q-item-section>
								<q-item-section side top>
									<q-item-label caption v-html="each.downloads"/>
									<q-tooltip :offset="[0,0]" anchor="top middle" self="center middle"
									           content-class="bg-blue text-white shadow-4 q-pa-xs">
										Total Downloads Time
									</q-tooltip>
								</q-item-section>
							</q-item>
						</q-list>
					</q-col>
				</q-row>
			</q-card-section>
		</q-card>

		<q-card v-else class="mma-card">
			<q-card-section class="bg-amber text-black text-overline">
				No Subtitles
			</q-card-section>
		</q-card>
	</q-dialog>
</template>

<script lang='ts'>
	import {Component, Vue} from "vue-property-decorator";

	@Component
	export default class SelectSubtitle extends Vue {

		showSelectSubtitleDialog: boolean = false
		subtitleLists: Array<any> = []

		created() {
			this.$root.$on('showSelectSubtitleDialog', (subtitles: any) => {
				Object.keys(subtitles).forEach(each => {
					this.subtitleLists.push(subtitles[each])
				})
				this.showSelectSubtitleDialog = true
			})
		}

		selectedSubtitle(subtitle: any) {
			this.$axios({
				method: 'get',
				url: subtitle.utf8,
				responseType: 'arraybuffer',
			}).then((response) => {
				let blob = new Blob([response.data], {type: 'text/*'})
				let link = document.createElement('a')
				link.href = window.URL.createObjectURL(blob)
				link.download = subtitle.filename
				link.click()
			}).then(() => {
				this.$q.notify({
					message: 'Downloaded!',
					caption: subtitle.filename,
					color: this.$colors.positive,
					icon: 'get_app',
					progress: true,
				})
			}).finally(() => {
				this.$root.$emit('downloadDone')
			})
		}
	}
</script>

<style lang='scss'>

</style>