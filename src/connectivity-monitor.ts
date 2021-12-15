export type ConnectionStatusEnum = 'connected' | 'disconnected';

export interface IConnectivityMonitorListener {
  (connectionStatus: ConnectionStatusEnum): void;
}

export interface IConnectivityMonitor {
  getConnectionStatus: () => Promise<ConnectionStatusEnum>;
  listen: (listener: IConnectivityMonitorListener) => void;
}

export interface IConfirmConnectivityCallback {
  (): Promise<ConnectionStatusEnum>;
}

export class ConnectivityMonitor implements IConnectivityMonitor {
  private connectionStatus: ConnectionStatusEnum;
  private listeners: IConnectivityMonitorListener[];
  private confirmConnectivityCallback: IConfirmConnectivityCallback;

  constructor() {
    this.listeners = [];
    this.connectionStatus = navigator.onLine ? 'connected' : 'disconnected';
    this.startMonitoring();
  }

  public async getConnectionStatus() {
    if (this.confirmConnectivityCallback !== null) {
      try {
        this.connectionStatus = await this.confirmConnectivityCallback();
      } catch {
        this.connectionStatus = 'disconnected';
      }
    }

    return this.connectionStatus;
  }

  public setConfirmConnectivityCallback(callback: IConfirmConnectivityCallback) {
    this.confirmConnectivityCallback = callback;
  }

  public listen(listener: IConnectivityMonitorListener) {
    this.listeners.push(listener);
  }

  private startMonitoring(): void {
    if (typeof window.addEventListener === 'function') {
      window.addEventListener('online', () => {
        return setTimeout(() => {
          this.confirmConnectivity();
        }, 100);
      }, false);
    }

    if (typeof window.addEventListener === 'function') {
      window.addEventListener('offline', () => {
        return this.confirmConnectivity();
      }, false);
    }
  }

  private async confirmConnectivity() {
    await this.getConnectionStatus();
    this.listeners.forEach((l) => l(this.connectionStatus));
  }
}
