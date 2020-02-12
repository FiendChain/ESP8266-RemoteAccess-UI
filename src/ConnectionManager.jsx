import React from 'react';
import ReactDOM from 'react-dom';

import WebsocketManager from './WebsocketManager.jsx';

export default class ConnectionManager extends React.Component {
    constructor(props) {
        super(props);
        this.props.websocket.listen(this.setStatus.bind(this), WebsocketManager.EventType.SOCKET_STATUS);
        this.state = {
            isConnected: false,
            url: "192.168.1.109:80/api/v1/websocket"
            // url: window.location.hostname+":80/api/v1/websocket"
        };
        setTimeout(() => this.open(), 0);
    }

    open() {
        this.props.websocket.open("ws://"+this.state.url);
    }

    close() {
        this.props.websocket.close();
    }

    setStatus(status) {
        this.setState({...this.state, isConnected: status});
    }

    onURLChange(event) {
        let url = event.target.value;
        this.setState({...this.state, url: url});
    }

    renderURL() {
        return (
        <div className="input-group">
            <div className="input-group-prepend">
                <span className="input-group-text">ws://</span>
            </div>
            <input className="form-control form-control-light" 
                value={this.state.url}
                onChange={this.onURLChange.bind(this)}
                onKeyDown={(ev) => {
                    if (ev.key === "Enter") {
                        this.open();
                    }
                }}
                type="text" aria-label="URL"></input>
            {this.renderControls()}
        </div>);
    }

    renderControls() {
        let className = this.state.isConnected ? "btn-danger" : "btn-success";
        let callback  = this.state.isConnected ? () => this.close() : () => this.open(); 
        let icon = this.state.isConnected ? "fa fa-unlink" : "fa fa-link";
        return (
        <div className="input-group-append">
            <button type="button" className={"btn "+className} onClick={callback}>
                <i className={icon}></i>
            </button>
        </div>);
    }

    render() {
        return (
        <div className="flex-md-nowrap w-100">
            <div className="row">
                <div className="input-group col">
                    {this.renderURL()}
                </div>
            </div>
        </div>);
    }
}