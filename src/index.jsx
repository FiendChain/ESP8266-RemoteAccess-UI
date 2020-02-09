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
        return <main>
            <nav className="navbar navbar-dark sticky-top bg-dark">
                <div className="container flex-md-nowrap">
                    <PowerButtons websocket={this.websocket}></PowerButtons>
                    <ConnectionManager websocket={this.websocket}></ConnectionManager>
                </div>
            </nav>
            <div className="container mt-2">
                <LedController websocket={this.websocket}></LedController>
                <DHT11 websocket={this.websocket}></DHT11>
            </div>
        </main>;
    }
}

ReactDOM.render(
    <Main/>,
    document.getElementById("root")
)