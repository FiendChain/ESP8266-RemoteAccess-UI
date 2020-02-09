import WebsocketManager from "../WebsocketManager.jsx";

import React from 'react';
import ReactDom from 'react-dom';

export default class Fader extends React.Component {
    constructor(props) {
        super(props);
    }   

    onLedChange(index) {
        let value = this.props.leds[index];
        let leds = [...this.props.leds];
        let newValue = (value > 0) ? 0 : 128;
        leds[index] = newValue;
        this.props.setLeds(leds);
    }

    createSlider(value, index) {
       return <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
            <button className="btn btn-outline-primary btn-sm"
                   onClick={() => this.onLedChange(index)}>
                Toggle
            </button>
            <span className="badge badge-primary badge-pill">{value}</span>
       </li>;
    }

    render() {
        let sliders = this.props.leds.map((d, i) => this.createSlider(d, i)); 
        return (
        <div>
            {sliders}
        </div>);
    }
}