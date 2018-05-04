import createStore from 'unistore';
import devtools from 'unistore/devtools';
import { deepmerge } from '@utils/core';

const initialState = {
	app: {
	},
	commentHelperBox: {
		show: false,
		data: {}
	},
	commentBox: {
		show: false,
		data: {
			text: ''
		}
	},
	media: {
		currentTime: 0,
		state: 'PAUSE'
	},
	commentPane: {
		allComments: [],
		activeComments: []
	},
	searchBar: {
		searchWords: [],
		searchKeywords: []
	},
	transcriptionPane: {
		timestampedTranscripts: []
	}
};

const state = {};
let store;

export function getStore(namespace, initialProps = {}) {
	if (!namespace && store) {
		return store;
	}
	if (namespace) {
		state[namespace] = state[namespace] || deepmerge(initialState, initialProps);
	}
	store = process.env.ENV === 'prod' ? createStore(state) : devtools(createStore(state));
	return store;
}