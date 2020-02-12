import WebsocketManager from "./WebsocketManager.jsx";

import React from "react";

const temperatureMapping = [
    "temperature-low",
    "thermometer-quarter",
    "thermometer-half",
    "thermometer-three-quarters",
    "temperature-high"
];

export default class DHT11 extends React.Component {
    constructor(props) {
        super(props);
        this.props.websocket.listen(this.dataListener.bind(this), WebsocketManager.EventType.DATA);
        this.props.websocket.listen((status) => {
            if (status) this.getInfo();
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

    renderBar(icon, text, background, fontSize, barSize, width) {
        let fontStyle = {fontSize: fontSize+"em"};
        let barStyle = {height: barSize+"em"};

        return (
        <div className="progress" style={barStyle}>
            <div className={"progress-bar "+background} role="progressbar" style={{width: width+"%"}}>
                <div className="d-flex d-inline justify-content-center align-items-center">
                    <i className={"fa fa-"+icon} style={fontStyle}></i>
                    <div className="ml-3 text" style={fontStyle}>{text}</div>
                </div>
            </div>
        </div>);
    }

    renderTemperature() {
        let width = this.state.temperature / 50 * 100;
        // map from 10'C to 50'C
        // map as   0    to 4
        // index = (temp-10)/10 
        let index = (this.state.temperature-10)/10;
        index = Math.round(index);
        index = Math.min(index, temperatureMapping.length-1);
        index = Math.max(index, 0);
        let icon = temperatureMapping[index];

        let fontSize = 2.5;
        let barSize = fontSize + 1;
        let text = this.state.temperature+"\u00B0C";

        return this.renderBar(icon, text, "bg-danger", fontSize, barSize, width);
    }

    renderHumidity() {
        let width = this.state.humidity;
        let icon = "tint";
        let fontSize = 2.5;
        let barSize = fontSize + 1;
        let text = this.state.humidity+"%";

        return this.renderBar(icon, text, "bg-primary", fontSize, barSize, width);
    }

    render() {
        return <div>
            <div className="d-flex justify-content-between flex-wrap flex-mid-nowrap align-items-center border-bottom pb-2 mt-3 mb-3">
                <h3>DHT11</h3>
                <button className="btn btn-sm btn-outline-secondary" onClick={() => this.getInfo()}>Refresh</button>
            </div>
            <div className="row">
                <div className="col">{this.renderTemperature()}</div>
                <div className="col">{this.renderHumidity()}</div>
            </div>
        </div>
    }
}