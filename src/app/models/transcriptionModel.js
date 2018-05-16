
var transcriptionModel = {
	search: (timestampedTranscripts, searchPhrases) => {
		let matchedTranscriptIndices = [];
		let searchedTranscripts = timestampedTranscripts.map(function(timestampedTranscript, index) {
			let text = timestampedTranscript.text;
			searchPhrases.forEach((phrase) => {
				let pos = text.toLowerCase().indexOf(phrase.toLowerCase());
				if (pos != -1) {
					text = text.substr(0, pos) + transcriptionModel.highlightText(text.substr(pos, phrase.length)) + text.substr(pos + phrase.length);
					matchedTranscriptIndices.push(index);
				}
			});
			return {...timestampedTranscript, text: text};
		});
		return {
			searchedTranscripts: searchedTranscripts,
			matchedTranscriptIndices: matchedTranscriptIndices
		};
	},

	getKeywordsInParams: (evalParams) => {
		let keywords = []
		evalParams.forEach(evalParam => {
			keywords = keywords.concat(evalParam.keywords);
		});
		return keywords;
	},

	highlightText: (text) => {
		return text.bold();
	},

	unhighlightText: (text) => {
		return text.substr(3, text.length - 7);
	}
}

export default transcriptionModel;

