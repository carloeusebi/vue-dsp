/**
 * Calculates the age based on a given birthday.
 * @param birthday - The birthday.
 * @returns The calculated age as a number.
 */
export function calculateAge(birthday: string): number {
	const today = new Date();
	const birthDate = new Date(birthday);

	let age = today.getFullYear() - birthDate.getFullYear();
	const monthDiff = today.getMonth() - birthDate.getMonth();

	if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
		age--;
	}

	return age;
}
