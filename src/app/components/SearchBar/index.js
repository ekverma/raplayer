import { h, Component } from "preact";
import closeImage from "images/close_w.svg";
import style from "./index.scss";

class SearchBar extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
		<div className={style.searchBar}>
			<div className={style.searchIcon}></div>
			<div className={style.tagItemTag}>
				<div className={style.tagItemTagname}>
				Magna
				</div>
				<div className={style.icon}>
					<img src={closeImage} style="height:8px;" />
				</div>
				<div className={style.clear} />
			</div>
			<div className={style.tagItemTag}>
				<div className={style.tagItemTagname}>
				Magna big text
				</div>
				<div className={style.icon}>
					<img src={closeImage} style="height:8px;" />
				</div>
				<div className={style.clear} />
			</div>
			<div className={style.tagItemTag}>
				<div className={style.tagItemTagname}>
				Magna
				</div>
				<div className={style.icon}>
					<img src={closeImage} style="height:8px;" />
				</div>
				<div className={style.clear} />
			</div>
			<input type="text" name="search" value="" maxlength="9999999" 
				placeholder="Search words in the transcription"  className={style.inputStyle} />
			<div className={style.clear} />
		</div>
		);
	}
}
export default SearchBar;