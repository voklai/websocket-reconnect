const WebSocket = require('ws');

class ReconnectWebSocket {
    constructor(url, options = {}) {
        this.url = url;
        this.options = options;
        this.ws = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = options.maxReconnectAttempts || 10;
        this.reconnectInterval = options.reconnectInterval || 1000; // Initial reconnect interval in ms

        this.connect();
    }

    connect() {
        this.ws = new WebSocket(this.url);

        this.ws.on('open', () => {
            console.log('WebSocket connected');
            this.reconnectAttempts = 0; // Reset reconnect attempts on successful connection
        });

        this.ws.on('message', (message) => {
            console.log('Received message:', message);
            // Handle incoming messages
        });

        this.ws.on('close', () => {
            console.log('WebSocket disconnected');
            this.handleReconnect();
        });

        this.ws.on('error', (error) => {
            console.error('WebSocket error:', error);
            this.ws.close(); // Ensure closed state and trigger reconnect
        });
    }

    handleReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            let timeout = this.reconnectInterval * Math.pow(2, this.reconnectAttempts); // Exponential backoff
            setTimeout(() => {
                this.reconnectAttempts++;
                console.log(`Reconnecting attempt ${this.reconnectAttempts}`);
                this.connect();
            }, timeout);
        } else {
            console.log('Max reconnect attempts reached. Giving up.');
        }
    }

    // Additional methods for sending messages, closing the connection, etc., can be added here
    sendMessage(message) {
        if (this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(message);
        } else {
            console.log('WebSocket is not open. Cannot send message.');
        }
    }

    close() {
        if (this.ws) {
            this.ws.close();
        }
    }
}

module.exports = ReconnectWebSocket;
