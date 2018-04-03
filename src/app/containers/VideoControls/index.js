import { h, Component } from "preact";
import style from "./index.scss";
import { actions } from "../../actions";
import { runPrefixMethod, getPrefixes, toHHMMSS, getElementOffset, getColorMap, isIE } from "@utils/core";
import { namespaceConnect } from "@utils/enhancer";
import CommentBox from "../CommentBox";
import CommentHelperBox from "../CommentHelperBox";
import TimeBar from "@components/TimeBar";
import VolumeBar from "@components/VolumeBar";
import CommentBarDot from "@components/CommentBarDot";
import TracksList from "@components/TracksList";

let defaultControlOptions = {
	download: true,
	fullScreen: true
};

class VideoControls extends Component {
	constructor(props) {
		super(props);
		this.showCommentHelperBox = this.showCommentHelperBox.bind(this);
		this.togglePlayPause = this.togglePlayPause.bind(this);
		this.toggleFullscreen = this.toggleFullscreen.bind(this);
		this.onMouseOutHandler = this.onMouseOutHandler.bind(this);
		this.commentBarDotOnMouseInHandler = this.commentBarDotOnMouseInHandler.bind(this);
		this.commentBarDotOnMouseOutHandler = this.commentBarDotOnMouseOutHandler.bind(this);
		this.showTrackListHandler = this.showTrackListHandler.bind(this);
		this.hideTrackListHandler = this.hideTrackListHandler.bind(this);
		this.showTrackList;
		this.setState({
			showTrackList: false
		});
	}

	showTrackListHandler() {
		this.setState({
			showTrackList: true
		});
	}

	hideTrackListHandler() {
		this.setState({
			showTrackList: false
		});
	}

	togglePlayPause() {
		this.props.onVideoPlayed();
		if (!this.video.paused) {
			this.props.updateMediaAttributes({
				state: "PAUSE"
			});
			this.video.pause();
		} else {
			this.props.updateMediaAttributes({
				state: "PLAY"
			});
			this.video.play();
		}
	}

	exitHandler() {
		const pfx = getPrefixes();
		let that = this;
		let parent = this.container.parentNode.parentNode;
		pfx.forEach(function(prefix) {
			parent.removeEventListener(prefix + "fullscreenchange", that.exitHandler.bind(that));
		});
	}

	toggleFullscreen() {
		this.props.hideCommentBox();
		const pfx = getPrefixes();
		let parent = this.container.parentNode.parentNode; // Hackish i know, will modfiy very soon
		var that = this;
		if (runPrefixMethod(document, "FullScreen") || runPrefixMethod(document, "IsFullScreen")) {
			runPrefixMethod(document, "CancelFullScreen");
			this.props.updateMediaAttributes({ fullScreen: false });
			that.exitHandler();
		} else {
			this.props.updateMediaAttributes({ fullScreen: true });
			runPrefixMethod(parent, "RequestFullScreen") || runPrefixMethod(parent, "RequestFullscreen");
			setTimeout(function() {
				pfx.forEach(function(prefix) {
					parent.addEventListener(prefix + "fullscreenchange", that.exitHandler.bind(that), false);
				});
			}, 700);
		}
	}

	isCommentBarDotWithin(time) {
		var isWithin = false;
		this.props.comments.forEach(comment => {
			if (parseInt(comment.time) === parseInt(time)) {
				isWithin = true;
			}
		});
		return isWithin;
	}

	showCommentHelperBox(e) {
		/*
			200px: width of helper box
			8px: default left for down arrow
			10px: padding left and right of video controls
		*/
		if (this.props.isCommentBoxActive) {
			return;
		}
		let video = this.video;
		let targetOffset = getElementOffset(e.target);
		let xPos = e.pageX - targetOffset.left;
		let percentage = 100 * xPos / e.target.clientWidth;
		if (percentage > 100) {
			percentage = 100;
		}
		if (percentage < 0) {
			percentage = 0;
		}
		if (xPos < 0) {
			xPos = 0;
		}

		let time = percentage / 100 * video.duration,
			availableWindowForCommentHelperBox = xPos + 200,
			upperXLimit = e.target.clientWidth,
			downArrowXPos;
		downArrowXPos = 8;

		if (this.isCommentBarDotWithin(time)) {
			return;
		}
		xPos -= 10;
		if (availableWindowForCommentHelperBox > upperXLimit) {
			xPos = e.target.clientWidth - 200;
			downArrowXPos = availableWindowForCommentHelperBox - upperXLimit;
		}

		downArrowXPos = downArrowXPos < 8 ? 8 : downArrowXPos;
		downArrowXPos = downArrowXPos > 183 ? 183 : downArrowXPos;

		this.props.showCommentHelperBox({
			xPos,
			time,
			downArrowXPos
		});
		this.props.hideCommentBox();
	}

	commentBarDotOnMouseInHandler(e, comment) {
		if (this.props.isCommentBoxActive) {
			return;
		}

		let style = window.getComputedStyle(e.target, null);
		let xPos = parseInt(style.getPropertyValue("left"));
		let targetElement = e.target.parentElement;
		let clientWidth = targetElement.clientWidth;

		let availableWindowForCommentHelperBox = xPos + 300,
			upperXLimit = clientWidth,
			downArrowXPos,
			_xPos = xPos;
		downArrowXPos = 8;

		_xPos -= 16;
		if (availableWindowForCommentHelperBox > upperXLimit) {
			_xPos = clientWidth - 300;
			downArrowXPos = xPos - _xPos - 8;
		}

		downArrowXPos = downArrowXPos < 8 ? 8 : downArrowXPos;
		downArrowXPos = downArrowXPos > 274 ? 274 : downArrowXPos;

		this.props.hideCommentHelperBox();
		this.props.showCommentBox({
			xPos: _xPos,
			...comment,
			readOnly: true,
			downArrowXPos: downArrowXPos
		});
	}

