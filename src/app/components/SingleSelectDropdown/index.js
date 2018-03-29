import { h, Component } from 'preact';
import style from './index.scss';

class SingleSelectDropdown extends Component {
	constructor(props) {
		super(props);
		this.onDropdownClick = this.onDropdownClick.bind(this);
		this.collapse = this.collapse.bind(this);
		this.onOptionClick = this.onOptionClick.bind(this);
		this.removeOption = this.removeOption.bind(this);
		this.state = {
			selectedOption: null,
			isOptionsVisible: false
		};
	}

	removeOption(event){
		event.stopPropagation();
		this.setState({
			selectedOption: null,
			isOptionsVisible: false
		});
		this.props.onSelect ? this.props.onSelect({}) : null;
	}

	onDropdownClick() {
		this.setState({ isOptionsVisible: !this.state.isOptionsVisible });
	}

	onOptionClick(option) {
		this.setState({ selectedOption: option.label });
		this.props.onSelect ? this.props.onSelect(option) : null;
		this.collapse();
	}

	collapse() {
		this.setState({ isOptionsVisible: false });
	}

	render() {
		let props = this.props;
		let state = this.state;
		let width = props.width + 'px';
		let options = props.options && Array.isArray(props.options) ? props.options : [];

		return (
			<div className={style.dropDownmenu} style={{ width: width }} tabIndex={0} onBlur={this.collapse}>
				<div className={style.selectedOptionContainer} onClick={this.onDropdownClick}>
					<div className={[style.selectedOption, state.isOptionsVisible ? style.focus : null].join(' ')}>
						{!state.selectedOption ? props.name : state.selectedOption}
					</div>
					{!state.selectedOption && (
						<span className={style.arrow}>
							<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 8 14">
								<path
									fill="none"
									fill-rule="evenodd"
									stroke="#999"
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="1.714"
									d="M1 1l6 5.714L1 13"
								/>
							</svg>
						</span>
					)}
					{state.selectedOption && (
						<span className={style.arrow} onClick={this.removeOption}>
							<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 14 14">
								<path
									fill="#999"
									fill-rule="evenodd"
									d="M6.657 5.243L1.707.293A1 1 0 0 0 .293 1.707l4.95 4.95-4.95 4.95a1 1 0 0 0 1.414 1.414l4.95-4.95 4.95 4.95a1 1 0 1 0 1.414-1.414l-4.95-4.95 4.95-4.95A1 1 0 1 0 11.607.293l-4.95 4.95z"
								/>
							</svg>
						</span>
					)}
				</div>
				<ul className={style.optionsContainer} style={!state.isOptionsVisible ? { display: 'none' } : null}>
					{options.map((option, index) => {
						return (
							<li key={index} onClick={() => this.onOptionClick(option)}>
								{option.label}
							</li>
						);
					})}
				</ul>
			</div>
		);
	}
}

export default SingleSelectDropdown;