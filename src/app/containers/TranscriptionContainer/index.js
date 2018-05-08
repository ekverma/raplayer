import { h, Component } from "preact";
import { actions } from "../../actions";
import { namespaceConnect } from "@utils/enhancer";
import SearchContainer from "@containers/SearchContainer";
import FilterContainer from "@containers/FilterContainer";
// import CommentPaneContainer from "@containers/CommentPaneContainer";
import CommentPane from "@components/CommentPane";
import style from "./index.scss";


// <CommentPane
	// comments={this.props.activeComments}
	// edit={this.props.edit}
	// popupSelector={this.props.popupSelector}
	// targetPlayerId={this.props.targetPlayerId}
	// onPaneCardClickHandler={this.onPaneCardClickHandler}
	// editComment={this.editCommentHandler}
	// onDeleteConfirm={this.hideCommentBoxHandler}
	// hideCommentCardError={this.hideCommentCardErrorHandler}
	// deleteComment={this.deleteCommentHandler}
	// noCommentDiv={this.noCommentDiv()}
// />

class TranscriptionContainer extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.props.getTimestampedTranscripts();
	}

	render() {
		return (
			<div className={style.rightContainor}>
				<FilterContainer 
					namespace={this.props.namespace}
				/>
				<SearchContainer 
					namespace={this.props.namespace}
				/>
				<CommentPane
					comments={this.props.timestampedTranscripts}
					// edit={this.props.edit}
					// popupSelector={this.props.popupSelector}
					targetPlayerId={this.props.targetPlayerId}
					// onPaneCardClickHandler={this.onPaneCardClickHandler}
					// editComment={this.editCommentHandler}
					// onDeleteConfirm={this.hideCommentBoxHandler}
					// hideCommentCardError={this.hideCommentCardErrorHandler}
					// deleteComment={this.deleteCommentHandler}
					// noCommentDiv={this.noCommentDiv()}
				/>
				
			</div>
		);
	}
}

//<CommentPaneContainer
//	namespace={this.props.namespace}
///>

function mapStateToProps(state) {
	return {
		timestampedTranscripts: state.transcriptionPane.timestampedTranscripts
	};
}

export default namespaceConnect(mapStateToProps, actions)(TranscriptionContainer);