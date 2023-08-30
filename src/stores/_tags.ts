import { defineStore } from 'pinia';
import { Tag } from '@/assets/data/interfaces';
import { deleteMixin, saveMixin } from '@/mixins';
import { useQuestionsStore } from '.';

const endpoint = 'tags';

export const useTagsStore = defineStore('tags', {
	//
	state: () => ({
		tags: [] as Tag[],
	}),

	// getters
	getters: {
		getTags: (state): Tag[] => state.tags,
	},

	// actions
	actions: {
		async fetch() {
			const { data } = await this.axios.get(endpoint);
			this.load(data);
		},

		/**
		 * Returns the Tag with the given ID.
		 * @param id The Tag ID.
		 * @returns The Tag with the given ID.
		 */
		getById(id: number): Tag | undefined {
			return this.tags.find(tag => tag.id === id);
		},

		/**
		 * Load the tags list.
		 * @param tags The tags' list.
		 */
		load(tags: Tag[]) {
			this.tags = tags;
		},

		/**
		 * Saves new tag to the db and updates the local store with the new data
		 * @param tag The tag to be saved.
		 */
		async save(tag: Tag): Promise<void> {
			return await saveMixin(this, endpoint, tag, this.tags, this.load)
				.then(() => {
					useQuestionsStore().fetch();
				})
				.catch(e => {
					throw e;
				});
		},

		/**
		 * Deletes data from the db and updates the local store after deletion
		 * @param id The ID of the tag to delete.
		 */
		async delete(id: number) {
			await deleteMixin(this, endpoint, id, this.tags, this.load).then(() => {
				useQuestionsStore().fetch();
			});
		},
	},
});
