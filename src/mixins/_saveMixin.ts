import { Store } from 'pinia';

import { Patient, Question, Survey, Tag } from '@/assets/data/interfaces';

/**
 * Saves data to the db and updates the local store with the new data.
 * @param store - The Pinia store instance.
 * @param endpoint - The API endpoint to which the data will be sent for saving.
 * @param toSaveData - The data to be saved in the server request.
 * @param storeData - The array of data in the local store that will be updated after the save operation.
 * @param loadMethod - The method in the store responsible for updating the local data with the new data after saving.
 * @returns A Promise that resolves to void once the save and local store update operations are completed.
 */
export async function saveMixin<T extends Store>(
	store: T,
	endpoint: string,
	toSaveData: Patient | Tag | Question | Survey,
	storeData: Array<Patient | Tag | Question | Survey>,
	loadMethod: (data: Array<any>) => void
): Promise<void> {
	try {
		if (toSaveData.id) {
			// updates the database entry with the associate id
			const { id } = toSaveData;
			const res = await store.axios.put(`${endpoint}/${id}`, toSaveData);

			const updatedEntity = res.data;

			storeData = storeData.map(data => {
				if (data.id === updatedEntity.id) {
					return { ...updatedEntity };
				}
			});
		} else {
			// creates a new database entry

			const res = await store.axios.post(endpoint, toSaveData);
			const insertedItem = res.data;
			storeData.push(insertedItem);
		}
		// Call the loadMethod to update the local store with the new data
		loadMethod(storeData);
	} catch (err) {
		throw err;
	}
}
