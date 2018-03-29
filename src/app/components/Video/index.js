import { h, Component } from "preact";
import style from "./index.scss";

var ontimeUpdateHandler = function() {
	if (!this.video) {
		return;
	}
	if (typeof this.props.updateMediaAttributes !== "function") {
		return;
	}
	this.props.updateMediaAttributes({
		currentTime: this.video.currentTime
	});
};

var onloadstartHandler = function() {
	if (!this.video) {
		return;
	}
	this.showLoading();
};

var onendedHandler = function() {
	if (!this.video) {
		return;
	}
	this.video.currentTime = 0;
	this.video.pause();
	if (typeof this.props.onVideoEnded === "function") {
		this.props.onVideoEnded();
	}
	if (typeof this.props.updateMediaAttributes !== "function") {
		return;
	}

	this.props.updateMediaAttributes({
		state: "PAUSE",
		currentTime: 0
	});
};

var canplayHandler = function() {
	if (!this.video) {
		return;
	}
	this.hideLoading();
	if (typeof this.props.updateMediaAttributes !== "function") {
		return;
	}
	this.props.updateMediaAttributes({
		currentTime: this.video.currentTime
	});
};

var onloadeddataHandler = function() {
	if (!this.video) {
		return;
	}
	this.hideLoading();
	if (typeof this.props.onVideoLoaded === "function") {
		this.props.onVideoLoaded();
	}
};

class Video extends Component {
	constructor(props) {
		super(props);
		this.togglePlayPause = this.togglePlayPause.bind(this);
		this.showLoading = this.showLoading.bind(this);
		this.hideLoading = this.hideLoading.bind(this);
		this.play = this.play.bind(this);
		this.pause = this.pause.bind(this);
		this.showLoading();
	}

	togglePlayPause() {
		if (this.props.disableToggle) {
			return;
		}
		if (!this.video.paused) {
			this.video.pause();
			this.props.updateMediaAttributes({
				state: "PAUSE"
			});
		} else {
			this.video.play();
			this.props.updateMediaAttributes({
				currentTime: this.video.currentTime,
				state: "PLAY"
			});
		}
	}

	isPaused() {
		return this.video.paused;
	}

	moveToTime(time) {
		this.video.currentTime = time;
	}

	getDuration() {
		return this.video.duration;
	}

	getCurrentTime() {
		return this.video.currentTime;
	}

	setVolume(volume) {
		this.video.volume = volume;
	}

	getVolume() {
		return this.video.volume;
	}

	play() {
		this.video.play();
		if (typeof this.props.updateMediaAttributes === "function") {
			this.props.updateMediaAttributes({
				state: "PLAY"
			});
		}
	}

	pause() {
		this.video.pause();
		if (typeof this.props.updateMediaAttributes === "function") {
			this.props.updateMediaAttributes({
				state: "PAUSE"
			});
		}
	}

	unbind() {
		this.video.removeEventListener("timeupdate", ontimeUpdateHandler.bind(this));
		this.video.removeEventListener("loadstart", onloadstartHandler.bind(this));
		this.video.removeEventListener("ended", onendedHandler.bind(this));
		this.video.removeEventListener("canplay", canplayHandler.bind(this));
		this.video.removeEventListener("loadeddata", onloadeddataHandler.bind(this));
	}

	attachEvents() {
		this.video.addEventListener("timeupdate", ontimeUpdateHandler.bind(this));
		this.video.addEventListener("loadstart", onloadstartHandler.bind(this));
		this.video.addEventListener("ended", onendedHandler.bind(this));
		this.video.addEventListener("loadeddata", onloadeddataHandler.bind(this));
		this.video.addEventListener("canplay", canplayHandler.bind(this));
	}

	showLoading() {
		this.setState({
			loading: true
		});
	}

	hideLoading() {
		this.setState({
			loading: false
		});
	}

	componentDidMount() {
		this.attachEvents();
		this.video.volume = 0.5;
		if (this.props.mute) {
			this.video.volume = 0;
		}
		if (typeof this.props.onRenderComplete === "function") {
			this.props.onRenderComplete();
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.currentTime !== this.props.currentTime) return true;
		if (nextProps.src !== this.props.src) return true;
		if (nextState.loading !== this.state.loading) return true;
		else return false;
	}


	render({ id, src, hidemedia, heightAuto }, { loading }) {
		let kClass;
		if (hidemedia) {
			kClass = style.hide;
		}
		return (
			<div style="width:100%;height:100%">
				{loading && <div className={style.loading} />}
				<video
					id={id}
					ref={e => (this.video = e)}
					seek="1"
					style={heightAuto ? "height:auto" : null}
					className={[style.media, kClass].join(" ")}
					control="false"
					preload="auto"
					src={src}
					onWaiting={this.showLoading}
					onPlaying={this.hideLoading}
					onClick={this.togglePlayPause}
				/>
			</div>
		);
	}
}

export default Video;