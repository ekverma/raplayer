import { h, Component } from 'preact';
import style from './index.scss';
import { actions } from '../../actions';
import { toHHMMSS } from '@utils/core';
import { namespaceConnect} from '@utils/enhancer';
import EmojiPicker from '@components/EmojiPicker';

class CommentHelperBox extends Component {
	constructor() {
		super();
		this.commentHelperBoxClickHandler = this.commentHelperBoxClickHandler.bind(this);
		this.emojiOnSelectHandler = this.emojiOnSelectHandler.bind(this);
	}

	commentHelperBoxClickHandler() {
		/*
			300px: width of comment box
			8px: default left for down arrow
		*/

		let video = document.getElementById(this.props.targetPlayerId).parentNode;
		let { xPos,time, downArrowXPos } = this.props;
		let clientWidth = video.clientWidth - 20 ;
		let _xPos = xPos;
		let availableWindow = _xPos + 300 ,
			upperXLimit = clientWidth ,
			_downArrowXPos = 8;

        _xPos -= 4;
		if (availableWindow > upperXLimit) {
			_xPos = clientWidth - 300;
			_downArrowXPos =  xPos + downArrowXPos - _xPos - 6;
		}

		_downArrowXPos = _downArrowXPos < 8 ? 8 : _downArrowXPos;
		_downArrowXPos = _downArrowXPos > 274 ? 274 : _downArrowXPos;

		this.props.hideCommentBox();
		this.props.showCommentBox({
			xPos: _xPos,
			time: time,
			downArrowXPos: _downArrowXPos
		});
		this.props.hideCommentHelperBox();
		if(typeof this.props.onClickHandler === "function") {
			this.props.onClickHandler(time);
		}
		
	}

	emojiOnSelectHandler(selectedEmoji) {
		this.props.postComment({
			time: this.props.time,
			text: selectedEmoji
		});
	}

	render({ xPos, time, downArrowXPos ,fullScreen}) {
		let divStyle = {
				left: xPos
			},
			timestampReadable = time ? toHHMMSS(time) : "00:00",
			downArrowStyle;
		if (downArrowXPos) {
			downArrowStyle = {
				left: downArrowXPos + 'px'
			};
		}
		if(fullScreen){
			divStyle.position = 'fixed !important';
		}
		return (
			<div style={divStyle} className={style.chBox}>
				<div className={style.downArrow} style={downArrowStyle} />
				<div className={style.chBoxContent}>
					<div className={style.chBoxContentInfo} onClick={this.commentHelperBoxClickHandler}>
						<span className={style.plusIcon}>+</span> Add Comments @{timestampReadable}
					</div>
					<div className={style.chBoxControls}>
						<EmojiPicker onSelect={this.emojiOnSelectHandler} />
					</div>
					<div className={style.clear} />
				</div>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		fullScreen: state.media.fullScreen,
		xPos: state.commentHelperBox.data.xPos,
		time: state.commentHelperBox.data.time,
		downArrowXPos: state.commentHelperBox.data.downArrowXPos
	};
}

export default namespaceConnect(mapStateToProps, actions)(CommentHelperBox);