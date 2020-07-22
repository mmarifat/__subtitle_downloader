<template>
	<section>
		<div class="row justify-center">
			<div class="col-6 col-md-6">
				<q-card class="my-card">
					<q-card-section class="bg-primary text-white text-center">
						<div class="text-h6">Information For Subtitle</div>
					</q-card-section>

					<q-separator/>
					<!--this prevent means without verification search button eon't work-->
					<q-form greedy @submit.prevent="searchSubtitle">
						<q-card-section>
							<div class="col-12 text-right">
								<q-toggle v-model="subtitleInfo.season.status" label="Series" left-label icon="check_box"/>
							</div>
							<div class="row q-col-gutter-md">
								<div class="col-6">
									<q-input v-model="subtitleInfo.name" label="Name" :rules="[ val => val.toString().length || 'Required' ]"/>
								</div>
								<div class="col-6">
									<q-select v-model="subtitleInfo.lang" label="Select Language" :options="langOptions" clearable clear-icon="clear"
									          use-input input-debounce="200" @filter="filterLang" map-options emit-value multiple>
										<template v-slot:no-option>
											<q-item>
												<q-item-section class="text-grey">
													No results
												</q-item-section>
											</q-item>
										</template>
									</q-select>
								</div>
								<div class="col-6" v-if="subtitleInfo.season.status">
									<q-input v-model.number="subtitleInfo.season.no" label="Select Series No"
									         :rules="[ val => val > 0 || 'Required' ]"/>
								</div>
								<div class="col-6" v-if="subtitleInfo.season.status">
									<q-input v-model.number="subtitleInfo.season.ep" label="Select Episode"
									         :rules="[ val => val > 0 || 'Required' ]"/>
								</div>
							</div>
						</q-card-section>
						<q-card-actions align="right">
							<q-btn flat color="negative">Cancel</q-btn>
							<q-btn type="submit" flat color="postive">Search</q-btn>
						</q-card-actions>
					</q-form>
				</q-card>
			</div>
		</div>
		<select-movie :movies-list="movieSearchList" v-if="movieSearchList.length"/>
	</section>
</template>

<script lang='ts'>
	import {Component, Vue} from "vue-property-decorator";
	import {ISubtitleInfo} from "src/interfaces/IEssentials";
	import {CSubtitleLanguage} from "src/interfaces/Constants";
	import SelectMovie from "components/SelectMovie.vue";

	@Component({
		components: {SelectMovie}
	})
	export default class Home extends Vue {
		subtitleInfo: ISubtitleInfo = {
			name: '',
			lang: [CSubtitleLanguage.English],
			season: {
				status: false,
				no: 1,
				ep: 1
			}
		}
		langOptions: Array<any> = []
		filterOptions: Array<any> = []

		created() {
			Object.keys(CSubtitleLanguage).forEach(value => {
				//@ts-ignore
				this.langOptions.push({label: value, value: CSubtitleLanguage[value]})
			})
			this.filterOptions = this.langOptions
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

		movieSearchList: Array<any> = []

		searchSubtitle() {

			//lets search the movie from input box value
			Mdb.searchMovie({query: this.subtitleInfo.name}, (err, res) => {
				err ? console.log(err) : null
				console.log(res);
				res.results.forEach(each => {
					this.movieSearchList.push(
						  {title: each.original_title, id: each.id, date: each.release_date}
					)
				})
			});
		}

		reset() {
			this.subtitleInfo = {
				name: '',
				lang: [CSubtitleLanguage.English],
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