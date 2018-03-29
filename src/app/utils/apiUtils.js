const getHeaders = (headers = {}) => {
	const additionalHeaders = {
		"Content-Type": "application/json"
	};
	return {
		...additionalHeaders,
		...headers
	};
};

const makeCall = (urlObj, reqObj = {}) => {
	return fetch(urlObj.url, { ...reqObj, credentials: "same-origin" })
		.then(resp => {
			let json;
			if (resp.ok) {
				json = resp.json();
			}
			if (resp.status >= 200 && resp.status < 300) {
				return json;
			} else {
				return Promise.reject(Error("error"));
			}
		})
		.catch(error => {
			return Promise.reject(Error(error.message));
		});
};

const get = (urlObj, reqObj = {}) => {
	reqObj.method = "GET";
	reqObj.headers = getHeaders(reqObj.headers);
	return makeCall(urlObj, { ...reqObj });
};

const post = (urlObj, reqObj = {}) => {
	reqObj.method = "POST";
	reqObj.headers = getHeaders(reqObj.headers);
	if (reqObj.body && reqObj.headers["Content-Type"] === "application/json") {
		reqObj.body = JSON.stringify(reqObj.body);
	}
	return makeCall(urlObj, { ...reqObj });
};

const put = (urlObj, reqObj = {}) => {
	reqObj.method = "PUT";
	reqObj.headers = getHeaders(reqObj.headers);
	if (reqObj.body && reqObj.headers["Content-Type"] === "application/json") {
		reqObj.body = JSON.stringify(reqObj.body);
	}
	return makeCall(urlObj, { ...reqObj });
};
const del = (urlObj, reqObj = {}) => {
	reqObj.method = "DELETE";
	return makeCall(urlObj, { ...reqObj });
};

export { get, post, put, del };