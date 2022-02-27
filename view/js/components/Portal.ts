import { e } from '../lib/html.js';
import Map from './Map.js';
import { Tile } from '../types';
import World from './World.js';

export type Coordinate = {
  x: number;
  y: number;
};

export interface IPortal {
  build(updatedTiles: Tile[]): void;
  isVisible(x: number, y: number): boolean;
  render(): void;
  setCenter(x: number, y: number): void;
}

export class Portal implements IPortal {
  #canvas: HTMLCanvasElement;
  #center: Coordinate = { x: 0, y: 0 };
  #context: CanvasRenderingContext2D;
  #layers: Map[] = [];
  #world: World;

  constructor(
    world: World,
    canvas: HTMLCanvasElement = e('canvas') as HTMLCanvasElement,
    ...layers: Map[]
  ) {
    this.#world = world;
    this.#canvas = canvas;
    this.#layers.push(...layers);

    this.#context = canvas.getContext('2d') as CanvasRenderingContext2D;
  }

  build(updatedTiles: Tile[]): void {
    this.#layers.forEach((layer: Map) => layer.update(updatedTiles));
  }

  center(): Coordinate {
    return this.#center;
  }

  visibleRange(): { x: number; y: number }[] {
    // TODO: replace `2` with the scale
    const xRange = Math.floor(
        this.#canvas.width / this.#layers[0].tileSize() / 2
      ),
      yRange = Math.floor(this.#canvas.height / this.#layers[0].tileSize() / 2);

    return [
      { x: this.#center.x - xRange, y: this.#center.y - yRange },
      { x: this.#center.x + xRange, y: this.#center.y + yRange },
    ];
  }

  isVisible(x: number, y: number): boolean {
    // TODO: replace `2` with the scale
    const xRange = Math.floor(
        this.#canvas.width / this.#layers[0].tileSize() / 2
      ),
      yRange = Math.floor(this.#canvas.height / this.#layers[0].tileSize() / 2);

    return (
      x < this.#center.x + xRange &&
      x > this.#center.x - xRange &&
      y < this.#center.y + yRange &&
      y > this.#center.y - yRange
    );
  }

  render(): void {
    // TODO: replace `2` with the scale
    const tileSize = this.#layers[0].tileSize(),
      layerWidth = this.#world.width() * tileSize,
      centerX = this.#center.x * tileSize + Math.trunc(tileSize / 2),
      portalCenterX = Math.trunc(this.#canvas.width / 2),
      layerHeight = this.#world.height() * tileSize,
      centerY = this.#center.y * tileSize + Math.trunc(tileSize / 2),
      portalCenterY = Math.trunc(this.#canvas.height / 2);

    let startX = portalCenterX - centerX,
      endX = portalCenterX + layerWidth,
      startY = portalCenterY - centerY,
      endY = portalCenterY + layerHeight;

    while (startX > 0) {
      startX -= layerWidth;
    }

    while (startY > 0) {
      startY -= layerHeight;
    }

    while (endX < this.#canvas.width) {
      endX += layerWidth;
    }

    while (endY < this.#canvas.height) {
      endY += layerHeight;
    }

    this.#context.fillStyle = '#000';
    this.#context.fillRect(
      0,
      0,
      this.#world.width() * tileSize,
      this.#world.height() * tileSize
    );

    for (let x = startX; x < endX; x += layerWidth) {
      for (let y = startY; y < endY; y += layerHeight) {
        this.#layers.forEach((layer) => {
          if (!layer.isVisible()) {
            return;
          }

          const canvas = layer.canvas();

          this.#context.drawImage(canvas, x, y, canvas.width, canvas.height);
        });
      }
    }
  }

  setCenter(x: number, y: number): void {
    this.#center.x = x;
    this.#center.y = y;

    this.render();
  }
}

export default Portal;
