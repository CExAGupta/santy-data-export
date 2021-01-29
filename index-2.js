// index.js
const { Worker } = require('worker_threads');
const workerScriptFilePath = require.resolve('./worker.js');
const worker = new Worker(workerScriptFilePath);
worker.on('message', (output) => console.log(output));
worker.on('error', (error) => console.log(error));
worker.on('exit', (code) => {
	if (code !== 0)
		throw new Error(`Worker stopped with exit code ${code}`);
});
/** 
Once we have added all the event listeners to the worker, we send message data to the worker, to be processed.
**/
worker.postMessage('this is a lower case sentence');
worker.postMessage('this is a lower case sentence');
worker.postMessage('this is a lower case sentence');
worker.postMessage('this is a lower case sentence');
worker.postMessage('this is a lower case sentence');
worker.postMessage('this is a lower case sentence');
worker.postMessage('this is a lower case sentencefdsfsd');