import { Question, Survey } from '@/assets/data/interfaces';
import { isAxiosError } from 'axios';
import { defineStore } from 'pinia';

const endpoint = '/tests';

export const useTestsStore = defineStore('tests', {
	// state
	state: () => ({
		test: {} as Survey,
	}),

	// getters
	getters: {
		getSurvey: (state): Survey => state.test,
	},

	// actions
	actions: {
		/**
		 * Fetches the test from the server
		 * @param params param should be the token
		 */
		async fetch(token: string) {
			const params = { token }; // to go through the backend middleware
			return this.axios
				.get(`${endpoint}/${token}`, { params })
				.then(({ data }) => {
					this.load(data);
				})
				.catch(err => {
					if (isAxiosError(err)) console.warn(err.response?.data);
					throw err;
				});
		},

		/**
		 * Loads the test in the store and local storage
		 * @param test The test to load
		 */
		load(test: Survey) {
			this.test = test;
		},

		/**
		 * Updates the survey with the new answer.
		 * @param survey The Survey to update.
		 * @param justCompleted True if the Survey has just been completed (answer was last answer).
		 */
		async save(test: Survey, question: Question, justCompleted = false) {
			this.test = test;
			const questionId = question.id;
			const answeredItems = question.items.filter(item => {
				if (item.answer || item.answer === 0) return item;
			});
			const answers = answeredItems.map(({ id, answer }) => ({ id, answer }));
			const payload = { questionId, answers, justCompleted };

			return this.axios.put(`${endpoint}/${test.id}`, payload).catch(err => {
				if (isAxiosError(err)) console.warn(err.response?.data);
				throw err;
			});
		},
	},
});
