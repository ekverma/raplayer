import { h, Component } from "preact";
import { actions } from "../../actions";
import { namespaceConnect } from "@utils/enhancer";
import SearchContainer from "@containers/SearchContainer";
import FilterContainer from "@containers/FilterContainer";
import CommentPane from "@components/CommentPane";
import style from "./index.scss";
import {
	TIMESTAMPED_TRANSCRIPT_DIV_ID_PREFIX
} from "@config/constants";


class TranscriptionContainer extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.props.getTranscriptionData();
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.currentMatchNumber != this.props.currentMatchNumber && nextProps.currentMatchNumber > 0) {
			let transcriptIndex = nextProps.matchedTranscriptIndices[nextProps.currentMatchNumber - 1];
			let elementId = "#" + TIMESTAMPED_TRANSCRIPT_DIV_ID_PREFIX + this.props.searchedTranscripts[transcriptIndex].id;
			let elem = this.base.querySelector(elementId);
			elem.scrollIntoViewIfNeeded();
		}
	}

	render() {
		// const { isFetching } = this.props;
		const { transcriptionApiStatus, transcriptionStatus} = this.props;
		return (
			<div>
				<div className={[style.rightContainor, transcriptionApiStatus == "SUCCESS" ? style.show : style.hide].join(" ")} >
					<div className={[transcriptionStatus == "SUCCESS" ? style.show : style.hide].join(" ")}>
						<div className={style.marginB15}>
							<SearchContainer
								namespace={this.props.namespace}
							/>
							<FilterContainer
								namespace={this.props.namespace}
							/>
							<div className={style.clear} />
						</div>
						<CommentPane
							comments={this.props.searchedTranscripts}
							targetPlayerId={this.props.targetPlayerId}
							commentDivIdPrefix={TIMESTAMPED_TRANSCRIPT_DIV_ID_PREFIX}
						/>
					</div>
					<div className={[transcriptionStatus == "NOT_ENABLED" ? style.show : style.hide].join(" ")} >
						Transcription and Keywords analysis not enabled for this Submission.
					</div>
					<div className={[transcriptionStatus == "FAILED" ? style.show : style.hide].join(" ")} >
						Transcription and Keywords analysis not available for this Submission.
					</div>
					<div className={[transcriptionStatus == "STARTED" || transcriptionStatus == "NOT_STARTED" ? style.show : style.hide].join(" ")} >
						On the way
					</div>
				</div>
				<div className={[transcriptionApiStatus == "FETCHING" ? style.show : style.hide].join(" ")} >
					Fetching
				</div>
				<div className={[style.rightContainor, transcriptionApiStatus == "FAILED" ? style.show : style.hide].join(" ")} >
					Error getting data
				</div>
			</div>
		);
	}
}


function mapStateToProps(state) {
	return {
		searchedTranscripts: state.transcriptionPane.searchedTranscripts,
		matchedTranscriptIndices: state.transcriptionPane.matchedTranscriptIndices,
		currentMatchNumber: state.transcriptionPane.searchBar.currentMatchNumber,
		transcriptionStatus: state.transcriptionPane.transcriptionStatus,
		transcriptionApiStatus: state.transcriptionPane.transcriptionApiStatus
	};
}

export default namespaceConnect(mapStateToProps, actions)(TranscriptionContainer);
