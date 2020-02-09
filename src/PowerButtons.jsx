import WebsocketManager from "./WebsocketManager.jsx";

import React from "react";

export default class PowerButtons extends React.Component {
    constructor(props) {
        super(props);
        this.props.websocket.listen(this.dataListener.bind(this), WebsocketManager.EventType.DATA);
        this.props.websocket.listen(this.getInfo.bind(this), WebsocketManager.EventType.SOCKET_STATUS);
        this.state = {
            isPowered: false
        };
    }

    turnOn() {
        this.props.websocket.send([0x02, 0x02]);
    }

    turnOff() {
        this.props.websocket.send([0x02, 0x01]);
    }

    reset() {
        this.props.websocket.send([0x02, 0x03]);
    }

    dataListener(data) {
        if (data.length < 3 || data[0] !== 0x02) {
            return;
        }
        this.onInfo(data);
        return true;
    }

    onInfo(data) {
        let command = data[1];
        let state = data[2];
        switch (command) {
        case 0x04:
            this.setState({...this.state, isPowered: (state > 0)});       
            break;
        default: 
            console.warn("Unhandled pc io command: " + command);
            break;
        }
    }

    getInfo(status) {
        if (status) {
            this.props.websocket.send([0x02, 0x04]);
        }
    }

    render() {
        return <div>
            <h2 className="h2">Power controls</h2>
            <div className="btn-group" role="group">
                <button type="button" className="btn btn-success col-10" onClick={() => this.turnOn()}>On</button>
                <button type="button" className="btn btn-danger col-10" onClick={() => this.turnOff()}>Off</button>
                <button type="button" className="btn btn-warning col-10" onClick={() => this.reset()}>Reset</button>
            </div>
            <div>Powered: {String(this.state.isPowered)}</div>
        </div>
    }
}