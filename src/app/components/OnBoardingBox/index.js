import { h, Component } from 'preact';
import style from './index.scss';

class OnBoardingBox extends Component {
	constructor() {
		super();
		this.id = 'onboardbox-ra';
		this.closeSelf = this.closeSelf.bind(this);
	}

	closeSelf() {
		// remove node from DOM
		const target = document.getElementById(this.id);
		target.parentNode.removeChild(target);
	}

	render({ text, image }) {
		return (
			<div className={style.container} id={this.id}>
				<div className={style.downArrow} />
				<div className={style.content}>
					<img src={image} />
					<div className={style.text}>{text}</div>
					<button onClick={this.closeSelf} className={style.button}>
						Got it
					</button>
				</div>
			</div>
		);
	}
}

export default OnBoardingBox;