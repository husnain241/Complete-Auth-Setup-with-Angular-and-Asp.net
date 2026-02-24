import { Injectable, signal } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {

  private hubConnection: signalR.HubConnection | undefined;

  // Real-time data updates ko track karne ke liye signal
  public messageReceived = signal<string>('');

  /**
   * Start (or restart) the SignalR connection.
   * Call this AFTER login so the JWT token is available in localStorage.
   */
  public startConnection = () => {
    // Pehle purani connection band karein agar chalti ho
    this.stopConnection();

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7146/hubs/notifications', {
        accessTokenFactory: () => localStorage.getItem('access_token') || '',
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('SignalR: Connection Started!'))
      .catch(err => console.log('SignalR: Error while starting connection: ' + err));
  }

  /**
   * Stop the SignalR connection (e.g. on logout).
   */
  public stopConnection = () => {
    if (this.hubConnection && this.hubConnection.state !== signalR.HubConnectionState.Disconnected) {
      this.hubConnection.stop()
        .then(() => console.log('SignalR: Connection Stopped.'))
        .catch(err => console.log('SignalR: Error while stopping connection: ' + err));
    }
    this.hubConnection = undefined;
  }

  // Spread operator (...args) use karein
  public addListener = (methodName: string, callback: (...args: any[]) => void) => {
    this.hubConnection?.on(methodName, (...args) => callback(...args));
  }
}