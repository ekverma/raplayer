import { h, Component } from "preact";
import style from "./index.scss";

class MultiSelectDropdown extends Component {
	constructor(props) {
		super(props);
		this.onOptionClick = this.onOptionClick.bind(this);
		this.state = {
			selectedOptions: ["option1"],
		};
	}

	onOptionClick(option) {
		let selectedOptions = [...this.state.selectedOptions];
		let label = option.label;
		if (selectedOptions.includes(label)) {
			let index = selectedOptions.indexOf(label);
			selectedOptions.splice(index, 1)
		}
		else {
			selectedOptions = [...selectedOptions, label];
		}
		this.setState({ selectedOptions: selectedOptions });
	}

	render() {
		let props = this.props;
		let state = this.state;
		let options = props.options && Array.isArray(props.options) ? props.options : [{label: "option1"}, {label: "option2"}];
		return (
		<div className={style.dropdownMenu}>
			<ul style={{maxHeight: '150px'}}>
				<li>
					<div className={style.menuItemHeading}>Evaluation parameters</div>
				</li>
				
				{options.map(option => (
					<li onClick={() => this.onOptionClick(option)}>
						<div className={[style.checkbox, state.selectedOptions.includes(option.label) ? style.checkedbox : null].join(" ")} />
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