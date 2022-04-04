import { e } from '../lib/html.js';
import Map from './Map.js';
import { Coordinate, Tile } from '../types';
import World from './World.js';

export interface IPortal {
  build(updatedTiles: Tile[]): void;
  center(): Coordinate;
  isVisible(x: number, y: number): boolean;
  render(): void;
  scale(): number;
  setCenter(x: number, y: number): void;
  visibleBounds(): [number, number, number, number];
  visibleRange(): [Coordinate, Coordinate];
}

export class Portal implements IPortal {
  #canvas: HTMLCanvasElement;
  #center: Coordinate = { x: 0, y: 0 };
  #context: CanvasRenderingContext2D;
  #layers: Map[] = [];
  #scale: number;
  #world: World;

  constructor(
    world: World,
    canvas: HTMLCanvasElement = e('canvas') as HTMLCanvasElement,
    scale = 2,
    ...layers: Map[]
  ) {
    this.#world = world;
    this.#canvas = canvas;
    this.#scale = scale;
    this.#layers.push(...layers);

    this.#context = canvas.getContext('2d') as CanvasRenderingContext2D;
  }

  build(updatedTiles: Tile[]): void {
    this.#layers.forEach((layer: Map) => layer.update(updatedTiles));
  }

  center(): Coordinate {
    return this.#center;
  }

  isVisible(x: number, y: number): boolean {
    const [xLowerBound, xUpperBound, yLowerBound, yUpperBound] =
      this.visibleBounds();

    // I _think_ this logic is correct now...
    return (
      (xLowerBound > xUpperBound
        ? x < xUpperBound || x > xLowerBound
        : x < xUpperBound && x > xLowerBound) &&
      (yLowerBound > yUpperBound
        ? y < yUpperBound || y > yLowerBound
        : y < yUpperBound && y > yLowerBound)
    );
  }

  render(): void {
    const tileSize = this.#layers[0].tileSize(),
      layerWidth = this.#world.width() * tileSize,
      centerX = this.#center.x * tileSize + Math.trunc(tileSize / this.scale()),
      portalCenterX = Math.trunc(this.#canvas.width / 2),
      layerHeight = this.#world.height() * tileSize,
      centerY = this.#center.y * tileSize + Math.trunc(tileSize / this.scale()),
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

  scale(): number {
    return this.#scale;
  }

  setCenter(x: number, y: number): void {
    this.#center.x = x;
    this.#center.y = y;

    this.render();
  }

  visibleBounds(): [number, number, number, number] {
    const xRange = Math.floor(
        this.#canvas.width / this.#layers[0].tileSize() / this.#scale
      ),
      yRange = Math.floor(
        this.#canvas.height / this.#layers[0].tileSize() / this.#scale
      ),
      xLowerBound =
        (this.#center.x - xRange + this.#world.width()) % this.#world.width(),
      xUpperBound = (this.#center.x + xRange) % this.#world.width(),
      yLowerBound =
        (this.#center.y - yRange + this.#world.height()) % this.#world.height(),
      yUpperBound = (this.#center.y + yRange) % this.#world.height();

    return [xLowerBound, xUpperBound, yLowerBound, yUpperBound];
  }

  visibleRange(): [Coordinate, Coordinate] {
    const xRange = Math.floor(
        this.#canvas.width / this.#layers[0].tileSize() / this.#scale
      ),
      yRange = Math.floor(
        this.#canvas.height / this.#layers[0].tileSize() / this.#scale
      );

    return [
      { x: this.#center.x - xRange, y: this.#center.y - yRange },
      { x: this.#center.x + xRange, y: this.#center.y + yRange },
    ];
  }
}

export default Portal;
