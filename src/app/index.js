import { h, Component, render } from "preact";
import VideoPlayerContainer from "@containers/VideoPlayer";
import CommentPaneContainer from "@containers/CommentPaneContainer";
import TranscriptionContainer from "@containers/TranscriptionContainer";
import OnBoardingBox from "@components/OnBoardingBox";
import { Provider } from "unistore/preact";
import { namespaceConnect } from "@utils/enhancer";
import { actions } from "./actions";
import { STRING_ONBOARDING } from "@config/constants";
import style from "styles/index.scss";
import onboardingImage from "images/onboarding.gif";

class App extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		const { targetCommentContainer, targetTranscriptionContainer, edit, onCommentPaneRender, showOnboarding, filter, secondaryId, popupSelector } = this.props;
		let targetCommentContainerRef = document.getElementById(targetCommentContainer);
		let targetTranscriptionContainerRef = document.getElementById(targetTranscriptionContainer);
		if(!targetCommentContainerRef){
			return;
		}

		this.commentContainerRoot = render(
			<Provider store={this.context.store}>
				<CommentPaneContainer
					edit={edit}
					targetPlayerId={this.props.id}
					secondaryTargetPlayerId={secondaryId}
					filter={filter}
					popupSelector={popupSelector}
					namespace={this.props.namespace}
					onCommentPaneRender={onCommentPaneRender}
				/>
			</Provider>,
			targetCommentContainerRef,
			targetCommentContainerRef.lastChild
		);

		if(targetTranscriptionContainerRef){
			this.transcriptionContainerRoot = render(
				<Provider store={this.context.store}>
					<TranscriptionContainer
						namespace={this.props.namespace}
						targetPlayerId={this.props.id}
					/>
				</Provider>,
				targetTranscriptionContainerRef,
				targetTranscriptionContainerRef.lastChild
			);
		}


		if (showOnboarding && edit) {
			this.onBoardingContainerRoot = render(
				<div className={style.onBoardingContainer}>
					<OnBoardingBox text={STRING_ONBOARDING} image={onboardingImage} />
				</div>,
				document.getElementById(targetCommentContainer)
			);
		}
	}

	componentWillUnmount() {
		const { targetCommentContainer, targetTranscriptionContainer } = this.props;
		let targetCommentContainerRef = document.getElementById(targetCommentContainer);
		let targetTranscriptionContainerRef = document.getElementById(targetTranscriptionContainer);
		if(this.commentContainerRoot){
			render("", document.getElementById(targetCommentContainerRef), this.commentContainerRoot);
		}
		if (this.onBoardingContainerRoot) {
			render("", document.getElementById(targetCommentContainerRef), this.onBoardingContainerRoot);
		}
		if (this.transcriptionContainerRoot) {
			render("", document.getElementById(targetTranscriptionContainerRef), this.transcriptionContainerRoot);
		}
	}

	render() {
		let {
			primaryTracks,
			edit,
			secondaryTracks,
			onRenderComplete,
			showControlsOnly,
			namespace,
			controlOptions,
			downloadSrc,
			secondaryId,
			popupSelector
		} = this.props;

		return (
			<VideoPlayerContainer
				primaryTracks={primaryTracks}
				downloadSrc={downloadSrc}
				id={this.props.id}
				secondaryId={secondaryId}
				edit={edit}
				popupSelector={popupSelector}
				namespace={namespace}
				secondaryTracks={secondaryTracks}
				onRenderComplete={onRenderComplete}
				showControlsOnly={showControlsOnly}
				controlOptions={controlOptions}
			/>
		);
	}
}

export default namespaceConnect(undefined, actions)(App);
