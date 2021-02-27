export interface Notification {
    message: string;
    title?: string;
}
export declare class Notifications {
    #private;
    constructor(container?: HTMLElement);
    receive(notification: Notification): void;
    private check;
    private publish;
}
export default Notifications;
