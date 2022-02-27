import Map from './Map.js';
import Portal from './Portal.js';
import World from './World.js';
export declare class Minimap {
  #private;
  constructor(
    element: HTMLCanvasElement,
    world: World,
    portal: Portal,
    ...layers: Map[]
  );
  update(): void;
}
export default Minimap;
