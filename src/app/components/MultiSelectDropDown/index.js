import { h, Component } from "preact";
import style from "./index.scss";

class MultiSelectDropdown extends Component {
	constructor(props) {
		super(props);
		this.onOptionClick = this.onOptionClick.bind(this);
		this.isOptionSelected = this.isOptionSelected.bind(this);
		this.state = {
			selectedOptions: [],
		};
	}

	onOptionClick(option) {
		let selectedOptions = [...this.state.selectedOptions];

		if (this.isOptionSelected(option)) {
			selectedOptions = selectedOptions.filter(selectedOption => selectedOption.value != option.value);
		}
		else {
			selectedOptions = [...selectedOptions, option];
		}

		this.setState({ selectedOptions: selectedOptions });
		this.props.onOptionsChangedHandler({ selectedOptions: this.state.selectedOptions });
	}

	isOptionSelected(option) {
		return this.state.selectedOptions.some(selectedOption => option.value === selectedOption.value);
	}

	render() {
		let options = this.props.options && Array.isArray(this.props.options) ? this.props.options : [];
		return (
		<div className={style.dropdownMenu}>
			<ul style={{maxHeight: '150px'}}>
				<li>
					<div className={style.menuItemHeading}>Evaluation parameters</div>
				</li>
				
				{options.map(option => (
					<li onClick={() => this.onOptionClick(option)}>
						<div className={[style.checkbox, this.isOptionSelected(option) ? style.checkedbox : null].join(" ")} />
						<div className={[style.menuItem, style.ellipsis].join(" ")}>{option.label}</div>
						<div className={style.clear} />
					</li>
				))}
			</ul>
		</div>
		);
	}
}
export default MultiSelectDropdown;

