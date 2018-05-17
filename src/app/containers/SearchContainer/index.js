import { h, Component } from "preact";
import { actions } from "../../actions";
import { namespaceConnect } from "@utils/enhancer";
import transcriptionModel from "@models/transcriptionModel";
import SearchBar from "@components/SearchBar";
import SearchNavigationBar from "@components/SearchNavigationBar";
import style from "./index.scss";
import {
	STRING_TRANSCRIPTION_SEARCHBAR_PLACEHOLDER
} from "@config/constants";

class SearchContainer extends Component {
	constructor(props) {
		super(props);
		this.searchWordsChangedHandler = this.searchWordsChangedHandler.bind(this);
		this.navigateToMatchHandler = this.navigateToMatchHandler.bind(this);
	}

	searchWordsChangedHandler(searchWords) {
		this.props.updateTranscriptionSearchWords({ searchWords });
	}

	navigateToMatchHandler(currentMatchNumber) {
		this.props.navigateToMatchNum({ currentMatchNumber });
	}

	render() {
		return (
			<div>
				<SearchBar
					placeholder={STRING_TRANSCRIPTION_SEARCHBAR_PLACEHOLDER}
					searchWordsChangedHandler={this.searchWordsChangedHandler}
				/>
				<div className={style.clear} />
				<div className={[this.props.searchWords.length == 0 && transcriptionModel.getKeywordsInParams(this.props.selectedEvalParams).length == 0 ? style.hide : null].join(" ")}>
					<SearchNavigationBar
						currentMatchNumber={this.props.currentMatchNumber}
						numberOfMatches={this.props.numberOfMatches}
						navigateToMatchHandler={this.navigateToMatchHandler}
					/>
				</div>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		searchWords: state.transcriptionPane.searchBar.searchWords,
		numberOfMatches: state.transcriptionPane.searchBar.numberOfMatches,
		currentMatchNumber: state.transcriptionPane.searchBar.currentMatchNumber,
		selectedEvalParams: state.transcriptionPane.filter.selectedEvalParams
	};
}

export default namespaceConnect(mapStateToProps, actions)(SearchContainer);