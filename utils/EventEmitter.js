export class EventEmitter {
    #subscribers = {};

    addEventListener(eventName, subscriber) {
        if (!this.#subscribers[eventName]) {
            this.#subscribers[eventName] = []
        }

        this.#subscribers[eventName].push(subscriber);
    }

    emitEventListener(eventName, data = null) {
        this.#subscribers[eventName]?.forEach((subscriber) => {
            subscriber(data);
        })
    }

    removeEventListener(eventName, subscriber) {
        this.#subscribers[eventName] = this.#subscribers[eventName].filter((sub) =>
            sub !== subscriber
        )
    }
}