import instances from "@api/players";

/**
 * @private
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
 * @private
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

