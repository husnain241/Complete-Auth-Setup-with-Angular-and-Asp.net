import { Injectable, signal } from '@angular/core';
import * as signalR from '@microsoft/signalr';
@Injectable({
  providedIn: 'root'
})


export class SignalrService {
  
  private hubConnection: signalR.HubConnection | undefined;
  
  // Real-time data updates ko track karne ke liye signal
  public messageReceived = signal<string>('');

  constructor() {
    this.startConnection();
  }

  
  private startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7146/hubs/notifications',{
accessTokenFactory: () => localStorage.getItem('token') || '', 
skipNegotiation: true,
transport: signalR.HttpTransportType.WebSockets // Yeh line lazmi hai 
      }) // Backend Hub URL
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('SignalR: Connection Started!'))
      .catch(err => console.log('SignalR: Error while starting connection: ' + err));
  }

  // // Backend se specific messages sunne ke liye listener
  // public addListener = (methodName: string, callback: (data: any) => void) => {
  //   this.hubConnection?.on(methodName, callback);
  // }

  // Spread operator (...args) use karein

public addListener = (methodName: string, callback: (...args: any[]) => void) => {
  this.hubConnection?.on(methodName, (...args) => callback(...args));
}

}