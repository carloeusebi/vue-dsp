/**
 * Finds the index of the first item without the looked prop
 * @param arr the array to look into
 * @param prop the prop to find
 * @returns the index of the first item without the prop in the array
 */
export function useGetIndexOfFirstItemWithoutProp<T extends Object>(arr: T[], prop: keyof T): number {
	const index = arr.findIndex(item => !item.hasOwnProperty(prop) || item[prop] === null || item[prop] === false);
	return index !== -1 ? index : arr.length;
}
