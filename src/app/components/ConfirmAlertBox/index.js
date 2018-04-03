import { h, Component, render } from 'preact';
import style from './index.scss';

export default class ConfirmAlertBox extends Component {
	constructor() {
		super();
	}

	onClickConfirm = () => {
		this.props.onConfirm();
		this.close();
	};

	onClickCancel = () => {
		this.props.onCancel();
		this.close();
	};

	close = () => {
		removeElementReconfirm();
	};

	render() {
		const { title, message, confirmLabel, cancelLabel } = this.props;

		return (
			<div className={style.container}>
				<div className={style.reactConfirmAlertOverlay} />
				<div className={style.content}>
					<div className={style.reactConfirmAlert}>
							{title && <h1>{title}</h1>}
							{message && <h3>{message}</h3>}
					</div>		
					<div className={style.reactConfirmAlertButtonGroup}>
						{cancelLabel && <div className={[style.cancel,style.button].join(' ')}  onClick={this.onClickCancel}>{cancelLabel}</div>}
						{confirmLabel && <div className={[style.confirm,style.button].join(' ')} onClick={this.onClickConfirm}>{confirmLabel}</div>}
					</div>
				</div>
			</div>
		);
	}
}

let root;
const targetId = "an-confirm-alert";

function removeElementReconfirm() {
	const target = document.getElementById(targetId);
	render('', target, root);
	target.parentNode.removeChild(target);
}

function createElementReconfirm(properties) {
	const divTarget = document.createElement('div');
	divTarget.id = targetId;
	let domElem = document.body;
	if(properties.popupSelector){
		domElem = document.getElementById(properties.popupSelector);
	}
	domElem.appendChild(divTarget);
	root = render(<ConfirmAlertBox {...properties} />, divTarget);
}

export function ConfirmAlert(properties) {
	createElementReconfirm(properties);
}