import { h, Component } from "preact";
import style from "./index.scss";
class SearchNavigationBar extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div className={style.searchNavBar}>
				<div className={style.resultRelatedText}>
					<div>No match found</div>
					<div>1 of 20 matches</div>
				</div>
				<div className={style.sortingSearch}>
					<div className={[style.arrow, style.up].join(" ")}></div>
					<div className={[style.arrow, style.down].join(" ")}></div>
					<div className={style.clear} />
				</div>
				<div className={style.clear} />
			</div>
		);
	}
}
export default SearchNavigationBar;