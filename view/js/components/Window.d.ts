import TransientElement, { ITransientElement } from './TransientElement.js';
export interface IWindow extends ITransientElement {
  close(): void;
  maximise(): void;
}
declare type WindowSize = {
  height: number | string;
  width: number | string;
};
declare type WindowPosition = {
  x: number;
  y: number;
};
export declare type WindowSettings = {
  canClose: boolean;
  canMaximise: boolean;
  canResize: boolean;
  parent: HTMLElement;
  position: WindowPosition | 'auto';
  size: WindowSize | 'auto' | 'maximised';
};
export declare type WindowOptions = {
  [K in keyof WindowSettings]?: WindowSettings[K];
};
export declare class Window extends TransientElement implements IWindow {
  #private;
  private options;
  constructor(title: string, body: string | Node, options?: WindowOptions);
  build(): void;
  close(): void;
  display(focus?: boolean): void;
  maximise(): void;
}
export default Window;
