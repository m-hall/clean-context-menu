'use strict';

class Debug {
    constructor(level) {
        this.level = level || Debug.NONE;
    }
    message(level, ...args) {
        if (level > this.level) {
            return;
        }
        if (level === Debug.ERROR) {
            console.error.apply(console, args);
        } else if (level === Debug.WARN) {
            console.warn.apply(console, args);
        } else {
            console.log.apply(console, args);
        }
    }
    error(...args) {
        this.message(Debug.ERROR, ...args);
    }
    warn(...args) {
        this.message(Debug.WARN, ...args);
    }
    log(...args) {
        this.message(Debug.LOG, ...args);
    }
    detail(...args) {
        this.message(Debug.DETAILS, ...args);
    }
}
Debug.NONE = 0;
Debug.ERROR = 1;
Debug.WARN = 2;
Debug.WARNING = 2;
Debug.LOG = 3;
Debug.DETAIL = 4;
Debug.DETAILS = 4;

module.exports = Debug;
