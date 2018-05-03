import { h, Component } from "preact";
import style from "./index.scss";

class MultiSelectDropdown extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
		<div className={style.dropdownMenu}>
			<ul style={{maxHeight: '150px'}}>
				<li>
					<div className={style.menuItemHeading}>Evaluation parameters</div>
				</li>
				<li>
					<div className={[style.checkbox, style.checkedbox].join(" ")} />
					<div className={[style.menuItem, style.ellipsis].join(" ")}>Product Knowledge</div>
					<div className={style.clear} />
				</li>
				<li>
					<div className={style.checkbox} />
					<div className={style.menuItem}>Concise Articulation</div>
					<div className={style.clear} />
				</li>
				<li>
					<div className={style.checkbox} />
					<div className={style.menuItem}>Clear Differentiation</div>
					<div className={style.clear} />
				</li>
			</ul>
		</div>
		);
	}
}
export default MultiSelectDropdown;