import { Patient } from '@/assets/data/interfaces';
import { calculateAge, deleteMixin, saveMixin } from '@/mixins';
import { defineStore } from 'pinia';

const endpoint = '/patients';

export const usePatientsStore = defineStore('patients', {
	//state
	state: () => ({
		patients: [] as Patient[],
		labels: {} as Patient,
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

		async fetchById(id: number): Promise<Patient | undefined> {
			const res = await this.axios.get(`${endpoint}/${id}`);
			return res.data;
		},

		/**
		 * Get a Patient by its ID
		 * @param id The Patient ID
		 * @returns The Patient object
		 */
		getById(id: number): Patient | undefined {
			return this.patients.find(patient => patient.id == id);
		},

		/**
		 * Loads both labels and patients list received from ta ajax call to the
		 * @param patients An object with labels and patients list
		 */
		load(patients: PatientsAndLabels) {
			this.loadPatients(patients.list);
			this.loadLabels(patients.labels);
		},

		/**
		 * Load the patients list
		 * @param patients the patient's list
		 */
		loadPatients(patients: Patient[]) {
			patients = patients.map(patient => {
				// if birthday update patient's age and convert birthday to locale date format
				if (patient.birthday) {
					patient.age = calculateAge(patient.birthday);
					patient.birthday = new Date(patient.birthday).toLocaleDateString();
				}
				//convert begin date to local date format
				patient.begin = new Date(patient.begin).toLocaleDateString();

				return patient;
			});
			this.patients = patients;
		},

		/**
		 * Load the patient's labels
		 * @param labels the user friendly labels in italian
		 */
		loadLabels(labels: Patient) {
			this.labels = labels;
		},

		/**
		 * Calls the database to update the patient, if success it updates it locally
		 * @param patient The patient to be saved
		 */
		async save(patient: Patient): Promise<void> {
			this.lastInsertedId = await saveMixin(this, endpoint, patient, this.patients, this.loadPatients);
		},

		/**
		 * Calls the db to delete the patient, if success it deletes it locally
		 * @param id The ID of the patient to be deleted
		 */
		async delete(id: number) {
			await deleteMixin(this, endpoint, id, this.patients, this.loadPatients);
		},

		/**
		 * It updates the store deleting the file locally.
		 * @param patientId The ID of the Patient to whom the file is being deleted
		 * @param fileId The ID of the file to delete
		 */
		deletePatientFile(patientId: number, fileId: number) {
			const patIndex = this.patients.findIndex(({ id }) => id === patientId);
			const files = this.patients[patIndex].files;

			if (!files) return;

			this.patients[patIndex].files = this.patients[patIndex].files?.filter(({ id }) => id !== fileId);
		},
	},
});

export interface PatientsAndLabels {
	list: Patient[];
	labels: Patient;
}
