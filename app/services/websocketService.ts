import { Platform } from 'react-native';

export interface IMUData {
  id: number;
  timestamp: number;
  quaternion: {
    w: number;
    x: number;
    y: number;
    z: number;
  };
  calibration: {
    s: number;
    g: number;
    a: number;
    m: number;
  }
}

class WebSocketService {
  private ws: WebSocket | null = null;
  private ESP_IP: string = '192.168.1.207'; // This needs to be updated with actual ESP32 IP
  private readonly WS_PORT = 1234;
  private onDataCallback: ((data: IMUData[]) => void) | null = null;
  private isConnected: boolean = false;

  connect() {
    if (this.ws) {
      return;
    }

    const wsUrl = `ws://${this.ESP_IP}:${this.WS_PORT}`;
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log('WebSocket Connected');
      this.isConnected = true;
    };

    this.ws.onclose = () => {
      console.log('WebSocket Disconnected');
      this.isConnected = false;
      this.ws = null;
      // Attempt to reconnect after 5 seconds
      setTimeout(() => this.connect(), 5000);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    this.ws.onmessage = (event) => {
      try {
        // Split the received data into lines
        const lines = event.data.split('\n');
        const imuDataBatch: IMUData[] = [];

        // Process each line (except the last empty line)
        for (const line of lines) {
          if (line.trim() === '') continue;

          // Parse space-separated values
          const [id, timestamp, w, x, y, z, s, g, a, m] = line.split(' ').map(Number);

          if (!isNaN(id) && !isNaN(timestamp) && 
              !isNaN(w) && !isNaN(x) && !isNaN(y) && !isNaN(z) && 
              !isNaN(s) && !isNaN(g) && !isNaN(a) && !isNaN(m)) {
            imuDataBatch.push({
              id,
              timestamp,
              quaternion: { w, x, y, z },
              calibration: { s, g, a, m }
            });
          }
        }

        if (imuDataBatch.length > 0 && this.onDataCallback) {
          this.onDataCallback(imuDataBatch);
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    };
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.isConnected = false;
    }
  }

  setOnDataCallback(callback: (data: IMUData[]) => void) {
    this.onDataCallback = callback;
  }

  isConnectedToServer(): boolean {
    return this.isConnected;
  }

  // Update ESP32 IP address
  updateESPIP(ip: string) {
    this.disconnect();
    this.ESP_IP = ip;
    this.connect();
  }
}

// Create a singleton instance
export const websocketService = new WebSocketService();
export default websocketService;