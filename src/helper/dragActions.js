import * as _ from "fxjs";
import * as $ from "fxdom";

import { onUnmounted } from "./vue.js";
require("./hammer.js");

const eventQueue = {
	panstart: [],
	panmove: []
}

const initDragger = () => {
	const ham = new Hammer($.qs(".i-canvas"), {});
	// ham.on("pan", function(ev) {
	// 	console.log(ev);
	// 	console.log("🔨🔨🔨🔨🔨");
	// });
	ham.on("panstart", e => {
		_.go(
			eventQueue["panstart"],
			_.each(item => {
				const el = $.closest(".s--draggable", e.target);
				if(!!!el) return;
				if(el.isEqualNode(item.target)) {
					console.log(e.additionalEvent);
					$.addClass("s--dragging", el);
					item.callback();
				}
			})
		)
	});
	ham.on("panmove", e => {
		_.go(
			eventQueue["panmove"],
			_.each(item => {
				const el = $.closest(".s--draggable", e.target);
				if(!!!el) return;
				if(el.isEqualNode(item.target)) {
					console.log(e.additionalEvent);
					$.addClass("s--dragging", el);
					item.callback();
				}
			})
		)
	});
};

const addDragger = (el, ...events) => {
	$.addClass("s--draggable", el);
	_.go(
		events,
		_.each(({ event, callback }) => {
			eventQueue[event].push({ target: el, callback });
		})
	);
};

export { initDragger, addDragger };