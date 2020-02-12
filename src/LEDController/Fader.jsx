import LedController from "./LedController.jsx";

import React from 'react';
import ReactDom from 'react-dom';

const Direction = {
    FALLING: 0, 
    RISING: 1
};

export default class Fader extends LedController {
    constructor(props) {
        super(props);
        this.state = {
            fadeValues: [],
            fadeDirection: []
        };
    }   

    componentDidMount() {
        this.interval = setInterval(() => this.updateLeds(), 33);
    }

    updateLeds() {
        if (this.leds === undefined) {
            return;
        }
        let leds = [...this.leds];
        for (let i = 0; i < leds.length; i++) {
            let direction = this.state.fadeDirection[i];
            let rate = this.state.fadeValues[i];
            switch (direction) {
            case Direction.RISING:
                leds[i] += rate;
                if (leds[i] >= 128) {
                    leds[i] = 128;
                    this.state.fadeDirection[i] = Direction.FALLING;
                }
                break;
            case Direction.FALLING:
                leds[i] -= rate;
                if (leds[i] <= 0) {
                    leds[i] = 0;
                    this.state.fadeDirection[i] = Direction.RISING;
                }
                break;
            }
        }
        this.leds = leds;
    }

    onInfo(data) {
        super.onInfo(data);
        if (this.leds.length === this.state.fadeValues.length) {
            return;
        }
        let fadeValues = this.leds.map(() => 0);
        let fadeDirection = this.leds.map(() => Direction.RISING);
        this.setState({...this.state, fadeValues: fadeValues, fadeDirection: fadeDirection});
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        clearInterval(this.interval);
    }

    onFadeChange(index, event) {
        let value = Number(event.target.value);
        let fadeValues = [...this.state.fadeValues];
        fadeValues[index] = value;
        this.setState({...this.state, fadeValues: fadeValues});
    }

    createSlider(value, index) {
       return <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
            <input  className="custom-range mr-2 w-90" type="range"
                    min="0" max="20" step="1"
                    value={value} 
                    onChange={(ev) => this.onFadeChange(index, ev)}></input>
            <span className="badge badge-primary badge-pill">{value}</span>
       </li>;
    }

    render() {
        let sliders = this.state.fadeValues.map((d, i) => this.createSlider(d, i)); 
        return (
        <div>
            {sliders}
        </div>);
    }
}