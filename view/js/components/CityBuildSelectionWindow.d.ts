import { City as CityData, CityBuild } from '../types';
import { SelectionWindow, SelectionWindowActions } from './SelectionWindow.js';
import Portal from './Portal';
declare type onCompleteHandler = (hasSelected: boolean, ...args: any[]) => void;
export declare class CityBuildSelectionWindow extends SelectionWindow {
  private onComplete;
  static showCityAction: (city: CityData) => {
    label: string;
    action(selectionWindow: SelectionWindow): void;
  };
  static showCityOnMapAction: (
    city: CityData,
    portal: Portal
  ) => {
    label: string;
    action(selectionWindow: SelectionWindow): void;
  };
  constructor(
    cityBuild: CityBuild,
    onComplete?: onCompleteHandler,
    additionalActions?: SelectionWindowActions
  );
  close(hasSelected?: boolean): void;
}
export default CityBuildSelectionWindow;
