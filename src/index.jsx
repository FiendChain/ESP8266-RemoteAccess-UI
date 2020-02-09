import React from 'react';
import ReactDOM from 'react-dom';

import WebsocketManager from './WebsocketManager.jsx';
import LedController from "./LedController.jsx"
import PowerButtons from "./PowerButtons.jsx";
import DHT11 from "./DHT11.jsx";
import ConnectionManager from "./ConnectionManager.jsx";

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.websocket = new WebsocketManager();
    }

    render() {
        return <div>
            <ConnectionManager websocket={this.websocket}></ConnectionManager>
            <LedController websocket={this.websocket}></LedController>
            <PowerButtons websocket={this.websocket}></PowerButtons>
            <DHT11 websocket={this.websocket}></DHT11>
        </div>
    }
}

ReactDOM.render(
    <Main/>,
    document.getElementById("root")
)