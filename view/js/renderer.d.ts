declare var transport: {
    receive(channel: string, handler: (...args: any[]) => void): void;
    send(channel: string, payload?: any): void;
};
declare const notificationArea: HTMLElement, dataArea: HTMLElement, startButton: HTMLElement;
