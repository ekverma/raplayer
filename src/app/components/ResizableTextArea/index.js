import { h, Component } from "preact";
import style from "./index.scss";
import EmojiPicker from "@components/EmojiPicker";
import { parseText, insertAtCursor } from "@utils/core";

class ResizableTextarea extends Component {
	constructor(props) {
		super(props);
		this.onEnterPress = this.onEnterPress.bind(this);
		this.emojiOnSelectHandler = this.emojiOnSelectHandler.bind(this);
	}

	onEnterPress = e => {
		if (e.keyCode == 13 && e.shiftKey == false && typeof this.props.onEnter === "function") {
			e.preventDefault();
			this.props.onEnter(e.target.value);
		}
	};

	getText() {
		return this.el.value;
	}

	// collapse = () => {
	// 	if (typeof this.props.onEnter === "function") {
	// 		this.props.onEnter(this.el.value);
	// 	}
	// }

	emojiOnSelectHandler(selectedEmoji) {
		let { maxChars } = this.props;
		if (this.el.value.length < maxChars) {
			insertAtCursor(this.el,selectedEmoji);
		}
	}

	componentDidMount() {
		this.el.addEventListener("keydown", this.autosize);
		if(typeof this.props.onKeyChange === "function"){
			this.el.addEventListener("keydown", this.props.onKeyChange);
		}
		this.el.addEventListener("paste", this.autosize);
		this.autosize.call(this.el);
		this.el.focus();
		this.el.value = parseText(this.props.text);
	}

	componentWillUnmount() {
		this.el.removeEventListener("keydown", this.autosize);
		if(typeof this.props.onKeyChange === "function"){
            this.el.removeEventListener("keydown", this.props.onKeyChange);
        }
		this.el.value = "";
	}

	autosize() {
		var el = this;
		setTimeout(function() {
			el.style.cssText = "height:auto; padding:0";
			// for box-sizing other than "content-box" use:
			// el.style.cssText = '-moz-box-sizing:content-box';
			el.style.cssText = "height:" + el.scrollHeight + "px";
		}, 0);
	}

	shouldComponentUpdate() {
		return false;
	}

	render() {
		/*eslint-disable*/
		console.info("re text afea");
		let { maxChars } = this.props;
		return (
			<div className={style.container}>
				<textarea
					className={style.textarea}
					maxlength={maxChars}
					ref={c => (this.el = c)}
					rows="1"
					onKeyDown={this.onEnterPress}
					onClick={e => {
						e.stopPropagation();
						e.preventDefault();
					}}
				/>
				<div className={style.emojiContainer}>
					<EmojiPicker onSelect={this.emojiOnSelectHandler} />
				</div>
			</div>
		);
	}
}

export default ResizableTextarea;