import instances from "@api/players";
import { capitalizeKeys } from "@utils/core";

let trackService = {
	track: (event, payload) => {
		/* eslint-disable */
		console.log(event, payload);
	}
};

let trackPayload = {};

/**
 * @public
 * Removes the Api instance from the list of active players.
 * The instance will no longer be queryable
 * @param {Api} api - The Player API to remove
 * @returns {void}
 */

export function removePlayer(api) {
	for (let i = instances.length; i--; ) {
		if (instances[i].id === api.id) {
			instances.splice(i, 1);
			break;
		}
	}
}

/**
 * @public
 * Return the Api instance from the list of active players.
 * @param {Api} api - The Player API to remove
 * @returns {player instance}
 */

export function getPlayer(api) {
	for (let p = 0; p < instances.length; p++) {
		if (instances[p].id === api.id) {
			return instances[p];
		}
	}
	return null;
}

/**
 * @public
 * set tracking service for this app
 */

export function setTrackingService(_trackService, _trackPayload) {
	if (_trackService && typeof _trackService.track === "function") {
		trackService = _trackService;
	}
	if(_trackPayload){
		trackPayload = _trackPayload;
	}
}

/**
 * @public
 * Fire track event for app
 */

export function track(eventName, payload) {
	payload = {
		...trackPayload,
		...payload
	};
	payload = capitalizeKeys(payload);
	trackService.track(eventName, payload);
}