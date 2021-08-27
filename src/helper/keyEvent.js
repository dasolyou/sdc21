import * as _ from "fxjs";

import { onUnmounted } from "./vue.js";

const bindKeyEvent = (...items) => {
	_.go(
		items,
		_.each(({ type = "keydown", code, prevent, modKey, callback }) => {
			const eventCallback = e => {
				if(document.activeElement.tagName == "INPUT" || document.activeElement.tagName == "TEXTAREA") return;
				const isTargetKey = _.go(code.split(" "), _.some(item => item == e.code));
				if(isTargetKey) {
					modKey = _.isArray(modKey) ? modKey : [modKey];
					_.go(
						["meta", "ctrl", "alt", "shift"],
						_.map(eventKey => {
							return [eventKey + "Key", _.some(paramKey => eventKey == paramKey, modKey) ? true : false]
						}),
						_.every(([k, v]) => {
							return e[k] == v;
						}),
						bool => {
							if(bool) {
								prevent && e.preventDefault();
								callback(e);
							}
						}
					);
				}
			};
			window.addEventListener(type, eventCallback);

			onUnmounted(() => {
				window.removeEventListener(type, eventCallback);
			});
		}),
	);
}

export { bindKeyEvent };