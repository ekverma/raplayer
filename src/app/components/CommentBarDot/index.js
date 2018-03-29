import { h, Component } from 'preact';
import style from './index.scss';

class CommentBarDot extends Component {
	constructor(props) {
		super(props);
	}

	render({ comments, onMouseIn, onMouseOut,targetPlayerId, colorMap}) {
		let videoElement = document.getElementById(targetPlayerId);
		if(!videoElement) {
			return null;
		}
		return (
			<div className={style.container}>
				{comments.map((comment, i) =>  {
					let position = comment.time * 100/ videoElement.duration ;
					let divStyle = {
						left: position + '%',
						background: colorMap[comment.author.id]
					};
					return (
						<div
							className={style.commentBarDot}
							style={divStyle}
							text={comment.text}
							key={i}
							onMouseOver={e => onMouseIn(e, comment)}
							onMouseOut={onMouseOut}
						/>
					);
				})}
			</div>
		);
	}
}

export default CommentBarDot;