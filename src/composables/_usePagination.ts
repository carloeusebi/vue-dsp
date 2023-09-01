import { Order, Patient, Survey } from '@/assets/data/interfaces';
import { Ref, computed, ref } from 'vue';
import { useSearchFilter, useSort, useSplitArrayIntoChunks } from '.';

/**
 * Provides search, sort, and pagination functionality for a resource array.
 * @template T The type of the resource objects in the array.
 * @param data The ref containing the array of resource objects.
 * @param fieldsToSearch The fields to be searched when filtering.
 * @param defaultOrder The default sorting order.
 * @param itemsPerPage The number of items per page for pagination.
 * @returns An object containing various reactive properties and methods.
 */
export function usePagination<T extends Patient | Survey>(
	data: Ref<T[] | null>,
	fieldsToSearchIn: Array<keyof T>,
	defaultOrder: Order<T>,
	itemsPerPage: number
) {
	const searchWord = ref('');
	const order = ref({ ...defaultOrder });
	const activePage = ref(0);

	const handleSearchbarKeypress = (word: string) => (searchWord.value = word.toLowerCase());

	const filteredBySearch = computed(() => {
		if (!data.value) return [];
		return useSearchFilter(data.value, searchWord.value, fieldsToSearchIn);
	});

	//@ts-ignore
	const filteredAndOrdered = computed(() => useSort(filteredBySearch.value, order.value));

	const pages = computed(() => useSplitArrayIntoChunks(filteredAndOrdered.value, itemsPerPage));

	return { handleSearchbarKeypress, order, activePage, pages, filteredAndOrdered };
}
