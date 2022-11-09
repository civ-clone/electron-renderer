import Element from './Element';
import { Unit as UnitData } from '../types';
import { e } from '../lib/html';
import renderUnit from './Map/lib/renderUnit';

export class Unit extends Element {
  #scale: number = 2;

  constructor(unit: UnitData, scale: number = 2) {
    super(e('canvas[width="32"][height="32"]'));

    this.#scale = scale;

    this.build(unit);
  }

  build(unit: UnitData) {
    const unitCanvas = renderUnit(unit);
    const context = this.element().getContext('2d')!;
    context.imageSmoothingEnabled = false;

    const sizeX = this.size(unitCanvas.width as number),
      sizeY = this.size(unitCanvas.height as number);

    const offsetX = Math.floor((this.size(16) - sizeX) / 2),
      offsetY = Math.floor((this.size(16) - sizeY) / 2);

    context.drawImage(unitCanvas, offsetX, offsetY, sizeX, sizeY);
  }

  element(): HTMLCanvasElement {
    return super.element() as HTMLCanvasElement;
  }

  size(size: number = 16): number {
    return size * this.#scale;
  }
}

export default Unit;
