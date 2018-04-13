let colorMap = {};
export deepmerge from "deepmerge";

/**
 * Throws an error if the passed string has whitespace. This is used by
 * class methods to be relatively consistent with the classList API.
 *
 * @param {string} str
 *         The string to check for whitespace.
 *
 * @throws {Error}
 *         Throws an error if there is whitespace in the string.
 *
 */
function throwIfWhitespace(str) {
	if (/\s/.test(str)) {
		throw new Error("class has illegal whitespace characters");
	}
}

/**
 * Produce a regular expression for matching a className within an elements className.
 *
 * @param {string} className
 *         The className to generate the RegExp for.
 *
 * @return {RegExp}
 *         The RegExp that will check for a specific `className` in an elements
 *         className.
 */
function classRegExp(className) {
	return new RegExp("(^|\\s)" + className + "($|\\s)");
}

/**
 * Check if an element has a CSS class
 *
 * @param {Element} element
 *        Element to check
 *
 * @param {string} classToCheck
 *        Class name to check for
 *
 * @return {boolean}
 *         - True if the element had the class
 *         - False otherwise.
 *
 * @throws {Error}
 *         Throws an error if `classToCheck` has white space.
 */
export function hasClass(element, classToCheck) {
	throwIfWhitespace(classToCheck);
	if (element.classList) {
		return element.classList.contains(classToCheck);
	}
	return classRegExp(classToCheck).test(element.className);
}

/**
 * Add a CSS class name to an element
 *
 * @param {Element} element
 *        Element to add class name to.
 *
 * @param {string} classToAdd
 *        Class name to add.
 *
 * @return {Element}
 *         The dom element with the added class name.
 */
export function addClass(element, classToAdd) {
	if (element.classList) {
		element.classList.add(classToAdd);

		// Don't need to `throwIfWhitespace` here because `hasElClass` will do it
		// in the case of classList not being supported.
	} else if (!hasClass(element, classToAdd)) {
		element.className = (element.className + " " + classToAdd).trim();
	}

	return element;
}

/**
 * Remove a CSS class name from an element
 *
 * @param {Element} element
 *        Element to remove a class name from.
 *
 * @param {string} classToRemove
 *        Class name to remove
 *
 * @return {Element}
 *         The dom element with class name removed.
 */
export function removeClass(element, classToRemove) {
	if (element.classList) {
		element.classList.remove(classToRemove);
	} else {
		throwIfWhitespace(classToRemove);
		element.className = element.className
			.split(/\s+/)
			.filter(function(c) {
				return c !== classToRemove;
			})
			.join(" ");
	}

	return element;
}

export function getPrefixes() {
	var pfx = ["webkit", "moz", "ms", "o", "", "MS"];
	return pfx;
}

export function titleCase(str) {
	str = str.toLowerCase().split(" ");
	for (var i = 0; i < str.length; i++) {
		str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
	}
	return str.join(" ");
}

export function runPrefixMethod(obj, method) {
	var pfx = getPrefixes();
	var p = 0,
		m,
		t;
	while (p < pfx.length && !obj[m]) {
		m = method;
		if (pfx[p] == "") {
			m = m.substr(0, 1).toLowerCase() + m.substr(1);
		}
		m = pfx[p] + m;
		t = typeof obj[m];
		if (t != "undefined") {
			pfx = [pfx[p]];
			return t == "function" ? obj[m]() : obj[m];
		}
		p++;
	}
}

export function toHHMMSS(str) {
	if (!str) {
		return "00:00";
	}
	var sec_num = Math.round(str);
	var hours = Math.floor(sec_num / 3600);
	var minutes = Math.floor((sec_num - hours * 3600) / 60);
	var seconds = sec_num - hours * 3600 - minutes * 60;
	if (hours < 10) {
		hours = "0" + hours;
	}
	if (minutes < 10) {
		minutes = "0" + minutes;
	}
	if (seconds < 10) {
		seconds = "0" + seconds;
	}
	var minsec = minutes + ":" + seconds;
	return hours != "00" ? hours + ":" + minsec : minsec;
}

export function getElementOffset(element) {
	var de = document.documentElement;
	var box = element.getBoundingClientRect();
	var top = box.top + window.pageYOffset - de.clientTop;
	var left = box.left + window.pageXOffset - de.clientLeft;
	return { top: top, left: left };
}

export function getColorMap(authors) {
	if (!authors || !authors.length) {
		return colorMap;
	}
	const colors = ["#0ed5c9", "#069eff", "#000000"];
	let j = 0;
	authors.map(author => {
		if (!colorMap[author]) {
			colorMap[author] = colors[j++];
		}
	});
	return colorMap;
}

export function parseText(text) {
	if (!text) {
		return "";
	}
	return text.replace(/\r?\n/g, "\n");
}

export function isIE() {
	var ua = window.navigator.userAgent;

	var msie = ua.indexOf("MSIE ");
	if (msie > 0) {
		// IE 10 or older => return version number
		return parseInt(ua.substring(msie + 5, ua.indexOf(".", msie)), 10);
	}

	var trident = ua.indexOf("Trident/");
	if (trident > 0) {
		// IE 11 => return version number
		var rv = ua.indexOf("rv:");
		return parseInt(ua.substring(rv + 3, ua.indexOf(".", rv)), 10);
	}

	var edge = ua.indexOf("Edge/");
	if (edge > 0) {
		// Edge (IE 12+) => return version number
		return parseInt(ua.substring(edge + 5, ua.indexOf(".", edge)), 10);
	}

	// other browser
	return false;
}

export function insertAtCursor(myField, myValue) {
	let sel;
	//IE support
	if (document.selection) {
		myField.focus();
		sel = document.selection.createRange();
		sel.text = myValue;
	} else if (myField.selectionStart || myField.selectionStart == "0") {
		//MOZILLA and others
		var startPos = myField.selectionStart;
		var endPos = myField.selectionEnd;
		myField.value =
			myField.value.substring(0, startPos) + myValue + myField.value.substring(endPos, myField.value.length);
	} else {
		myField.value += myValue;
	}
}

export function capitalizeKeys(obj) {
	const isObject = o => Object.prototype.toString.apply(o) === "[object Object]";
	const isArray = o => Object.prototype.toString.apply(o) === "[object Array]";

	let transformedObj = isArray(obj) ? [] : {};

	for (let key in obj) {
		const transformedKey = key.replace(/^\w/, (c) => c.toUpperCase());
		if (isObject(obj[key]) || isArray(obj[key])) {
			transformedObj[transformedKey] = capitalizeKeys(obj[key]);
		} else {
			transformedObj[transformedKey] = obj[key];
		}
	}
	return transformedObj;
}