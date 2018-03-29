import { h, Component } from 'preact';
import style from './index.scss';

class NoCommentBox extends Component {
	constructor() {
		super();
	}

	render({ text,image }) {
		return (
			<div className={style.noCommentContainer}>
				<img src={image} />
				<div>{text}</div>
			</div>
		);
	}
}

export default NoCommentBox;