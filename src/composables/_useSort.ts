import { Order, Patient, Survey } from '@/assets/data/interfaces';

/**
 * Sorts an array of objects given a property to sort by and the direction.
 * @param arr The array of objects to sort.
 * @param order The order Object with by and direction properties.
 * @returns The sorted array of objects.
 */
export function useSort<T extends Patient | Survey>(arr: T[], order: Order<T>): T[] {
	const { by, direction } = order;
	return arr.sort((a, b) => {
		const aValue = a[by];
		const bValue = b[by];

		if (!aValue && !bValue) {
			return 0;
		} else if (!aValue) {
			return direction === 'up' ? 1 : -1;
		} else if (!bValue) {
			return direction === 'up' ? -1 : 1;
		}

		return direction === 'up' ? (aValue < bValue ? 1 : -1) : aValue > bValue ? 1 : -1;
	});
}
