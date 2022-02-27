export declare class RetryFailed extends Error {
  handler: (...args: any[]) => void;
  attempts: number;
  constructor(
    message: string,
    handler: (...args: any[]) => void,
    attempts: number
  );
}
export default RetryFailed;
