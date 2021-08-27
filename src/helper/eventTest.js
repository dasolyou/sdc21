import { reactive, toRefs, onMounted, onUnmounted, useStore } from "./vue.js";

export function usePosition() {

	const { state, commit } = useStore();

	function update(e) {
		// console.log("🚧 - ", state.mx);
		commit("setMouse", { x: e.pageX, y: e.pageY });
	}

	onMounted(() => {
		window.addEventListener("mousemove", update);
	});
	onUnmounted(() => {
		window.removeEventListener("mousemove", update);
	});
};