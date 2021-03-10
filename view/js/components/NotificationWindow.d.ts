import TransientElement, { ITransientElement } from './TransientElement.js';
export interface INotificationWindow extends ITransientElement {
}
export declare class NotificationWindow extends TransientElement implements INotificationWindow {
    #private;
    constructor(title: string, body: string | Node, parent?: HTMLElement);
    build(): void;
    close(): void;
}
export default NotificationWindow;
