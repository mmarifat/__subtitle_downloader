import {CSubtitleLanguage} from "src/interfaces/Constants";

export interface ISubtitleInfo {
	name: string
	lang: Array<CSubtitleLanguage>
	season: {
		status: boolean
		no: number
		ep: number
	}
}

export interface IMovieSearchResult {
	id?: string | any
	adult?: boolean
	backdrop_path?: string | any
	genre_ids?: Array<number> | Array<any>
	original_language?: string
	original_title?: string
	overview?: string
	popularity?: number | any
	poster_path?: string
	release_date?: Date | any

	first_air_date?: Date | any
	original_name?: string

	title?: string
	video?: boolean | any
	vote_average?: number | any
	vote_count?: number | any

	imdb_id?: string
	belongs_to_collection?: any
	budget?: number | any
	genres?: Array<any>
	homepage?: string
	production_companies?: Array<any>
	production_countries?: Array<any>
	spoken_languages?: Array<any>
	status?: string
	tagline?: string
}

export interface ISeries {
	id: string | number | any
	imdb_id: string | number | any
	tvdb_id: string | number | any
	tvrage_id: string | number | any
	twitter_id: string | number | any
	instagram_id: string | number | any
	freebase_id: string | number | any
	facebook_id: string | number | any
	freebase_mid: string | number | any

}
