import { parentPort, workerData } from 'worker_threads';

const { input, start, finish, file } = workerData;

const send = data => parentPort.postMessage(data);

const module = await import(file);
await module.default(send, { input, start, finish });
