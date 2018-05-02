export interface EventEmitterCallback {
    (...data: any[]): void;
}

interface EventEmmiterList {
    [key: string]: EventEmitterCallback[];
}

export class EventEmmiter {

    private events: EventEmmiterList = {};

    constructor() {

    }

    subscribe(event: string, callback: EventEmitterCallback, first = false) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        if (first) {
            this.events[event].unshift(callback);
        } else {
            this.events[event].push(callback);
        }
        return () => {
            this.events[event] = this.events[event].filter(c => c !== callback);
        }
    }

    emit(event: string, ...data: any[]) {
        if (this.events[event]) {
            this.events[event].forEach(callback => {
                callback(...data);
            });
        }
    }
}