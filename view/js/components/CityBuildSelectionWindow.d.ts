import { CityBuild } from '../types';
import SelectionWindow from './SelectionWindow.js';
declare type onCompleteHandler = (hasSelected: boolean, ...args: any[]) => void;
export declare class CityBuildSelectionWindow extends SelectionWindow {
  private onComplete;
  constructor(cityBuild: CityBuild, onComplete?: onCompleteHandler);
  close(hasSelected?: boolean): void;
}
export default CityBuildSelectionWindow;
