import { usePatientsStore, useQuestionsStore, useSurveysStore } from '@/stores';
import { useTagsStore } from '@/stores/_tags';

export interface FileRecord {
	id: number;
	patient_id?: number;
	type: string;
	name: string;
	path: string;
}

export interface Patient {
	id: number;
	fname: string;
	lname: string;
	age?: number;
	birthday: string;
	birthplace?: string;
	address?: string;
	codice_fiscale?: string;
	begin: string;
	email?: string;
	phone?: string;
	files?: FileRecord[];
	weight?: string;
	height?: string;
	job?: string;
	qualification?: string;
	drugs?: string;
	sex?: 'M' | 'F' | 'O';
	cohabitants?: string;
}

export interface QuestionItemCustomAnswer {
	id: number;
	customAnswer: string;
	points: number;
}

export interface QuestionItemI {
	id: number;
	text: string;
	answer?: number;
	comment?: string;
	reversed?: boolean;
	hasMultipleAnswers?: boolean;
	multipleAnswers?: QuestionItemCustomAnswer[];
}

export interface QuestionLegend {
	id: number;
	legend: string;
}

export interface QuestionVariableCutoff {
	id: number;
	name: string;
	type: 'range' | 'greater-than' | 'lesser-than';
	from: number;
	to: number;
	femFrom?: number;
	femTo?: number;
	scored?: boolean;
}

export interface QuestionVariableI {
	id: number;
	name: string;
	items: number[]; //array of items ID
	cutoffs: QuestionVariableCutoff[];
	genderBased?: boolean;
	score?: number;
}

export interface Question {
	id: number;
	question: string;
	description: string;
	type: '1-4' | '1-6' | '0-5' | '0-3' | '1-7' | '0-4' | '1-4' | '1-5' | 'EDI' | 'MUL';
	legend: QuestionLegend[];
	items: QuestionItemI[];
	variables: QuestionVariableI[];
	selected?: boolean;
	completed?: boolean;
	tags?: Tag[];
}

export interface SearchableQuestion extends Question {
	tagsString?: string;
}

export interface Survey {
	id: number;
	patient_id: number;
	patient_name: string;
	patient: Patient;
	title: string;
	questionIds: number[];
	questions: Question[];
	created_at?: string;
	updated_at?: string;
	completed: boolean;
	token: string;
}

export interface Tag {
	id: number;
	tag: string;
	color: string;
}

export type NewTag = Omit<Tag, 'id'>;
export type NewPatient = Omit<Patient, 'id'>;
export type NewQuestion = Omit<Question, 'id'>;
export type NewSurvey = Omit<Survey, 'id' | 'token'>;

export interface LoginForm {
	email: string;
	password: string;
}

export interface Cell<T> {
	label?: string;
	key: keyof T;
}

export interface Order<T> {
	by: keyof T;
	direction: 'up' | 'down';
}

export interface Alert {
	show: boolean;
	title: string;
	message: string;
	type: 'success' | 'warning' | 'info';
}

type PatientsStore = ReturnType<typeof usePatientsStore>;
type QuestionStore = ReturnType<typeof useQuestionsStore>;
type SurveyStore = ReturnType<typeof useSurveysStore>;
type TagsStore = ReturnType<typeof useTagsStore>;

export type MyStore = PatientsStore | QuestionStore | SurveyStore | TagsStore;
