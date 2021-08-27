let voltailes = [];

const addEvent = (target, name, callback, type = "volatile") => {
	target.addEventListener(name, callback);
	if(type == "volatile") {
		voltailes.push({ target, name, callback });
	}
};

const removeVolatileEvents = () => {
	voltailes.forEach(({ target, name, callback }) => {
		// console.log(target, name, callback);
		target.removeEventListener(name, callback);
	});
	voltailes = [];
}

export { addEvent, removeVolatileEvents }