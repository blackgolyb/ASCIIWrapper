/**
 * Uses canvas.measureText to compute and return the width of the given text of given font in pixels.
 *
 * @param {String} text The text to be rendered.
 * @param {String} fontWeight The css font-weight descriptor that text is to be rendered with (e.g. "bold").
 * @param {String} fontSize The css font-size descriptor that text is to be rendered with (e.g. "14px").
 * @param {String} fontFamily The css font-family descriptor that text is to be rendered with (e.g. "verdana").
 *
 * @see https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript/21015393#21015393
 */
export function getTextSize(
	text,
	fontWeight,
	fontSize,
	fontFamily,
	lineHeight,
) {
	// re-use canvas object for better performance
	const canvas =
		getTextSize.canvas ||
		(getTextSize.canvas = document.createElement("canvas"));
	const context = canvas.getContext("2d");
	context.font = `${fontWeight} ${fontSize} ${fontFamily}`;
	const metrics = context.measureText(text);
	const height = Number.parseFloat(lineHeight);
	const width = metrics.width;

	return { width: width, height: height };
}

function getCssStyle(element, prop) {
	return window.getComputedStyle(element, null).getPropertyValue(prop);
}

function getCanvasFont(el = document.body) {
	const fontWeight = getCssStyle(el, "font-weight") || "normal";
	const fontSize = getCssStyle(el, "font-size") || "16px";
	const fontFamily = getCssStyle(el, "font-family") || "Times New Roman";
	const lineHeight = getCssStyle(el, "line-height") || "1";

	return [fontWeight, fontSize, fontFamily, lineHeight];
}

export function getTextSizeInElement(text, element) {
	const font = getCanvasFont(element);
	return getTextSize(text, ...font);
}
