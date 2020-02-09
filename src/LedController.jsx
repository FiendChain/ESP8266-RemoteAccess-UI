import WebsocketManager from "./WebsocketManager.jsx";

import React from 'react';
import ReactDom from 'react-dom';

export default class LedController extends React.Component {
    constructor(props) {
        super(props);
        this.props.websocket.listen(this.dataListener.bind(this), WebsocketManager.EventType.DATA);
        this.props.websocket.listen(this.getInfo.bind(this), WebsocketManager.EventType.SOCKET_STATUS);
        this.state = {
            leds: []
        };
    }   

    dataListener(data, event_type) {
        if (data.length < 2 || data[0] !== 0x01) {
            return;
        }

        let command_type = data[1];
        if (command_type === 0x02 && data.length >= 3) {
            this.onInfo(data);    
        } else if (command_type === 0x01) {

        }

        return true;
    }

    onInfo(data) {
        let total_leds = data[2];
        if (total_leds !== data.length-3) {
            console.warn("Incorrect match between data length and total leds");
            return;
        }

        let leds = [];
        for (let i = 0; i < total_leds; i++) {
            leds.push(data[i+3]);
        }
        this.setState({...this.state, leds: leds});
    }

    getInfo(status) {
        if (status) {
            this.props.websocket.send([0x01, 0x02]);
        }
    }

    onLedChange(index, event) {
        let value = event.target.value;
        this.props.websocket.send([0x01, 0x01, index, value]);
        let leds = [...this.state.leds];
        leds[index] = value;
        this.setState({...this.state, leds: leds});
    }

    createSlider(value, index) {
       return <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
            <input  className="custom-range mr-2 w-90" type="range"
                    min="0" max="128" step="1"
                    value={value} 
                    onChange={(ev) => this.onLedChange(index, ev)}></input>
            <span className="badge badge-primary badge-pill">{value}</span>
       </li>;
    }

    render() {
        let controls = this.state.leds.map((d, i) => this.createSlider(d, i));
        return <div>
            <h2 className="h2">Led Controls</h2>
            <ul className="list-group">{controls}</ul>
            </div>;
    }
}