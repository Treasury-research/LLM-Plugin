export const deepClone = (source: any) => {
	if (typeof source !== "object" || source == null) {
		return source;
	}
	const target: any = Array.isArray(source) ? [] : {};
	// eslint-disable-next-line no-restricted-syntax
	for (const key in source) {
		if (Object.prototype.hasOwnProperty.call(source, key)) {
			if (typeof source[key] === "object" && source[key] !== null) {
				target[key] = deepClone(source[key]);
			} else {
				target[key] = source[key];
			}
		}
	}
	return target;
};
