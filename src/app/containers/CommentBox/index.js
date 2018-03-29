import { h, Component } from "preact";
import style from "./index.scss";
import { actions } from "../../actions";
import { toHHMMSS, getColorMap, parseText } from "@utils/core";
import { namespaceConnect } from "@utils/enhancer";
import { ConfirmAlert } from "@components/ConfirmAlertBox";
import {
	STRING_DELETE_COMMENT,
	STRING_DELETED_COMMENT_CANT_BE_RESTORED,
	STRING_DELETE,
	STRING_CANCEL,
	MAX_CHAR_LIMIT_COMMENT
} from "@config/constants";

class CommentBox extends Component {
	constructor() {
		super();
		this.textAreaChangeHandler = this.textAreaChangeHandler.bind(this);
		this.editClickHandler = this.editClickHandler.bind(this);
		this.deleteClickHandler = this.deleteClickHandler.bind(this);
		this.closeSelf = this.closeSelf.bind(this);
		this.postCommentHandler = this.postCommentHandler.bind(this);
		let intialState = {
			disableSaveButton: true
		};
		this.setState(intialState);
	}

	textAreaChangeHandler(e) {
		let text = e.target.value;
		text = text && text.trim();
		this.setState({
			disableSaveButton: text ? false : true
		});
		this.props.showCommentBox({
			text: e.target.value
		});
	}

	closeSelf() {
		this.props.hideCommentBox();
	}

	editClickHandler() {
		this.props.showCommentBox({
			readOnly: false
		});
		this.setState({
			disableSaveButton: false
		});
		this.commentTextArea.addEventListener("keydown", this.autosize.bind(this));
		this.commentTextArea.focus();
	}

	componentDidMount() {
		this.autosize();
		if (!this.props.readOnly) {
			this.commentTextArea.addEventListener("keydown", this.autosize.bind(this));
			this.commentTextArea.focus();
		}
	}

	deleteClickHandler(event) {
		event.stopPropagation();
		let props = this.props;
		ConfirmAlert({
			title: STRING_DELETE_COMMENT,
			message: STRING_DELETED_COMMENT_CANT_BE_RESTORED,
			confirmLabel: STRING_DELETE,
			cancelLabel: STRING_CANCEL,
			onConfirm: () => {
				this.props.deleteComment(props);
				this.props.hideCommentBox();
			},
			onCancel: () => {}
		});
	}

	postCommentHandler() {
		if (this.state.disableSaveButton) {
			return;
		}
		let text =  this.commentTextArea.value && this.commentTextArea.value.trim();
		if(!text){
			return;
		}
		this.setState({
			disableSaveButton: true
		});
		if (this.props.id) {
			this.props.editComment({
				commentObj: {
					id: this.props.id,
					text: text,
					time: this.props.time
				},
				isCommentBox: true
			});
			return;
		}
		this.props.postComment({
			text,
			time: this.props.time
		});
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.showError) {
			clearTimeout(this.timer);
			this.setState({
				disableSaveButton: false
			});
			this.timer = setTimeout(() => {
				this.props.hideCommentBoxError();
			}, 3000);
		}
	}

	componentWillUnmount() {
		clearTimeout(this.timer);
		this.commentTextArea.removeEventListener("keydown", this.autosize);
	}

	autosize() {
		let el = this.commentTextArea;
		if (!el) {
			return;
		}
		setTimeout(function() {
			el.style.cssText = "height:auto; padding:0";
			el.style.cssText = "height:" + el.scrollHeight + "px";
		}, 0);
	}

	commentDidUpdate() {
		this.autosize();
	}

	render({ xPos, time, commentText, readOnly, downArrowXPos, edit, showError, author }, { disableSaveButton }) {
		let divStyle = {
				left: xPos
			},
			timestampReadable = toHHMMSS(time),
			downArrowStyle,
			timeStampColor;
		var opts = {};
		if (readOnly) {
			opts["readOnly"] = "readOnly";
		}
		if (downArrowXPos) {
			downArrowStyle = {
				left: downArrowXPos + "px"
			};
		}
		let colorMap = getColorMap();
		if (author && author.id && colorMap[author.id]) {
			timeStampColor = {
				backgroundColor: colorMap[author.id]
			};
		}

		return (
			<div style={divStyle} className={style.acBox}>
				<div className={style.downArrow} style={downArrowStyle} />
				<div className={style.acBoxContent}>
					<div className={style.acBoxContentInfo}>
						<span className={style.time} style={timeStampColor}>
							{timestampReadable}
						</span>
					</div>
					{edit &&
						this.props.id && disableSaveButton && (
							<div className={style.acControlTopRight}>
								<span onClick={this.editClickHandler} title="edit" className={style.edit} />
								<span onClick={this.deleteClickHandler} title="delete" className={style.delete} />
							</div>
						)}
					<textarea
						className={style.acBoxText}
						onChange={this.textAreaChangeHandler}
						onKeyUp={this.textAreaChangeHandler}
						maxlength={MAX_CHAR_LIMIT_COMMENT}
						{...opts}
						rows="1"
						ref={input => {
							this.commentTextArea = input;
						}}
						value={parseText(commentText)}
					/>
					<div className={style.acBoxControls + " " + (readOnly ? style.hide : style.show)}>
						<span title="save" className={[style.acActionButton,style.save,(disableSaveButton ? style.disable : "")].join(' ')} onClick={this.postCommentHandler} />
						<span title="discard" className={[style.acActionButton,style.cancel].join(' ')} onClick={this.closeSelf} />
					</div>
					{showError && (
						<div className={[style.error, style.floatR].join(" ")}>
							Something went wrong.Please try again..
						</div>
					)}
				</div>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		xPos: state.commentBox.data.xPos,
		time: state.commentBox.data.time,
		author: state.commentBox.data.author,
		commentText: state.commentBox.data.text,
		readOnly: state.commentBox.data.readOnly,
		id: state.commentBox.data.id,
		downArrowXPos: state.commentBox.data.downArrowXPos,
		showError: state.commentBox.error
	};
}

export default namespaceConnect(mapStateToProps, actions)(CommentBox);