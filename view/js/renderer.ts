declare var transport: {
  receive(channel: string, handler: (...args: any[]) => void): void;
  send(channel: string, payload?: any): void;
};

const notificationArea = document.getElementById('notification') as HTMLElement,
  dataArea = document.getElementById('data') as HTMLElement,
  startButton = document.querySelector('button') as HTMLElement;

transport.receive('notification', (data): void => {
  notificationArea.innerHTML = data;
});

transport.receive('gameData', (data): void => {
  dataArea.innerHTML = JSON.stringify(data);
});

document.addEventListener('DOMContentLoaded', (): void => {
  startButton.addEventListener('click', (): void => {
    transport.send('start');
  });
});
