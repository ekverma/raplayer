import { h, Component } from "preact";
import { actions } from "../../actions";
import { namespaceConnect } from "@utils/enhancer";
import SearchBar from "@components/SearchBar";
import SearchNavigationBar from "@components/SearchNavigationBar";
import style from "./index.scss";

class SearchContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			totalMatches: 0,
			currentMatch: 0,

		};
	}

	onSearchWordsChangedHandler(searchWords) {
		this.state.searchWordsInTranscription(searchWords);
	}

	render() {
		return (
			<div>
				<SearchBar
					onSearchWordsChangedHandler={this.onSearchWordsChangedHandler}
				/>
				<div className={style.clear} />
				<div style={this.props.searchWords.length == 0 && this.props.searchKeywords.length == 0 ? { display: 'none' } : null}>
					<SearchNavigationBar />
				</div>
			</div>
		);
	}
}


function mapStateToProps(state) {
	return {
		searchWords: state.searchBar.searchWords,
		searchKeywords: state.searchBar.searchKeywords,
		timestampedTranscripts: state.transcriptionPane.timestampedTranscripts
	};
}

export default namespaceConnect(mapStateToProps, actions)(SearchContainer);