	commentBarDotOnMouseOutHandler(event) {
		if (this.props.isCommentBoxActive) {
			return;
		}
		var e = event.toElement || event.relatedTarget;
		if (this.container.contains(e)) {
			return;
		}
		this.props.hideCommentBox();
	}

	onMouseOutHandler(event) {
		if (this.props.isCommentBoxActive) {
			return;
		}
		var e = event.toElement || event.relatedTarget;
		if (this.container.contains(e)) {
			return;
		}
		this.props.hideCommentHelperBox();
		this.props.hideCommentBox();
	}

	render = (
		{
			targetPlayerId,
			currentTime,
			commentBox,
			commentHelperBox,
			comments,
			mediaState,
			edit,
			volume = 0.5,
			videoTracks,
			onSelectTrack,
			selectedTrack,
			onSeekHandler,
			volumeUpdateHandler,
			namespace,
			videoPauseAtTimeHandler,
			controlOptions = {},
			downloadSrc,
			popupSelector
		},
		{ showTrackList }
	) => {
		this.video = document.getElementById(targetPlayerId);
		controlOptions = { ...defaultControlOptions, ...controlOptions };
		let currentTimeString = "00:00",
			seekTime = 0;
		if (this.video) {
			currentTimeString =
				!currentTime || currentTime === 0
					? "00:00"
					: toHHMMSS(currentTime) + " / " + toHHMMSS(this.video.duration);
			seekTime = currentTime / this.video.duration * 100;
		}
		seekTime = seekTime ? seekTime - 0.01 : 0;
		let mediaPlayPauseKlass;
		switch (mediaState) {
			case "PLAY":
				mediaPlayPauseKlass = style.pause;
				break;
			case "PAUSE":
				mediaPlayPauseKlass = style.play;
				break;
		}

		let authors = comments.map(comment => comment.author.id);
		let colorMap = getColorMap(authors);

		let videoControlsStyle = {
			height: isIE() ? "60px" : "55px"
		};

		return (
			<div
				className={[style.videoControls].join(" ")}
				onMouseOut={this.onMouseOutHandler}
				ref={e => (this.container = e)}
				style={videoControlsStyle}
			>
				<TimeBar onMouseMove={this.showCommentHelperBox} seekTime={seekTime} onSeekHandler={onSeekHandler} />

				<div className={style.controlsButtonContainer}>
					<div className={style.playPauseButton}>
						<button
							style="border:none"
							type="button"
							className={[style.floatL, mediaPlayPauseKlass].join(" ")}
							onClick={this.togglePlayPause}
						/>
					</div>

					<VolumeBar volumeUpdateHandler={volumeUpdateHandler} volume={volume} />
					<div
						className={[style.floatL, style.color99, style.F12, style.lineHeight20].join(" ")}
						style="width:120px;margin-top: 1px;"
					>
						{currentTimeString}
					</div>
					<div className={style.floatR}>
						{videoTracks &&
							videoTracks.length > 1 && (
								<div
									className={style.controlButton}
									onMouseEnter={this.showTrackListHandler}
									onMouseLeave={this.hideTrackListHandler}
								>
									<button style="border:none" type="button" className={style.hd} />
									{showTrackList && (
										<TracksList
											tracks={videoTracks}
											onSelect={onSelectTrack}
											selectedTrack={selectedTrack}
										/>
									)}
								</div>
							)}
						{controlOptions.download &&
							downloadSrc && (
								<div className={style.controlButton}>
									<a
										target="_blank"
										style="border:none"
										type="button"
										href={downloadSrc}
										download={downloadSrc}
										className={style.download}
									/>
								</div>
							)}
						{controlOptions.fullScreen && (
							<div className={style.controlButton}>
								<button
									style="border:none"
									type="button"
									className={style.fullScreen}
									onClick={this.toggleFullscreen}
								/>
							</div>
						)}
					</div>
					<div className={style.clear} />
				</div>
				{commentBox.show ? (
					<CommentBox edit={edit} namespace={namespace} popupSelector={popupSelector} />
				) : null}
				{commentHelperBox.show && edit ? (
					<CommentHelperBox
						targetPlayerId={targetPlayerId}
						namespace={namespace}
						onClickHandler={videoPauseAtTimeHandler}
					/>
				) : null}

				<CommentBarDot
					comments={comments}
					onMouseIn={this.commentBarDotOnMouseInHandler}
					onMouseOut={this.commentBarDotOnMouseOutHandler}
					targetPlayerId={targetPlayerId}
					colorMap={colorMap}
				/>
			</div>
		);
	};
}

function mapStateToProps(state) {
	return {
		...state,
		currentTime: state.media.currentTime,
		comments: state.commentPane.activeComments,
		mediaState: state.media.state,
		isCommentBoxActive: state.commentBox.show && !state.commentBox.data.readOnly
	};
}

export default namespaceConnect(mapStateToProps, actions)(VideoControls);