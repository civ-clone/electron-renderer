import { IpcRendererEvent, contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('transport', {
  receive(channel: string, handler: (...args: any[]) => void): void {
    ipcRenderer.on(channel, (event: IpcRendererEvent, ...args: any[]) => {
      handler(...args);
    });
  },
  send(channel: string, payload: any): void {
    ipcRenderer.invoke(channel, payload);
  },
});
