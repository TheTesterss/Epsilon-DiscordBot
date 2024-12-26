import { EventEmitter } from 'node:events';

export default class Database extends EventEmitter {
    constructor() {
        super({ captureRejections: true });
    }
}
