import WebsocketManager from "../WebsocketManager.jsx";

import Slider from "./Slider.jsx";
import Fader from "./Fader.jsx";

import React from 'react';
import ReactDom from 'react-dom';

const Controllers = {
    "Slider": Slider, 
    "Fader": Fader
};

export default class LedManager extends React.Component {
    constructor(props) {
        super(props);
        this.controllers = Controllers;
        this.state = {
            leds: [],
            controller: "Slider"
        };
    }   

    setController(controller) {
        this.setState({...this.state, controller: controller});
    }

    getControllerComponent(props) {
        let Controller = Controllers[this.state.controller];
        return <Controller {...props}></Controller>;
    }

    renderControllers() {
        return Object.keys(this.controllers).map((value, index) => {
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
            {this.getControllerComponent({
                websocket: this.props.websocket})}
        </div>);
    }
}