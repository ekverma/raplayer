import { h, Component } from "preact";
import { actions } from "../../actions";
import { namespaceConnect } from "@utils/enhancer";
import  SearchContainer from "@containers/SearchContainer";
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
				<SearchContainer
				/>
				<CommentPaneContainer
					namespace={this.props.namespace}
				/>
			</div>
		);
	}
}


export default namespaceConnect(undefined, actions)(TranscriptionContainer);