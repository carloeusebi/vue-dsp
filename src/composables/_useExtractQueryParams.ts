import router from '@/routes';

/**
 * Extracts query params, then removes them.
 * @returns An Object with all the query params.
 */
export function useExtractQueryParams() {
	const { ...queryParams } = router.currentRoute.value.query as { [string: string]: string };
	router.replace({ query: {} });
	return queryParams;
}
