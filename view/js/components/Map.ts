import { e } from '../lib/html.js';
import { NeighbourDirection, Tile, Unit } from '../types';
import World from './World.js';

export interface IMap {
  context(): CanvasRenderingContext2D;
  render(...args: any[]): void;
  scale(): number;
  tileSize(): number;
  world(): World;
}

export class Map implements IMap {
  #activeUnit: Unit | null;
  #canvas: HTMLCanvasElement;
  #context: CanvasRenderingContext2D;
  #visible: boolean = true;
  #preload: HTMLElement;
  #scale: number;
  #tileSize: number;
  #world: World;

  constructor(
    world: World,
    canvas: HTMLCanvasElement = e('canvas') as HTMLCanvasElement,
    activeUnit: Unit | null = null,
    scale: number = 2
  ) {
    this.#activeUnit = activeUnit;
    this.#canvas = canvas;
    this.#world = world;
    this.#tileSize = 16;
    this.#scale = scale;

    this.setCanvasSize();

    this.#context = this.#canvas.getContext('2d') as CanvasRenderingContext2D;
    this.#preload = document.querySelector('#preload') as HTMLElement;
  }

  canvas(): HTMLCanvasElement {
    return this.#canvas;
  }

  clear(): void {
    this.context().clearRect(0, 0, this.canvas().width, this.canvas().height);
  }

  context(): CanvasRenderingContext2D {
    return this.#context;
  }

  render(tiles: Tile[] = this.world().tiles()): void {
    this.clear();

    tiles.forEach(({ x, y }: Tile) => this.renderTile(this.world().get(x, y)));
  }

  renderTile({ x, y }: Tile): void {
    const size = this.tileSize(),
      offsetX = x * size,
      offsetY = y * size;

    this.context().clearRect(offsetX, offsetY, size, size);
  }

  scale(): number {
    return this.#scale;
  }

  tileSize(): number {
    return this.#tileSize * this.#scale;
  }

  update(tilesToUpdate: Tile[]): void {
    tilesToUpdate.forEach(({ x, y }: Tile) =>
      this.renderTile(this.world().get(x, y))
    );
  }

  world(): World {
    return this.#world;
  }

  protected drawImage(
    path: string,
    x: number,
    y: number,
    augment: (image: CanvasImageSource) => CanvasImageSource = (image) => image
  ): void {
    const size = this.tileSize(),
      offsetX = x * size,
      offsetY = y * size,
      image = this.getPreloadedImage(path);

    this.putImage(augment(image), offsetX, offsetY);
  }

  protected filterNeighbours(
    tile: Tile,
    filter: (tile: Tile) => boolean,
    directions: NeighbourDirection[] = ['n', 'e', 's', 'w']
  ): NeighbourDirection[] {
    return directions.filter((direction: NeighbourDirection): boolean =>
      filter(this.#world.getNeighbour(tile, direction))
    );
  }

  protected getPreloadedImage(path: string): CanvasImageSource {
    const image = this.#preload.querySelector(`[src$="${path}.png"]`);

    if (image === null) {
      console.error(`Missing image: ${path}.`);

      return e('canvas') as HTMLCanvasElement;
    }

    return image as HTMLImageElement;
  }

  protected putImage(
    image: CanvasImageSource,
    offsetX: number,
    offsetY: number
  ): void {
    this.#context.imageSmoothingEnabled = false;

    this.#context.drawImage(
      image,
      offsetX,
      offsetY,
      (image.width as number) * this.#scale,
      (image.height as number) * this.#scale
    );
  }

  protected replaceColors(
    image: CanvasImageSource,
    source: string[],
    replacement: string[]
  ) {
    const canvas = e('canvas') as HTMLCanvasElement,
      context = canvas.getContext('2d') as CanvasRenderingContext2D;

    canvas.width = image.width as number;
    canvas.height = image.height as number;

    context.drawImage(
      image,
      0,
      0,
      image.width as number,
      image.height as number
    );

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height),
      getColor = (input: string | number[]) => {
        let match: RegExpMatchArray | null = null,
          color: { r: number; g: number; b: number; a: number } = {
            r: 0,
            g: 0,
            b: 0,
            a: 0,
          };

        if (typeof input === 'string') {
          if (
            (match = input.match(
              /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i
            )) !== null
          ) {
            color = {
              r: parseInt(match[1], 16),
              g: parseInt(match[2], 16),
              b: parseInt(match[3], 16),
              a: 1,
            };
          } else if (
            (match = input.match(
              /^#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])$/
            )) !== null
          ) {
            color = {
              r: parseInt(match[1] + match[1], 16),
              g: parseInt(match[2] + match[2], 16),
              b: parseInt(match[3] + match[3], 16),
              a: 1,
            };
          } else if (
            (match = input.match(
              /^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/
            )) !== null
          ) {
            color = {
              r: parseInt(match[1]),
              g: parseInt(match[2]),
              b: parseInt(match[3]),
              a: 1,
            };
          } else if (
            (match = input.match(
              /^rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+|\d+\.|\.\d+|\d+\.\d+)\s*\)\s*$/
            )) !== null
          ) {
            color = {
              r: parseInt(match[1]),
              g: parseInt(match[2]),
              b: parseInt(match[3]),
              a: parseFloat(match[4] ?? 1),
            };
          }
        } else if ('length' in input) {
          color = {
            r: input[0] || 0,
            g: input[1] || 0,
            b: input[2] || 0,
            a: input[3] || 1,
          };
        }

        return color;
      };

    let sourceColors = source.map(getColor),
      replaceColors = replacement.map(getColor);

    for (let i = 0; i < imageData.data.length; i += 4) {
      sourceColors.forEach((color, n) => {
        if (
          imageData.data[i] === color.r &&
          imageData.data[i + 1] === color.g &&
          imageData.data[i + 2] === color.b &&
          imageData.data[i + 3] === color.a * 255
        ) {
          imageData.data[i] = (replaceColors[n] || replaceColors[0]).r;
          imageData.data[i + 1] = (replaceColors[n] || replaceColors[0]).g;
          imageData.data[i + 2] = (replaceColors[n] || replaceColors[0]).b;
          imageData.data[i + 3] = Math.trunc(
            (replaceColors[n] || replaceColors[0]).a * 255
          );
        }
      });
    }

    context.putImageData(imageData, 0, 0);

    return canvas;
  }

  protected setCanvasSize(): void {
    this.#canvas.height = this.#world.height() * this.tileSize();
    this.#canvas.width = this.#world.width() * this.tileSize();
    // this.#canvas.setAttribute('height', this.#canvas.height.toString());
    // this.#canvas.setAttribute('width',this.#canvas.width.toString());
  }

  isVisible(): boolean {
    return this.#visible;
  }

  setVisible(visible: boolean): void {
    this.#visible = visible;
  }
}

export default Map;
