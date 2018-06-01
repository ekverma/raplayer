
var transcriptionModel = {
	search: (timestampedTranscripts, searchPhrases) => {
		let matchedTranscriptIndices = [];
		let searchedTranscripts = timestampedTranscripts.map(function(timestampedTranscript, index) {
			let text = timestampedTranscript.text;
			searchPhrases.forEach((phrase) => {
				let phraseWithSpaces = " " + phrase.toLowerCase() + " ";
				let pos = text.toLowerCase().indexOf(phraseWithSpaces);
				if (pos != -1) {
					let actualPos = pos + 1;
					text = text.substr(0, actualPos) + transcriptionModel.highlightText(text.substr(actualPos, phrase.length)) + text.substr(actualPos + phrase.length);
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
