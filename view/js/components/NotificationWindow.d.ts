export interface INotificationWindow {
    display(): void;
    element(): HTMLElement;
}
export declare class NotificationWindow implements INotificationWindow {
    #private;
    constructor(title: string, body: string | Node, parent?: HTMLElement);
    close(): void;
    display(): void;
    element(): HTMLElement;
}
export default NotificationWindow;
