export interface IIntervalHandler {
  check(): void;
  clear(): void;
  off(handler: () => void): void;
  on(handler: () => void): void;
  pause(): void;
  isPaused(): boolean;
  resume(): void;
}
export declare class IntervalHandler implements IIntervalHandler {
  #private;
  constructor(tick?: number);
  check(): void;
  clear(): void;
  off(handler: () => void): void;
  on(handler: () => void): void;
  pause(): void;
  isPaused(): boolean;
  resume(): void;
}
export default IntervalHandler;
