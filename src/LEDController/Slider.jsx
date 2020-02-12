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
       return <li className="list-group-item d-flex justify-content-between align-items-center">
            <input  className="custom-range mr-2 w-90" type="range"
                    min="0" max="128" step="1"
                    value={value} 
                    onChange={(ev) => this.onLedChange(index, ev)}></input>
            <span className="badge badge-primary badge-pill">{value}</span>
       </li>;
    }

    render() {
        const totalColumns = 2;
        let rows = [];
        for (let i = 0; this.leds && i < this.leds.length; i += totalColumns) {
            let cols = [];
            for (let col = 0; col < totalColumns; col++) {
                let index = i+col;
                if (index < this.leds.length) {
                    let value = this.leds[index];
                    cols.push(<div className="col" key={index}>{this.createSlider(value, index)}</div>);
                }
            }
            rows.push(<div className="row" key={rows.length}>{cols}</div>);
        }
        return <div className="container-fluid">{rows}</div>;
    }
}