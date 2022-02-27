import { City as CityData } from '../types';
import Window from './Window.js';
export declare class City extends Window {
  #private;
  constructor(city: CityData);
  changeProduction(): void;
}
export default City;
