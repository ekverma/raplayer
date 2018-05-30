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
		let searchWords = [...this.state.searchWords];
		if (this.state.searchWords.indexOf(newWord) == -1) {
			searchWords = [...searchWords, newWord];
		}
		this.setState( {searchWords: searchWords, inputValue: ""} );
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
							<img src={closeImage} style={{height:'8px', verticalAlign: 'top'}} />
						</div>
						<div className={style.clear} />
					</div>
				))}

				<input type="text" name="search" value={this.state.inputValue} onKeyPress={this.handleKeyPress}
					placeholder={this.props.placeholder}  className={style.inputStyle} />
				<div className={style.clear} />
			</div>
		);
	}
}
export default SearchBar;
