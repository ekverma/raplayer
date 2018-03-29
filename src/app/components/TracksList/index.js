import { h, Component } from 'preact';
import style from './index.scss';

class TracksList extends Component {
	constructor(props) {
		super(props);
		this.onClickHandler = this.onClickHandler.bind(this);
	}

	onClickHandler(selectedIndex){
		this.props.onSelect(selectedIndex);
	}

	render({tracks,selectedTrack}) {
		return (
			<ul className={style.trackContainer}>
				{
					/* eslint-disable*/
					tracks.map((track,i) => {
						let kClass = "";
						if(selectedTrack === i) {
							kClass = style.active;
						}
						return <li className={[style.eachTrack,kClass].join(' ')} key={i} onClick={this.onClickHandler.bind(this,i)} >{track.label}</li>;
					})
				}
			</ul>
		);
	}
}

export default TracksList;