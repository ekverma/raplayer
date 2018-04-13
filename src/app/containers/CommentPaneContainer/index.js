import { h, Component } from "preact";
import CommentPane from "@components/CommentPane";
import SingleSelectDropdown from "@components/SingleSelectDropdown";
import NoCommentBox from "@components/NoCommentBox";
import { actions } from "../../actions";
import { namespaceConnect } from "@utils/enhancer";
import style from "./index.scss";
import { STRING_NO_COMMENT_ON_SUBMISSION, STRING_NO_COMMENT } from "@config/constants";
import addCommentImage from "images/empty-comment.svg";
import { track } from "@api/api";
import event from "@config/trackEvents";

class CommentPaneContainer extends Component {
	constructor(props) {
		super(props);
		this.onPaneCardClickHandler = this.onPaneCardClickHandler.bind(this);
		this.editCommentHandler = this.props.editComment.bind(this.props);
		this.deleteCommentHandler = this.props.deleteComment.bind(this.props);
		this.authorOnSelectHandler = this.authorOnSelectHandler.bind(this);
		this.hideCommentBoxHandler = this.props.hideCommentBox.bind(this.props);
		this.hideCommentCardErrorHandler = this.props.hideCommentCardError.bind(this.props);
	}

	componentDidMount() {
		let { filter } = this.props;
		this.props.getAllComments({ filter });
	}

	authorOnSelectHandler(selectOptions) {
		track(event.FILTER_CLICKED);
		this.props.filterComments({
			authorId: selectOptions && selectOptions.value
		});
	}

	getAuthors(comments) {
		let authors = [];
		let authorIds = [];
		comments.forEach(comment => {
			if (authorIds.indexOf(comment.author.id) > -1) {
				return;
			}
			authorIds.push(comment.author.id);
			authors.push({
				value: comment.author.id,
				label: comment.author.name
			});
		});
		return authors;
	}

	onPaneCardClickHandler(cardObj) {
		let videoElem;
		videoElem = document.getElementById(this.props.targetPlayerId);
		videoElem.currentTime = cardObj.time;
		videoElem = document.getElementById(this.props.secondaryTargetPlayerId);
		if(videoElem){
			videoElem.currentTime = cardObj.time;
		}
		track(event.COMMENT_VIEWED,{
			commentId: cardObj.id
		});
	}

	noCommentDiv() {
		if (this.props.edit) {
			return <NoCommentBox text={STRING_NO_COMMENT_ON_SUBMISSION} image={addCommentImage} />;
		}
		return <div>{STRING_NO_COMMENT}</div>;
	}

	render() {
		const { isFetching } = this.props;
		if (isFetching) {
			return (
				<div className={style.loadingContainer}>
					<div className={style.loader} />
				</div>
			);
		}
		if (typeof this.props.onCommentPaneRender === "function") {
			this.props.onCommentPaneRender(this.props.activeComments.length);
		}
		let authors = this.getAuthors(this.props.allComments);
		return (
			<div className={style.container}>
				{authors &&
					authors.length > 1 && (
						<div className={style.filterContainer}>
							<SingleSelectDropdown options={authors} name="All" onSelect={this.authorOnSelectHandler} />
						</div>
					)}
				<CommentPane
					comments={this.props.activeComments}
					edit={this.props.edit}
					popupSelector={this.props.popupSelector}
					targetPlayerId={this.props.targetPlayerId}
					onPaneCardClickHandler={this.onPaneCardClickHandler}
					editComment={this.editCommentHandler}
					onDeleteConfirm={this.hideCommentBoxHandler}
					hideCommentCardError={this.hideCommentCardErrorHandler}
					deleteComment={this.deleteCommentHandler}
					noCommentDiv={this.noCommentDiv()}
				/>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		activeComments: state.commentPane.activeComments,
		allComments: state.commentPane.allComments,
		isFetching: state.commentPane.isFetching
	};
}

export default namespaceConnect(mapStateToProps, actions)(CommentPaneContainer);