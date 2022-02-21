export interface IEventHandler {
  handle(event: string, ...args: any[]): void;
  off(event: string, handler?: (...args: any[]) => void): void;
  on(event: string, handler: (...args: any[]) => void): void;
}
export declare class EventHandler implements IEventHandler {
  #private;
  handle(event: string, ...args: any[]): void;
  off(event: string, handler?: (...args: any[]) => void): void;
  on(event: string, handler: (...args: any[]) => void): void;
}
export default EventHandler;
