// worker-script.js
const { parentPort } = require('worker_threads');
parentPort.once('message', async (message) => {
	const output = capitalize(message);
	parentPort.postMessage(output);		
});
function fetchComments(text) {
	return text.toUpperCase();
}