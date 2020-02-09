import React from 'react';
import ReactDOM from 'react-dom';

import WebsocketManager from './WebsocketManager.jsx';

export default class ConnectionManager extends React.Component {
    constructor(props) {
        super(props);
        this.props.websocket.listen(this.setStatus.bind(this), WebsocketManager.EventType.SOCKET_STATUS);
        this.state = {
            isConnected: false,
            url: "ws://192.168.1.109:80/api/v1/websocket"
        };
        setTimeout(() => this.open(), 0);
    }

    open() {
        this.props.websocket.open(this.state.url);
    }

    setStatus(status) {
        this.setState({...this.state, isConnected: status});
    }

    render() {
        return <div>
            <h2>Connection</h2>
            <div>Is connected: {String(this.state.isConnected)}</div>
            <button type="button" className="btn btn-outline-success" onClick={() => this.open()}>Connect</button>
        </div>;
    }
}