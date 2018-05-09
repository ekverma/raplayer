import { h, Component } from "preact";
import closeImage from "images/close_w.svg";
import style from "./index.scss";

class SearchBar extends Component {
	constructor(props) {
		super(props);
		this.handleKeyPress = this.handleKeyPress.bind(this);
		this.addSearchWord = this.addSearchWord.bind(this);
		this.removeSearchWord = this.removeSearchWord.bind(this);
		this.state = {
			inputValue: "",
			searchWords: []
		}
	}

	handleKeyPress(event) {
		if (event.key == 'Enter') {
			this.addSearchWord(event.target.value);
		}
	}

	addSearchWord(newWord) {
		if (this.state.searchWords.includes(newWord)) {
			this.setState( {inputValue: ""} );
		}
		else {
			this.setState( {searchWords: [...this.state.searchWords, newWord], inputValue: ""} );
		}
		this.props.searchWordsChangedHandler(this.state.searchWords);
	}

	removeSearchWord(word) {
		this.setState( {searchWords: this.state.searchWords.filter(searchWord => searchWord != word)} );
		this.props.searchWordsChangedHandler(this.state.searchWords);
	}
	
	render() {
		return (
			<div className={style.searchBar}>
				<div className={style.searchIcon} />
				{this.state.searchWords.map((searchWord) => (
					<div className={style.tagItemTag}>
						<div className={style.tagItemTagname}>
							{searchWord}
						</div>
						<div className={style.icon} onClick={() => this.removeSearchWord(searchWord)}>
							<img src={closeImage} style="height:8px;" />
						</div>
						<div className={style.clear} />
					</div>
				))}

				<input type="text" name="search" value={this.state.inputValue} onKeyPress={this.handleKeyPress}
					placeholder="Search words in the transcription"  className={style.inputStyle} />
				<div className={style.clear} />
			</div>
		);
	}
}
export default SearchBar;