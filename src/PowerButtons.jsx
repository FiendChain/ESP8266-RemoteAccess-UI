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

    renderPowerButton() {
        let callback = this.state.isPowered ? (() => this.turnOff()) : (() => this.turnOn());
        let className = this.state.isPowered ? "btn-danger" : "btn-success";
        return (
        <button type="button" className={"btn "+className} onClick={callback}>
            <i className="fa fa-power-off"></i>
        </button>); 
    }

    renderResetButton() {
        return (
        <button type="button" className="btn btn-warning" onClick={() => this.reset()}>
            <i className="fa fa-redo"></i>
        </button>);
    }

    render() {
        return (
        <div className="navbar-nav col">
            <div className="btn-group" role="group">
                {this.renderPowerButton()}
                {this.renderResetButton()}
           </div>
        </div>);
    }
}