import LedController from "./LedController.jsx";

import React from 'react';
import ReactDom from 'react-dom';

export default class Slider extends LedController {
    constructor(props) {
        super(props);
    }   

    onLedChange(index, event) {
        let value = event.target.value;
        let leds = [...this.leds];
        leds[index] = value;
        this.leds = leds;
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
        let sliders = this.leds.map((d, i) => this.createSlider(d, i)); 
        return (
        <div>
            {sliders}
        </div>);
    }
}