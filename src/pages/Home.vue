<template>
	<q-container>
		<q-row class="justify-center">
			<q-col class="col-12 col-md-6">
				<q-card class="row">
					<!--this prevent means without verification search button eon't work-->
					<q-form greedy @submit.prevent="searchSubtitle">
						<q-card-section class="row q-col-gutter-md">
							<q-col class="col-12 col-md-6 text-right">
								<q-toggle v-model="subtitleInfo.season.status" label="Series" left-label icon="check_box"/>
							</q-col>
							<q-col class="col-12 col-md-6">
								<q-input v-model="subtitleInfo.name" stack-label label="Name"
								         :rules="[$common.rules.required]"/>
							</q-col>
							<q-col class="col-6" v-if="subtitleInfo.season.status">
								<q-input v-model.number="subtitleInfo.season.no" label="Series No"
								         :rules="[$common.rules.required, $common.rules.number]"/>
							</q-col>
							<q-col class="col-6" v-if="subtitleInfo.season.status">
								<q-input v-model.number="subtitleInfo.season.ep" label="Episode No"
								         :rules="[$common.rules.required, $common.rules.number]"/>
							</q-col>
							<q-col class="col-12 col-md-6">
								<q-select v-model="subtitleInfo.lang" label="Select Language" :options="langOptions" clearable clear-icon="clear"
								          use-input input-debounce="200" @filter="filterLang" map-options emit-value multiple
								          :rules="[$common.rules.required]"/>
							</q-col>
						</q-card-section>
						<q-card-actions align="right">
							<q-btn flat @click="reset" :color="$colors.negative">Cancel</q-btn>
							<q-space/>
							<q-btn flat type="submit" :color="$colors.primary">Search</q-btn>
						</q-card-actions>
					</q-form>
				</q-card>
			</q-col>
		</q-row>

		<q-dialog v-model="showSelectMovieDialog" position="bottom" transition-show="slide-up" transition-hide="slide-down">
			<q-card class="mma-card" v-if="movieSearchList.length">
				<q-linear-progress :value="1" :color="$colors.primary"/>
				<q-card-section>
					<q-row>
						<q-col class="col-8">
							<span class="text-h6 text-uppercase">Select {{subtitleInfo.season.status ? 'Series' : 'Movie'}}</span>
						</q-col>
						<q-col class="col-4 text-right">
							<q-icon name="close" :color="$colors.dark" size="md" v-close-popup/>
						</q-col>
					</q-row>

				</q-card-section>

				<q-card-section class="q-pr-lg">
					<q-row class="q-col-gutter-sm">
						<q-col class="col-12" v-for="each in movieSearchList" :key="each.id">
							<q-list bordered padding dense>
								<q-item clickable @click="selectedMovie(each)">
									<q-item-section>
										<q-item-label overline v-html="each.original_title"/>
										<!--<q-item-label caption v-html="each.overview"/>-->
									</q-item-section>

									<q-item-section side>
										<q-item-label caption v-html="$common.convertDate(each.release_date, 'DD MMM, YYYY')"/>
									</q-item-section>
								</q-item>
							</q-list>
						</q-col>
					</q-row>
				</q-card-section>
			</q-card>

			<q-card v-else style="width: 700px; max-width: 90vw;">
				<q-card-section class="bg-amber text-black text-overline">
					No Movies / Series
				</q-card-section>
			</q-card>
		</q-dialog>

		<select-subtitle/>
	</q-container>
</template>

<script lang='ts'>
	import {Component, Vue} from "vue-property-decorator";
	import {IMovieSearchResult, ISubtitleInfo} from "src/interfaces/IEssentials";
	import {CSubtitleLanguage} from "src/interfaces/Constants";
	import SelectSubtitle from "components/SelectSubtitle.vue";

	@Component({
		components: {SelectSubtitle}
	})
	export default class Home extends Vue {
		subtitleInfo: ISubtitleInfo = {
			name: '',
			lang: [CSubtitleLanguage.English, CSubtitleLanguage.Bengali],
			season: {
				status: false,
				no: 1,
				ep: 1
			}
		}
		langOptions: Array<any> = []
		filterOptions: Array<any> = []

		showSelectMovieDialog: boolean = false
		movieSearchList: Array<IMovieSearchResult> = []

		created() {
			Object.keys(CSubtitleLanguage).forEach(value => {
				//@ts-ignore
				this.langOptions.push({label: value, value: CSubtitleLanguage[value]})
			})
			this.filterOptions = this.langOptions

			this.$root.$on('downloadDone', () => {
				this.reset()
			})
		}

		filterLang(val: string, update: Function) {
			if (val === '') {
				update(() => {
					this.langOptions = this.filterOptions
				})
			}
			update(() => {
				const needle = val.toLowerCase()
				this.langOptions = this.filterOptions.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
			})
		}

		searchSubtitle() {
			//lets search the movie from input box value
			this.$library.mdb.searchMovie({query: this.subtitleInfo.name}, async (err: any, res: any) => {
				if (err) throw err
				this.movieSearchList = (res.results as Array<IMovieSearchResult>)
			})
			this.showSelectMovieDialog = true
		}

		selectedMovie(movie: IMovieSearchResult) {
			this.$library.mdb.movieInfo({id: movie.id}, async (err: any, res: any) => {
				if (err) throw err
				let response: IMovieSearchResult = res
				console.log(this.subtitleInfo);
				this.$library.openSubtitle.search({
					sublanguageid: this.subtitleInfo.lang.join(','),
					extensions: ['srt', 'vtt'],
					imdbid: response.imdb_id,
					limit: 'best',
					query: response.imdb_id ? null : response.original_title,
					gzip: false
				}).then((subtitles: any) => {
					this.$root.$emit('showSelectSubtitleDialog', subtitles)
				})
			})
		}

		reset() {
			this.subtitleInfo = {
				name: '',
				lang: [CSubtitleLanguage.English, CSubtitleLanguage.Bengali],
				season: {
					status: false,
					no: 1,
					ep: 1
				}
			}
		}
	}
</script>

<style lang='scss'>

</style>