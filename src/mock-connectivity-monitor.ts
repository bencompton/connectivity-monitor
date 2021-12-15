import { IConnectivityMonitorListener } from '.';
import { ConnectionStatusEnum, IConnectivityMonitor } from './connectivity-monitor';

export class MockConnectivityMonitor implements IConnectivityMonitor {
  private connectionStatus: ConnectionStatusEnum;
  private listeners: IConnectivityMonitorListener[];

  constructor() {
    this.connectionStatus = 'connected';
    this.listeners = [];
  }

  public getConnectionStatus() {
    return Promise.resolve(this.connectionStatus);
  }

  public setConnectionStatus(connectionStatus: ConnectionStatusEnum) {
    this.connectionStatus = connectionStatus;
    this.listeners.forEach((l) => l(this.connectionStatus));
  }

  public listen(listener: (connectionStatus: ConnectionStatusEnum) => void) {
    this.listeners.push(listener);
  }
}
  