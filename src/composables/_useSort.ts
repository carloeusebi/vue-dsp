/**
 * Sorts an array of objects given a property to sort by and the direction
 * @param arr the array of objects to sort
 * @param by the property of the object to sort by
 * @param type up = asc | down = desc
 * @returns the sorted array of objects
 */
export function useSort<T>(arr: T[], by: keyof T, direction: 'up' | 'down'): T[] {
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
