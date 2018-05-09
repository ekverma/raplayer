
// import { h } from "preact";
// import { MatchedWord } from "@components/MatchedWord";

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

	// search: (timstampedTranscripts, oldSearchWords, newSearchWords) => {
	// 	let addedWords = newSearchWords.filter((word) => !oldSearchWords.includes(word));
	// 	let removedWords = oldSearchWords.filter((word) => !newSearchWords.includes(word));
	// 	let numberOfMatches = 0;
	// 	let searchedTranscripts = timestampedTranscripts.map(function(timestampedTranscript) {
	// 		let text = timestampedTranscript.text;
	// 		addedWords.forEach((phrase) => {
	// 			let pos = text.toLowerCase().indexOf(phrase.toLowerCase());
	// 			if (pos != -1) {
	// 				text = text.substr(0, pos) + this.highlightText(text.substr(pos, phrase.length)) + text.substr(pos + phrase.length);
	// 				numberOfMatches++;
	// 			}
	// 		});

	// 		removedWords.forEach((phrase) => {
	// 			let highlightedPhrase = this.highlightText(phrase);
	// 			let pos = text.toLowerCase().indexOf(highlightedPhrase.toLowerCase());
	// 			if (pos != -1) {
	// 				text = text.substr(0, pos)
	// 						+ this.unhighlightText(text.substr(pos, highlightedPhrase.length))
	// 						+ text.substr(pos + highlightedPhrase.length);
	// 			}
	// 		});
	// 		return {...timestampedTranscript, text: text};
	// 	});
	// },

	highlightText: (text) => {
		// return <MatchedWord text='" + text + "' />
		// return "<MatchedWord text={text} />"
		return text.bold();
	},

	unhighlightText: (text) => {
		return text.substr(3, text.length - 7);
	}
}

export default transcriptionModel;

