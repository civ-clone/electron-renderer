export interface IEventHandler {
  handle(event: string, ...args: any[]): void;
  off(event: string, handler?: (...args: any[]) => void): void;
  on(event: string, handler: (...args: any[]) => void): void;
}

export class EventHandler implements IEventHandler {
  #stack: { [key: string]: ((...args: any[]) => void)[] } = {};

  handle(event: string, ...args: any[]): void {
    (this.#stack[event] || []).forEach((item): void => item(...args));
  }

  off(event: string, handler?: (...args: any[]) => void): void {
    if (!handler) {
      this.#stack[event] = [];
    }

    this.#stack[event] = (this.#stack[event] || []).filter(
      (item) => item !== handler
    );
  }

  on(event: string, handler: (...args: any[]) => void): void {
    if (!this.#stack[event]) {
      this.#stack[event] = [];
    }

    this.#stack[event].push(handler);
  }
}

export default EventHandler;
