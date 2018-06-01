/*
* Simple enhancer utility written over unistore to support namespacing which will allow running multiple instance of same component
*/

import { connect } from "unistore/preact";
import { getStore } from "../store";

export function normalizeStateForNamespace(namespace, object, state) {
	return {
		...state,
		[namespace]: {
			...object
		}
	};
}

function namespaceStateToProps(mapStateToProps) {
	return function(state, ownProp) {
		let namespaceState = state[ownProp.namespace];
		if (typeof mapStateToProps === "function") {
			return mapStateToProps(namespaceState);
		}
		return namespaceState;
	};
}

function namespaceActions(actions) {
	let keys = Object.keys(actions());
	let wrappedActions = {};
	for (let i = 0; i < keys.length; i++) {
		let boundedAction = actions()[keys[i]]; // in case you want to access store in action, please pass store(getStore()) here
		wrappedActions[keys[i]] = function(state, payload) {
			let namespace = this.namespace;
			// in case no namespace is present, we won't dispatch action
			if (!namespace) {
				return state;
			}
			var namespaceState = state[namespace];
			let setState = function(mutatedState) {
				let namespaceState = state[namespace];
				let obj = normalizeStateForNamespace(namespace, { ...namespaceState, ...mutatedState }, state);
				getStore().setState(obj);
			};
			var updatedState = boundedAction(namespaceState, payload, setState);
			if (updatedState instanceof Promise) {
				return new Promise(function(resolve, reject) {
					updatedState.then(
						mutatedState => {
							// because this is promise, state might have been updated by that time,hence we are fetching state again
							let state = getStore().getState();
							let namespaceState = state[namespace];
							let obj = normalizeStateForNamespace(
								namespace,
								{ ...namespaceState, ...mutatedState },
								state
							);
							resolve(obj);
						},
						() => {
							reject(state);
						}
					);
				});
			}
			return normalizeStateForNamespace(namespace, { ...namespaceState, ...updatedState }, state);
		};
	}

	/*eslint-disable*/
	return store => wrappedActions;
	/*eslint-disable*/
}

export function namespaceConnect(mapStateToProps, actions) {
	let wrappedMapStateToProps = namespaceStateToProps(mapStateToProps);
	let wrappedActions = namespaceActions(actions);
	return component => {
		return connect(wrappedMapStateToProps, wrappedActions)(component);
	};
}