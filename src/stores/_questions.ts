import { Question } from '@/assets/data/interfaces';
import { deleteMixin, saveMixin } from '@/mixins';
import { defineStore } from 'pinia';

const endpoint = '/questions';

export const useQuestionsStore = defineStore('questions', {
	//state
	state: () => ({
		questions: [] as Question[],
		labels: {} as Question,
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

		getById(id: number) {
			return this.questions.find(question => question.id == id);
		},

		/**
		 * Loads bot labels and questions list received from the ajax call to the db
		 * @param questions An object with labels and questions list
		 */
		load(questionsAndLabels: QuestionsAndLabels) {
			this.loadQuestions(questionsAndLabels.list);
			this.loadLabels(questionsAndLabels.labels);
		},

		/**
		 * Load the questions list
		 * @param questions the questions's list
		 */
		loadQuestions(questions: Question[]) {
			questions.forEach(q => {
				if (!q.legend) q.legend = [];
				if (!q.variables) q.variables = [];

				q.items = q.items
					? q.items.map(item => {
							item.reversed = item.reversed ? item.reversed : false;
							return item;
					  })
					: [];
			});
			this.questions = questions;
		},

		/**
		 * Loads the question's labels
		 * @param labels the user friendly labels in italian
		 */
		loadLabels(labels: Question) {
			this.labels = labels;
		},

		/**
		 * Saves data to the db and updates the local store with the new data
		 * @param question The question to be saved
		 */
		async save(question: Question): Promise<void> {
			this.lastInsertedId = await saveMixin(this, endpoint, question, this.questions, this.loadQuestions);
		},

		/**
		 * Deletes data from the db and updates the local store after deletion
		 * @param id The ID of the item to delete
		 */
		async delete(id: number) {
			await deleteMixin(this, endpoint, id, this.questions, this.loadQuestions);
		},
	},
});

export interface QuestionsAndLabels {
	list: Question[];
	labels: Question;
}
