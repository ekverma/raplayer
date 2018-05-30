import { h, Component } from "preact";
import style from "./index.scss";
import CommentCard from "../CommentCard";
import { getColorMap } from "@utils/core";
import {
	DEFAULT_COMMENT_DIV_ID_PREFIX
} from "@config/constants";

class CommentPane extends Component {
	constructor() {
		super();
		this.closeAnyActiveEdit = this.closeAnyActiveEdit.bind(this);
		this.commentPaneComponents = {};
	}

	closeAnyActiveEdit = () => {
		let ret = {};
		Object.keys(this.commentPaneComponents)
			.filter(key => this.commentPaneComponents[key])
			.forEach(key => (ret[key] = this.commentPaneComponents[key]));
		this.commentPaneComponents = ret;
		for (var key in this.commentPaneComponents) {
			this.commentPaneComponents[key].discard();
		}
	};

	render() {
		const {
			comments,
			edit,
			targetPlayerId,
			editComment,
			deleteComment,
			onPaneCardClickHandler,
			noCommentDiv,
			onDeleteConfirm,
			hideCommentCardError,
			popupSelector
		} = this.props;
		if (!comments || !comments.length) {
			return <div className={style.commentPane}>{noCommentDiv}</div>;
		} else {
			let authors = comments.map(comment => comment.author.id);
			let colorMap = getColorMap(authors);
			return (
				<div className={style.commentPane}>
					{comments.map((comment, i) => (
						<CommentCard
							cardObj={comment}
							key={i}
							ref={c => (this.commentPaneComponents[i] = c)}
							edit={edit}
							popupSelector={popupSelector}
							targetPlayerId={targetPlayerId}
							editComment={editComment}
							deleteComment={deleteComment}
							onDeleteConfirm={onDeleteConfirm}
							onPaneCardClickHandler={onPaneCardClickHandler}
							hideErrorhandler={hideCommentCardError}
							colorCode={colorMap[comment.author.id]}
							onCommentEdit={this.closeAnyActiveEdit}
							divId={(this.props.commentDivIdPrefix || DEFAULT_COMMENT_DIV_ID_PREFIX) + comment.id}
						/>
					))}
				</div>
			);
		}
	}
}

export default CommentPane;
