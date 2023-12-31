import { Survey } from '@/assets/data/interfaces';
import { deleteMixin, saveMixin } from '@/mixins';
import { defineStore } from 'pinia';

const endpoint = '/surveys';

export const useSurveysStore = defineStore('surveys', {
	//state
	state: () => ({
		surveys: [] as Survey[],
		lastInsertedId: null as null | number,
	}),

	//actions
	actions: {
		async fetch() {
			try {
				const { data } = await this.axios.get(endpoint);
				this.load(data);
			} catch (err) {
				console.warn(err);
			}
		},

		async fetchById(id: number): Promise<Survey | undefined> {
			try {
				const { data } = await this.axios.get(`${endpoint}/${id}`);
				return data;
			} catch (err) {
				console.warn(err);
			}
		},

		getById(id: number): Survey | undefined {
			return this.surveys.find(survey => survey.id == id);
		},

		getByPatientId(id: number) {
			return this.surveys.filter(survey => id == survey.patient_id);
		},

		load(surveys: Survey[]) {
			this.surveys = surveys.map(s => {
				s.patient_name = s.patient ? `${s.patient.fname} ${s.patient.lname}` : 'Paziente eliminato';
				return s;
			});
		},

		/**
		 * Saves the survey to the db and updates the local store with the new data
		 * @param survey The survey to be saved in the server request
		 */
		async save(survey: Survey): Promise<void> {
			this.lastInsertedId = await saveMixin(this, endpoint, survey, this.surveys, this.load);
		},

		/**
		 * Deletes surveys from the db and updates the local store after deletion
		 * @param id The ID of the survey to be deleted
		 */
		async delete(id: number) {
			await deleteMixin(this, endpoint, id, this.surveys, this.load);
		},
	},
});
