import WebsocketManager from "./WebsocketManager.jsx";

import React from "react";

export default class DHT11 extends React.Component {
    constructor(props) {
        super(props);
        this.props.websocket.listen(this.dataListener.bind(this), WebsocketManager.EventType.DATA);
        this.props.websocket.listen((status) => {
            if (status) {
                this.getInfo();
            }
        }, WebsocketManager.EventType.SOCKET_STATUS);
        this.state = {
            temperature: 0,
            humidity: 0
        };
    }   

    dataListener(data) {
        if (data.length < 3 || data[0] !== 0x03) {
            return;
        }
        this.onInfo(data);
        return true;
    }

    onInfo(data) {
        let humidity = data[1];
        let temperature = data[2];
        this.setState({...this.state, humidity: humidity, temperature: temperature});
    }

    getInfo() {
        this.props.websocket.send([0x03], 300);
    }

    renderTemperature() {
        let width = this.state.temperature / 50 * 100;
        return <div className="progress">
            <div className="progress-bar bg-warning" role="progressbar" style={{width: width+"%"}}>{this.state.temperature+"'C"}</div>
        </div>
    }

    renderHumidity() {
        let width = this.state.humidity;
        return <div className="progress">
            <div className="progress-bar bg-primary" role="progressbar" style={{width: width+"%"}}>{this.state.humidity+"%"}</div>
        </div>
    }

    render() {
        return <div>
            <h2>DHT11</h2>
            {this.renderTemperature()}
            {this.renderHumidity()}
            <button type="button" className="btn btn-outline-primary" onClick={() => this.getInfo()}>Refresh</button>
        </div>
    }
}