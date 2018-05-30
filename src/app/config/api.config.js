let apiUrls = {
	postComment({ cname, subjectId, entityId, learnerId }) {
		return {
			url: `/${cname}/social/mission?submissionId=${subjectId}&entityId=${entityId}&learnerId=${learnerId}`
		};
	},
	getComments({ socialId, cname }, { authors } = {}) {
		let authorsList = [];
		if (authors && authors.length) {
			authorsList = authors.map(author => author.id);
		}
		let url = `/${cname}/social/${socialId}`;
		if (authorsList.length) {
			url += "?authors=" + authorsList.join(",");
		}
		return { url };
	},
	editComment({ socialId, cname }) {
		return { url: `/${cname}/social/${socialId}` };
	},
	deleteComment({ socialId, cname }) {
		return { url: `/${cname}/social/${socialId}` };
	},
	getTranscriptionData({ cname }) {
		return { url: `/${cname}/review/transcription_data` }
	}
};

export default apiUrls;