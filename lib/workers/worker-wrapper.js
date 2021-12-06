import { parentPort } from 'worker_threads';

const sendMessage = data => parentPort.postMessage({ type: 'data', data });

parentPort.on('message', async task => {
  const module = await import(task.workerPath);
  await module.default(sendMessage, task.context);
  parentPort.postMessage({ type: 'done' });
});
