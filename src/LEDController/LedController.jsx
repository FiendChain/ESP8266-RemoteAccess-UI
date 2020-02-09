import WebsocketManager from "../WebsocketManager.jsx";

import Slider from "./Slider.jsx";
import Fader from "./Fader.jsx";

import React from 'react';
import ReactDom from 'react-dom';

const Controllers = {
    Slider, Fader
};

const GetController = (props) => {
    
};

export default class LedController extends React.Component {
    constructor(props) {
        super(props);
        this.props.websocket.listen(this.dataListener.bind(this), WebsocketManager.EventType.DATA);
        this.props.websocket.listen(this.getInfo.bind(this), WebsocketManager.EventType.SOCKET_STATUS);
        this.controllers = ["Slider", "Fader"];
        this.state = {
            leds: [],
            controller: "Slider"
        };
    }   

    dataListener(data) {
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

    setLeds(leds) {
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

    setController(controller) {
        this.setState({...this.state, controller: controller});
    }

    getControllerComponent(props) {
        let Controller = Controllers[this.state.controller];
        return <Controller {...props}></Controller>;
    }

    renderControllers() {
        return this.controllers.map((value, index) => {
            return <a key={index} className="dropdown-item" onClick={() => this.setController(value)}>{value}</a>;
        })
    }

    renderHeader() {
        return (
        <div className="d-flex justify-content-between flex-wrap flex-mid-nowrap align-items-center pb-2 mb-3 border-bottom">
            <h3>LED Controls</h3>
            <div className="btn-toolbar mb-2 mb-md-0 dropdown">
                <button className="btn btn-sm btn-outline-secondary dropdown-toggle" data-toggle="dropdown">{this.state.controller}</button>
                <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                    {this.renderControllers()} 
                </div>
            </div>
        </div>);
    }


    render() {
        return (
        <div>
            {this.renderHeader()}
            {this.getControllerComponent({leds: this.state.leds, setLeds: this.setLeds.bind(this)})}
        </div>);
    }
}