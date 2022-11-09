import { IpcRendererEvent, contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('transport', {
  receive(channel: string, handler: (...args: any[]) => void): void {
    ipcRenderer.on(channel, (event: IpcRendererEvent, ...args: any[]): void => {
      handler(...args);
    });
  },
  receiveOnce(channel: string, handler: (...args: any[]) => void): void {
    ipcRenderer.once(
      channel,
      (event: IpcRendererEvent, ...args: any[]): void => {
        try {
          handler(...args);
        } catch (e) {
          console.error(e);
        }
      }
    );
  },
  send(channel: string, payload: any): void {
    ipcRenderer.invoke(channel, payload);
  },
});
