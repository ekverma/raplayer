import { h, Component } from "preact";
import filterImage from "images/filter.svg";
import MultiSelectDropdown from "@components/MultiSelectDropdown";
import style from "./index.scss";

class SearchFilter extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div className={style.selectFilter}>
				<div className={style.filterIconHolder}>
					<img src={filterImage} style="height:15px;" />
				</div>
				<MultiSelectDropdown style={{width: '300px'}} />
			</div>
		);
	}
}
export default SearchFilter;