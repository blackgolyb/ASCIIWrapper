export const strRepeatPattern = (pattern, len) => {
	const numOfRepeats = Math.ceil(len / pattern.length);
	return pattern.repeat(numOfRepeats).slice(0, len);
};