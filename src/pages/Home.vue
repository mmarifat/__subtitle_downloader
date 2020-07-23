<template>
	<q-container>
		<q-row class="row justify-center">
			<q-card class="col-12 col-md-6 bg-transparent" bordered square>
				<!--this prevent means without verification search button eon't work-->
				<q-form greedy @submit.prevent="search">
					<q-card-section class="row q-col-gutter-md text-overline">
						<q-col class="col-6">
							<span>Information</span>
						</q-col>
						<q-col class="col-6 text-right">
							<q-toggle v-model="subtitleInfo.season.status" label="Series" left-label icon="check_box"/>
						</q-col>
						<q-col class="col-12">
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
						<q-col class="col-12">
							<q-select v-model="subtitleInfo.lang" label="Select Language" :options="langOptions" clearable clear-icon="clear"
							          use-input input-debounce="200" @filter="filterLang" map-options emit-value multiple
							          :rules="[$common.rules.required]"/>
						</q-col>
					</q-card-section>
					<q-card-actions align="right">
						<q-btn flat @click="reset" :color="$colors.negative">Reset</q-btn>
						<q-space/>
						<q-btn flat type="submit" :color="$colors.primary">Search</q-btn>
					</q-card-actions>
				</q-form>
			</q-card>
		</q-row>

		<q-dialog v-model="showSelectMovieDialog" transition-show="slide-down" transition-hide="slide-up">
			<q-card class="mma-card custom-background" v-if="movieSearchList.length">
				<q-linear-progress :value="1" :color="$colors.primary"/>
				<q-card-section class="row">
					<q-col class="col-8 q-pl-sm">
						<span class="text-h6 text-uppercase">Select {{subtitleInfo.season.status ? 'Series' : 'Movie'}}</span>
					</q-col>
					<q-col class="col-4 text-right">
						<q-icon name="close" :color="$colors.dark" size="md" v-close-popup/>
					</q-col>
				</q-card-section>

				<q-card-section class="q-pr-lg">
					<q-row class="q-col-gutter-sm">
						<q-col class="col-12" v-for="each in movieSearchList" :key="each.id+String(Math.random())">
							<q-list bordered padding dense>
								<q-item clickable @click="selectedMovie(each)">
									<q-item-section>
										<q-item-label overline v-html="each.original_title" class="q-pb-sm"/>
										<q-item-label caption v-html="'Release: '+$common.convertDate(each.release_date, 'DD MMM, YYYY')"/>
									</q-item-section>

									<q-item-section side top>
										<q-img :src="each.poster_path ? imagePath(each.poster_path) : 'images/not_available.svg'"
										       alt="images/not_available.svg" height="15vh" width="15vh">
											<template v-slot:loading>
												<q-spinner-bars :color="$colors.blue[10]"/>
											</template>
										</q-img>
									</q-item-section>
								</q-item>
							</q-list>
						</q-col>
					</q-row>
				</q-card-section>
			</q-card>

			<q-card v-else class="mma-card text-center">
				<q-card-section class="bg-amber text-black text-overline">
					<q-row>
						<q-col class="col-8">
							<span>No Such {{subtitleInfo.season.status ? 'Series' : 'Movie'}} Found!</span>
						</q-col>
						<q-col class="col-4 text-right">
							<q-icon name="close" :color="$colors.dark" size="md" v-close-popup/>
						</q-col>
					</q-row>
				</q-card-section>
				<q-card-actions class="justify-center">
					<q-btn label="Deep Search" @click="deepSearch" :color="$colors.primary"/>
				</q-card-actions>
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
	import {Loading, QSpinnerBars, QSpinnerGrid, QSpinnerPie} from "quasar";

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

		search() {
			Loading.show({
				//@ts-ignore
				spinner: QSpinnerBars,
				customClass: 'text-h4',
				spinnerColor: this.$colors.blue[10],
				messageColor: this.$colors.blue[1],
				backgroundColor: this.$colors.positive,
				message: 'Searching .....'
			})
			new Promise((resolve, reject) => {
				this.$library.mdb.searchMovie({query: this.subtitleInfo.name}, async (err: any, res: any) => {
					if (err) reject(err)
					else resolve((res.results))

				})
			}).then((results) => {
				this.movieSearchList = (results as Array<IMovieSearchResult>)
				Loading.hide()
			}).catch((err) => {
				this.$q.notify({
					message: 'Not Found!',
					caption: err,
					color: this.$colors.negative,
					icon: 'error',
					progress: true,
				})
			}).finally(() => {
				this.showSelectMovieDialog = true
			})
		}

		selectedMovie(movie: IMovieSearchResult) {
			Loading.show({
				//@ts-ignore
				spinner: QSpinnerGrid,
				customClass: 'text-h4',
				spinnerColor: this.$colors.yellow[10],
				messageColor: this.$colors.blue[1],
				backgroundColor: this.$colors.positive,
				message: 'Searching for the best subtitles [lang: ' + this.subtitleInfo.lang.join(',') + ']'
			})
			this.$library.mdb.movieInfo({id: movie.id}, async (err: any, res: any) => {
				if (err) throw err
				let response: IMovieSearchResult = res
				this.$library.openSubtitle.search({
					sublanguageid: this.subtitleInfo.lang.join(','),
					extensions: ['srt', 'vtt'],
					imdbid: response.imdb_id,
					limit: '5',
					query: response.imdb_id ? null : response.original_title,
					gzip: false
				}).then((subtitles: any) => {
					this.$root.$emit('showSelectSubtitleDialog', subtitles)
				}).finally(() => {
					Loading.hide()
				})
			})
		}

		deepSearch() {
			Loading.show({
				//@ts-ignore
				spinner: QSpinnerPie,
				customClass: 'text-h4',
				spinnerColor: this.$colors.yellow[10],
				messageColor: this.$colors.blue[1],
				backgroundColor: this.$colors.negative,
				message: 'Deep searching for the best subtitles [lang: ' + this.subtitleInfo.lang.join(',') + ']'
			})
			this.$library.openSubtitle.search({
				sublanguageid: this.subtitleInfo.lang.join(','),
				extensions: ['srt', 'vtt'],
				limit: '5',
				query: this.subtitleInfo.name,
				gzip: false
			}).then((subtitles: any) => {
				this.$root.$emit('showSelectSubtitleDialog', subtitles)
			}).finally(() => {
				Loading.hide()
			})
		}

		imagePath(suffix: string) {
			return 'https://image.tmdb.org/t/p/w500' + suffix
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