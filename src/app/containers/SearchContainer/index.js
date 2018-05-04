import { h, Component } from "preact";
import { actions } from "../../actions";
import { namespaceConnect } from "@utils/enhancer";
import SearchBar from "@components/SearchBar";
import SearchNavigationBar from "@components/SearchNavigationBar";
import style from "./index.scss";

class SearchContainer extends Component {
	constructor(props) {
		super(props);
	}
	componentDidMount() {
	}
	render() {
		return (
			<div>
				<SearchBar />
                <div className={style.clear} />
                <SearchNavigationBar />
			</div>
		);
	}
}
export default namespaceConnect(undefined, actions)(SearchContainer);