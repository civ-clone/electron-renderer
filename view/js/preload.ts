import { ipcRenderer } from 'electron';

console.log('preload loaded');

ipcRenderer.on('logger', (event, data): void => {
  console.log('logger');
  (document.getElementById('data') as HTMLElement).innerHTML += JSON.stringify(
    data
  );
});

ipcRenderer.on('notification', (event, data): void => {
  console.log('notification');
  (document.getElementById('notification') as HTMLElement).innerHTML = data;
});
