export interface Notification {
  message: string;
}
export declare class Notifications {
  #private;
  constructor(container?: HTMLElement);
  private bindEvents;
  receive(notification: Notification): void;
  publish(notification: Notification): void;
}
export default Notifications;
