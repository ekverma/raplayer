import { h, Component } from "preact";
import { actions } from "../../actions";
import { namespaceConnect } from "@utils/enhancer";
import SearchContainer from "@containers/SearchContainer";
import FilterContainer from "@containers/FilterContainer";
import CommentPaneContainer from "@containers/CommentPaneContainer";
import style from "./index.scss";

class TranscriptionContainer extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
	}


	render() {
		return (
			<div className={style.rightContainor}>
				<FilterContainer />
				<SearchContainer />
				<CommentPaneContainer
					namespace={this.props.namespace}
				/>
			</div>
		);
	}
}


export default namespaceConnect(undefined, actions)(TranscriptionContainer);