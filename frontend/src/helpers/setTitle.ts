export function setTitle(title : undefined | string) {
	document.title = (typeof title === 'undefined' || title === '')
		? 'RMS Tasks'
		: `${title} | RMS Tasks`
}
