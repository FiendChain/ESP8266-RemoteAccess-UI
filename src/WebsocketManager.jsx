const EventType = {
    DATA: 0,
    SOCKET_STATUS: 1,
};

export default class WebsocketManager {
    constructor() {
        this.websocket = null;
        this.data_callbacks = new Set();
        this.status_callbacks = new Set();
        this.EventType = EventType;
    }

    notifyOnStatus(status) {
        console.log("Websocket status: " + status);
        for (let cb of this.status_callbacks) {
            cb(status);
        }
    }

    notifyOnData(event) {
        let buffer = event.data;
        let data = new Uint8Array(buffer);
        console.log("Recieved: " + data);
        for (let cb of this.data_callbacks) {
            if (cb(data)) {
                break;
            }
        }
    }

    open(url) {
        this.close();
        console.log("Opening websocket @ " + url);
        this.websocket = new WebSocket(url);
        this.websocket.binaryType = "arraybuffer";
        this.websocket.onopen = (ev) => this.notifyOnStatus(true);
        this.websocket.onclose = (ev) => this.notifyOnStatus(false);
        this.websocket.onmessage = (ev) => this.notifyOnData(ev);
    }

    close() {
        if (this.isActive()) {
            this.websocket.close();
        }
        this.websocket = null;
    }

    isActive() {
        if (this.websocket === null) {
            return false;
        }
        if (this.websocket.readyState !== WebSocket.OPEN) {
            return false;
        }
        return true;
    }

    send(data) {
        if (this.isActive()) {
            let buffer = new Uint8Array(data);
            this.websocket.send(buffer);
            return true;
        }
        return false;
    }

    getCallbackList(event_type) {
        switch (event_type) {
        case WebsocketManager.EventType.DATA: 
            return this.data_callbacks;
        case WebsocketManager.EventType.SOCKET_STATUS: 
            return this.status_callbacks;
        default:
            return undefined;
        }
    }

    listen(callback, event_type) {
        let callbacks = this.getCallbackList(event_type);
        if (callbacks !== undefined) {
            callbacks.add(callback);
        }
        return this;
    }

    unlisten(callback, event_type) {
        let callbacks = this.getCallbackList(event_type);
        if (callbacks !== undefined) {
            return callbacks.delete(callback);
        }
        return false;
    }

    static get EventType() {
        return EventType;
    }
};
