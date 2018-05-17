import { h, Component } from "preact";
import style from "./index.scss";
import { toHHMMSS, titleCase, parseText } from "@utils/core";
import { ConfirmAlert } from "@components/ConfirmAlertBox";
import {
	STRING_DELETE_COMMENT,
	STRING_DELETED_COMMENT_CANT_BE_RESTORED,
	STRING_DELETE,
	STRING_CANCEL,
	MAX_CHAR_LIMIT_COMMENT
} from "@config/constants";
import ResizableTextArea from "@components/ResizableTextArea";

class CommentCard extends Component {
	constructor(props) {
		super(props);
		this.showControls = false;
		this.cardClickHandler = this.cardClickHandler.bind(this);
		this.showControlsHandler = this.showControlsHandler.bind(this);
		this.hideControlsHandler = this.hideControlsHandler.bind(this);
		this.saveClickHandler = this.saveClickHandler.bind(this);
		this.deleteHandler = this.deleteHandler.bind(this);
		this.editHandler = this.editHandler.bind(this);
		this.saveHandler = this.saveHandler.bind(this);
		this.discardHandler = this.discardHandler.bind(this);
		this.discard = this.discard.bind(this);
		this.onKeyChange = this.onKeyChange.bind(this);
		this.setState({
			showControls: this.showControls,
			editComment: false,
			disableSaveButton: false
		});
	}

	cardClickHandler() {
		if (typeof this.props.onPaneCardClickHandler === "function") {
			this.props.onPaneCardClickHandler(this.props.cardObj);
		}
	}

	setEdit(flag) {
		this.setState({
			editComment: flag
		});
	}

	deleteHandler(event) {
		event.stopPropagation();
		this.props.onDeleteConfirm();
		ConfirmAlert({
			title: STRING_DELETE_COMMENT,
			popupSelector: this.props.popupSelector,
			message: STRING_DELETED_COMMENT_CANT_BE_RESTORED,
			confirmLabel: STRING_DELETE,
			cancelLabel: STRING_CANCEL,
			onConfirm: () => {
				this.props.deleteComment({ commentObj: this.props.cardObj });
			},
			onCancel: () => {}
		});
	}

	editHandler(event) {
		event.stopPropagation();
		this.props.onCommentEdit();
		this.setEdit(true);
	}

	discard() {
		this.setEdit(false);
	}

	showControlsHandler() {
		this.setState({
			showControls: true
		});
	}

	hideControlsHandler() {
		this.setState({
			showControls: false
		});
	}

	saveClickHandler(event) {
		event.stopPropagation();
		let text = this.textareaElem.getText();
		this.saveHandler(text);
	}

	saveHandler(text) {
		text = text || this.textareaElem.getText();
		text = text && text.trim();
		if (!text) {
			return;
		}
		this.setEdit(false);
		let cardObj = this.props.cardObj;
		this.hideControlsHandler();
		if (typeof this.props.editComment === "function") {
			this.props.editComment({
				commentObj: {
					...cardObj,
					text
				}
			});
		}
	}

	discardHandler(event) {
		event.stopPropagation();
		this.discard();
		this.hideControlsHandler();
	}

	onKeyChange(e) {
		let text = e.target.value;
		text = text && text.trim();
		this.setState({
			disableSaveButton: text ? false : true
		});
	}

	componentWillReceiveProps({ cardObj }) {
		this.setEdit(false);
		if (cardObj.error) {
			this.setEdit(true);
			clearTimeout(this.timer);
			if (typeof this.props.hideErrorhandler === "function") {
				this.timer = setTimeout(() => {
					this.props.hideErrorhandler(cardObj);
				}, 3000);
			}
			return;
		}
	}

	componentWillUnmount() {
		clearTimeout(this.timer);
	}

	render({ cardObj, edit, colorCode }, { editComment, showControls, disableSaveButton }) {
		let timestampReadable = toHHMMSS(cardObj.time),
			showControlsClass = showControls ? style.showControls : "",
			timeStampColor = {
				backgroundColor: colorCode
			};
		return (
			<div
				className={style.commentCard}
				onClick={this.cardClickHandler}
				onMouseOver={this.showControlsHandler}
				onMouseOut={this.hideControlsHandler}
				id={this.props.divId}
			>
				<div className={style.timestampContainer}>
					<span className={style.timestamp} style={timeStampColor}>
						{timestampReadable}
					</span>
					{!edit &&
						cardObj.author &&
						cardObj.author.name && <span className={style.author}>{titleCase(cardObj.author.name)}</span>}
					{edit &&
						!editComment && (
							<span>
								<span
									className={[style.controls, showControlsClass, style.delete].join(" ")}
									onClick={this.deleteHandler}
									title="delete"
								/>
								<span
									className={[style.controls, showControlsClass, style.edit].join(" ")}
									onClick={this.editHandler}
									title="edit"
								/>
							</span>
						)}
				</div>
				<div className={style.commentDivider} />
				{!editComment && <div className={style.text} dangerouslySetInnerHTML={{__html: parseText(cardObj.text)}} />}
				{editComment && (
					<ResizableTextArea
						ref={c => (this.textareaElem = c)}
						className={style.text}
						text={cardObj.text}
						onEnter={this.saveHandler}
						onKeyChange={this.onKeyChange}
						maxChars={MAX_CHAR_LIMIT_COMMENT}
					/>
				)}
				{cardObj.error && (
					<div className={[style.error, style.errorContainer].join(" ")}>
						Something went wrong.Please try again..
					</div>
				)}
				{editComment && (
					<div className={style.actionControls}>
						<span
							title="save"
							className={[style.save, disableSaveButton ? style.disable : ""].join(" ")}
							onClick={this.saveClickHandler}
						/>
						<span title="discard" className={style.discard} onClick={this.discardHandler} />
					</div>
				)}
			</div>
		);
	}
}

export default CommentCard;