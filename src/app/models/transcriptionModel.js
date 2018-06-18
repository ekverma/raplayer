import {
	CLASS_SEARCH_HIGHLIGHT,
	CLASS_CURRENT_MATCH_HIGHLIGHT
} from "@config/constants";


var transcriptionModel = {
	search: (timestampedTranscripts, searchPhrases) => {
		let matchedTranscriptIndices = [];
		let searchedTranscripts = timestampedTranscripts.map(function(timestampedTranscript, index) {
			let text = timestampedTranscript.text;
			searchPhrases.forEach((phrase) => {
				let phraseWithSpaces = " " + phrase.toLowerCase() + " ";
				let i = 0;
				let pos = text.toLowerCase().indexOf(phraseWithSpaces, i);
				while(pos != -1) {
					let actualPos = pos + 1;
					text = text.substr(0, actualPos) + transcriptionModel.highlightText(text.substr(actualPos, phrase.length)) + text.substr(actualPos + phrase.length);
					matchedTranscriptIndices.push(index);
					i = actualPos + phrase.length;
					pos = text.toLowerCase().indexOf(phraseWithSpaces, i);
				}
			});
			return {...timestampedTranscript, text: text};
		});
		let { highlightedTranscripts } = transcriptionModel.highlightCurrentMatch(searchedTranscripts, 1, 1, matchedTranscriptIndices);
		return {
			searchedTranscripts: highlightedTranscripts,
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
		// return "<span class='searchHighlightStyle'>" + text + "</span>";
		return "<span class='" + CLASS_SEARCH_HIGHLIGHT + "'>" + text + "</span>";
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
	},

	highlightCurrentMatch: (searchedTranscripts, currentMatchNumber, prevMatchNumber, matchedTranscriptIndices) => {
		if (matchedTranscriptIndices.length == 0) {
			return { highlightedTranscripts: [...searchedTranscripts] };
		}
		let transcripts = [...searchedTranscripts];
		let prevIndex = matchedTranscriptIndices[prevMatchNumber - 1];

		transcripts[prevIndex].text = transcripts[prevIndex].text.replace(CLASS_CURRENT_MATCH_HIGHLIGHT, CLASS_SEARCH_HIGHLIGHT);

		let curIndex = matchedTranscriptIndices[currentMatchNumber - 1];
		let i = currentMatchNumber - 2;
		let indexInTranscript = 1;
		while(i >= 0 && matchedTranscriptIndices[i] == curIndex) {
			indexInTranscript++;
			i--;
		}
		let curTranscript = transcripts[curIndex].text;

		i = 1;
		let pos = curTranscript.indexOf(CLASS_SEARCH_HIGHLIGHT, 0);
		while(pos != -1) {
			if (i == indexInTranscript) {
				curTranscript = curTranscript.substr(0, pos) + CLASS_CURRENT_MATCH_HIGHLIGHT + curTranscript.substr(pos + CLASS_SEARCH_HIGHLIGHT.length);
				break;
			}
			else {
				i++;
				pos = curTranscript.indexOf(CLASS_SEARCH_HIGHLIGHT, pos + CLASS_SEARCH_HIGHLIGHT.length);
			}
		}
		transcripts[curIndex].text = curTranscript;
		return { highlightedTranscripts: transcripts };
	}
}

export default transcriptionModel;
