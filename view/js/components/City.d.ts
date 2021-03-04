import { City as CityData } from '../types';
export declare class City {
  #private;
  constructor(city: CityData, element?: HTMLElement);
  build(): void;
  element(): HTMLElement;
}
export default City;
