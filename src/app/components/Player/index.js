import { h, Component } from "preact";
import style from "./index.scss";
import Draggable from "@components/Draggable/index";
import Video from "@components/Video/index";
import instances from "@api/players";

class Player extends Component {
	constructor(props) {
		super(props);
		this.id = this.props.id;
		this.togglePlayPause = this.togglePlayPause.bind(this);
		this.onVideoLoadedHandler = this.onVideoLoadedHandler.bind(this);
		this.onVideoEndedHandler = this.onVideoEndedHandler.bind(this);
	}

	pause() {
		this.video.pause();
		if (this.videoInset) {
			this.videoInset.pause();
		}
	}

	play(){
		this.video.play();
		if (this.videoInset) {
			this.videoInset.play();
		}
	}

	getCurrentTime(){
		return this.video.getCurrentTime();
	}

	unbind(){
		this.video.unbind();
		if (this.videoInset) {
			this.videoInset.unbind();
		}
	}

	pauseAtTime(time){
		this.video.moveToTime(time);
		this.video.pause();
		if (this.videoInset) {
			this.videoInset.moveToTime(time);
			this.videoInset.pause();
		}
	}

	togglePlayPause() {
		this.props.onVideoPlayed();
		if (!this.video.isPaused()) {
			this.video.pause();
			if (this.videoInset) {
				this.videoInset.pause();
			}
		} else {
			this.video.play();
			if (this.videoInset) {
				this.videoInset.play();
			}
		}
	}

	moveTo(value) {
		var time = this.video.getDuration() * value;
		this.video.moveToTime(time);
		if (this.videoInset) {
			this.videoInset.moveToTime(time);
		}
	}

	seekToTime(time){
		this.video.moveToTime(time);
		if (this.videoInset) {
			this.videoInset.moveToTime(time);
		}
	}

	updateVolume(volume) {
		this.video.setVolume(volume);
	}

	onVideoLoadedHandler() {
		this.props.onVideoLoaded();
		if (this.props.hidemedia) {
			return;
		}
	}

	isPaused() {
		return this.video.isPaused();
	}

	componentDidMount() {
		instances.push(this);
	}

	onVideoEndedHandler() {
		this.props.onVideoLoaded();
		if (this.props.hidemedia) {
			return;
		}
	}

	render(
		{
			id,
			secondaryId,
			src,
			secondarySrc,
			updateMediaAttributes,
			onRenderComplete,
			hidemedia,
			currentTime
		}
	) {
		return (
			<div
				onClick={this.togglePlayPause}
				className={style.playerContainer}
			>
				<Video
					src={src}
					updateMediaAttributes={updateMediaAttributes}
					ref={e => (this.video = e)}
					currentTime={currentTime}
					id={id}
					hidemedia={hidemedia}
					disableToggle="true"
					onVideoLoaded={this.onVideoLoadedHandler}
					onVideoEnded={this.onVideoEndedHandler}
					onRenderComplete={onRenderComplete}
				/>
				{secondarySrc && (
					<Draggable>
						<div style="width:140px">
							<Video
								ref={e => (this.videoInset = e)}
								src={secondarySrc}
								currentTime={currentTime}
								id={secondaryId}
								disableToggle="true"
								mute="true"
								heightAuto="true"
							/>
						</div>
					</Draggable>
				)}
			</div>
		);
	}
}

export default Player;