import { h, render } from "preact";
import App from "./app/index";
import { getStore } from "./app/store";
import { Provider } from "unistore/preact";
import {removePlayer,getPlayer} from "@api/api";
import "promise-polyfill/src/polyfill";
import "whatwg-fetch";

let count = 0;



class RaPlayer {
	constructor(props = {}) {
		this.props = props;
	}

	/**
	 * Creates a new player on the page and asynchronously begins setup.
	 * @returns {void}
	 */
	setup() {
		let { targetVideoContainer, showControlsOnly } = this.props;
		let namespace = "ra_" + count++;
		this.id = this.props.id = this.props.id || "an-vid-" + namespace;
		this.props.secondaryId = this.id + "-secondary";
		if(!showControlsOnly){
			this.props.popupSelector = this.id + "-popup";
		}
		let store = getStore(namespace, {
			app: this.props.app
		});

		this.root = render(
			<Provider store={store}>
				<App {...this.props} namespace={namespace} />
			</Provider>,
			document.getElementById(targetVideoContainer)
		);
	}

	/** Asynchronously removes the player from the page.
	 * @returns {Api} The Player API instance
	 */

	destroy() {
		let { targetVideoContainer } = this.props;
		let playerInstance = getPlayer(this);
		playerInstance.unbind();
		removePlayer(this);
		render("", document.getElementById(targetVideoContainer), this.root);
		return this;
	}

	pause() {
		let playerInstance = getPlayer(this);
		if (playerInstance) {
			playerInstance.pause();
		}
	}
}

export default RaPlayer;