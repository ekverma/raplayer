
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
		return "<span class='searchHighlightStyle'>" + text + "</span>";
	},

	unhighlightText: (text) => {
		return text.substr(3, text.length - 7);
	},

	sort: (timestampedTranscripts, key = "time") => {
		return timestampedTranscripts.sort((a, b) => {
			if (a[key] === b[key]) {
				return a.createdTime - b.createdTime;
			}
			return a[key] - b[key];
		});
	}
}

export default transcriptionModel;
