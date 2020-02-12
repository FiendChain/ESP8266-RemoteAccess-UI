import WebsocketManager from "../WebsocketManager.jsx";

import React from 'react';
import ReactDom from 'react-dom';

export default class LedController extends React.Component {
    constructor(props) {
        super(props);
        this.callbacks = [
            [this.dataListener.bind(this), WebsocketManager.EventType.DATA],
            [this.statusListener.bind(this), WebsocketManager.EventType.SOCKET_STATUS]
        ];

        this.callbacks.map((value) => {
            this.props.websocket.listen(value[0], value[1]);
        });

        this.state = {
            leds: []
        };

        if (this.props.websocket.isActive()) {
            this.getInfo();
        }
    }   

    componentWillUnmount() {
        this.callbacks.map((value) => {
            this.props.websocket.unlisten(value[0], value[1]);
        });
    }

    dataListener(data) {
        if (data.length < 2 || data[0] !== 0x01) {
            return;
        }

        console.log("Getting data");

        let command_type = data[1];
        if (command_type === 0x02 && data.length >= 3) {
            this.onInfo(data);    
        } else if (command_type === 0x01) {

        }

        return true;
    }

    set leds(leds) {
        let changes = [];
        for (let i = 0; i < leds.length; i++) {
            let newValue = leds[i] & 0xFF;
            let oldValue = this.state.leds[i] & 0xFF;
            if (newValue !== oldValue) {
                changes.push(i);
                changes.push(newValue);
            }
        }
        if (changes.length === 0) {
            return;
        }
        let packet = [0x01, 0x01, ...changes];
        this.props.websocket.send(packet);
        this.setState({...this.state, leds: leds});
    }

    get leds() {
        return this.state.leds;
    }

    statusListener(status) {
        if (status) {
            this.getInfo();
        }
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

    getInfo() {
        this.props.websocket.send([0x01, 0x02]);
    }
}