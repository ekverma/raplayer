import { h, Component } from "preact";
import { actions } from "../../actions";
import { namespaceConnect } from "@utils/enhancer";
import style from "./index.scss";
import filterImage from "images/filter.svg";
import MultiSelectDropdown from "@components/MultiSelectDropdown";

class FilterContainer extends Component {
	constructor(props) {
		super(props);
		this.onOptionsChangedHandler = this.onOptionsChangedHandler.bind(this);
		this.getOptionsFromEvalParams = this.getOptionsFromEvalParams.bind(this);
		this.state = {
			showFilters: false,
		};
	}

	onOptionsChangedHandler(selectedOptions) {
		// this.props.updateSearchKeywordsFromParams({ selectedEvalParams: selectedOptions });
		window.console.log(String(selectedOptions));
	}

	getOptionsFromEvalParams(evalParams) {
		let options = evalParams.map((evalParam) => { 
			return { label: evalParam.name, value: evalParam.evalParamId } 
		});
		return options;
	}

	render() {
		let dropdownOptions = this.getOptionsFromEvalParams(this.props.evalParams);
		return (
			<div className={style.selectFilter}>
				<div className={style.filterIconHolder}>
					<img src={filterImage} style="height:15px;" />
				</div>
				<MultiSelectDropdown
					style={{ ...!this.state.showFilters ? { display: 'none' } : null, width: '300px' }}
					options={dropdownOptions}
					onOptionsChangedHandler={this.onOptionsChangedHandler}
				/>
			</div>
		);
	}
}


function mapStateToProps(state) {
	return {
		evalParams: state.app.evaluationParameters
	};
}

export default namespaceConnect(mapStateToProps, actions)(FilterContainer);