import { MyStore } from '@/assets/data/interfaces';
import router from '@/routes';
import { useLoaderStore } from '@/stores';
import { isAxiosError } from 'axios';
import { RouteLocationRaw } from 'vue-router';

/**
 * Asynchronous function to delete an item from a given store using its ID.
 * @param store The store from which the item needs to be deleted.
 * @param id The unique identifier of the item to be deleted.
 * @param redirectTo The name of the route to redirect to.
 */
export async function useDeleteFromStore(store: MyStore, id: number, redirectTo: RouteLocationRaw) {
	const loader = useLoaderStore();

	loader.setLoader;
	try {
		await store.delete(id);
		router.push(redirectTo);
	} catch (err) {
		if (!isAxiosError(err)) console.log(err);
	} finally {
		loader.unsetLoader();
	}
}
