export declare class Retryable {
  #private;
  constructor(handler: () => boolean, maxTries?: number, interval?: number);
  run(): void;
  then(): Promise<void>;
}
export default Retryable;
