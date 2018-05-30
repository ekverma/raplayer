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
		const { transcriptStatus } = this.props;
		return (
			<div className={style.heightCalcTranscription}>
				<div className={style.transcriptionOnItsWay}>
					<div className={[style.transcription_truck, style.marginT120, style.display_IB].join(" ")} />
					<div className="F18 color66 marginT30 marginB30">Transcription is on its way!</div>
        </div>
				<div className={[style.rightContainor, transcriptStatus == "success" ? style.show : style.hide].join(" ")} >
					<div className={style.transcriptionSearch}>
						<SearchContainer
							namespace={this.props.namespace}
						/>
						<FilterContainer
							namespace={this.props.namespace}
						/>
						<div className={style.clear} />
					</div>

					<div className={[this.props.searchWords.length == 0 ? style.heightCalcComment : style.heightCalcTagAdded].join(" ")}>
						<CommentPane
							comments={this.props.searchedTranscripts}
							targetPlayerId={this.props.targetPlayerId}
							commentDivIdPrefix={TIMESTAMPED_TRANSCRIPT_DIV_ID_PREFIX}
						/>
					</div>
				</div>
				<div className={[transcriptStatus == "fetching" ? style.show : style.hide].join(" ")} >
					fetching
				</div>
				<div className={[style.rightContainor, transcriptStatus == "failed" ? style.show : style.hide].join(" ")} >
					failed
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
		transcriptStatus: state.transcriptionPane.transcriptStatus,
		searchWords: state.transcriptionPane.searchBar.searchWords
	};
}

export default namespaceConnect(mapStateToProps, actions)(TranscriptionContainer);
