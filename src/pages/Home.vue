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

		<q-dialog v-model="showListDialog" transition-show="slide-down" transition-hide="slide-up">
			<q-card class="mma-card custom-background" v-if="searchResultList.length">
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
						<q-col class="col-12" v-for="each in searchResultList" :key="each.id+String(Math.random())">
							<q-list bordered padding dense>
								<q-item clickable @click="selected(each)">
									<q-item-section>
										<q-item-label overline v-html="subtitleInfo.season.status ? each.original_name: each.original_title"
										              class="q-pb-sm"/>
										<q-item-label caption>
											Release: {{$common.convertDate(subtitleInfo.season.status ?
											each.first_air_date : each.release_date, 'DD MMM, YYYY') }}
										</q-item-label>
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
						<q-col class="col-8 text-left">
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
	import {IMovieSearchResult, ISeries, ISubtitleInfo} from "src/interfaces/IEssentials";
	import {CSubtitleLanguage} from "src/interfaces/Constants";
	import SelectSubtitle from "components/SelectSubtitle.vue";
	import {Loading, QSpinnerBars, QSpinnerGrid, QSpinnerPie} from "quasar";

	const {MovieDb} = require('moviedb-promise')
	const moviedb = new MovieDb(process.env.API_KEY)

	const OS = require('opensubtitles-api');
	const openSubtitle = new OS('UserAgent');

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

		showListDialog: boolean = false
		searchResultList: Array<IMovieSearchResult> = []

		created() {
			Object.keys(CSubtitleLanguage).forEach(value => {
				//@ts-ignore
				this.langOptions.push({label: value, value: CSubtitleLanguage[value]})
			})
			this.filterOptions = this.langOptions

			this.$root.$on('downloadDone', () => {
				this.showListDialog = false
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
			if (!this.subtitleInfo.season.status) {
				moviedb.searchMovie({query: this.subtitleInfo.name}).then((res: any) => {
					this.searchResultList = []
					this.searchResultList = (res.results as Array<IMovieSearchResult>)
				}).catch(console.error).finally(() => {
					this.showListDialog = true
				}).finally(() => {
					Loading.hide()
				})
			} else {
				moviedb.searchTv({query: this.subtitleInfo.name}).then((res: any) => {
					this.searchResultList = []
					this.searchResultList = (res.results as Array<IMovieSearchResult>)
				}).catch(console.error).finally(() => {
					this.showListDialog = true
				}).finally(() => {
					Loading.hide()
				})
			}
		}

		selected(info: IMovieSearchResult) {
			Loading.show({
				//@ts-ignore
				spinner: QSpinnerGrid,
				customClass: 'text-h4',
				spinnerColor: this.$colors.yellow[10],
				messageColor: this.$colors.blue[1],
				backgroundColor: this.$colors.positive,
				message: 'Searching for the best subtitles [lang: ' + this.subtitleInfo.lang.join(',') + ']'
			})
			if (!this.subtitleInfo.season.status) {
				moviedb.movieInfo({id: info.id}).then((res: IMovieSearchResult) => {
					openSubtitle.search({
						sublanguageid: this.subtitleInfo.lang.join(','),
						extensions: ['srt', 'vtt'],
						imdbid: res.imdb_id,
						limit: '5',
						query: res.imdb_id ? null : res.original_title,
						gzip: false
					}).then((subtitles: any) => {
						this.$root.$emit('showSelectSubtitleDialog', subtitles)
					}).finally(() => {
						Loading.hide()
					})
				}).catch(console.error)
			} else {
				moviedb.tvExternalIds({id: info.id}).then((res: ISeries) => {
					openSubtitle.search({
						sublanguageid: this.subtitleInfo.lang.join(','),
						extensions: ['srt', 'vtt'],
						imdbid: res.imdb_id,
						limit: '5',
						season: String(this.subtitleInfo.season.no),
						episode: String(this.subtitleInfo.season.ep),
						query: res.id ? null : info.original_name,
						gzip: false
					}).then((subtitles: any) => {
						this.$root.$emit('showSelectSubtitleDialog', subtitles)
					}).finally(() => {
						Loading.hide()
					})
				}).catch(console.error)
			}
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
			openSubtitle.search({
				sublanguageid: this.subtitleInfo.lang.join(','),
				extensions: ['srt', 'vtt'],
				limit: '5',
				season: this.subtitleInfo.season.status ? String(this.subtitleInfo.season.no) : null,
				episode: this.subtitleInfo.season.status ? String(this.subtitleInfo.season.ep) : null,
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