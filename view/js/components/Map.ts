import { e } from '../lib/html.js';
import { EntityInstance, Tile, Unit } from '../types';
import World from './World.js';

type Adjacent = 'n' | 'e' | 's' | 'w';
type Neighbouring = Adjacent | 'ne' | 'se' | 'sw' | 'nw';

export class Map {
  #activeUnit: Unit | null;
  #canvas: HTMLCanvasElement;
  #context: CanvasRenderingContext2D;
  #preload: HTMLElement;
  #scale: number;
  #tileSize: number;
  #world: World;

  constructor(
    world: World,
    canvas: HTMLCanvasElement,
    activeUnit: Unit | null = null,
    scale: number = 2
  ) {
    this.#activeUnit = activeUnit;
    this.#canvas = canvas;
    this.#world = world;
    this.#tileSize = 16;
    this.#scale = scale;

    this.#context = this.#canvas.getContext('2d') as CanvasRenderingContext2D;
    this.#preload = document.querySelector('#preload') as HTMLElement;
  }

  getPreloadedImage(path: string): CanvasImageSource {
    const image = this.#preload.querySelector(`[src$="${path}.png"]`);

    if (image === null) {
      console.error(`Missing image: ${path}.`);

      return e('canvas') as HTMLCanvasElement;
    }

    return image as HTMLImageElement;
  }

  render(rows: Tile[][] = this.#world.getRows()): void {
    const filterNeighbours = (
        tile: Tile,
        filter: (tile: Tile) => boolean,
        directions: Neighbouring[] = ['n', 'e', 's', 'w']
      ): Neighbouring[] =>
        directions.filter((direction: Neighbouring): boolean =>
          filter(this.#world.getNeighbour(tile, direction))
        ),
      putImage = (
        image: CanvasImageSource,
        offsetX: number,
        offsetY: number
      ): void => {
        this.#context.imageSmoothingEnabled = false;

        this.#context.drawImage(
          image,
          offsetX,
          offsetY,
          (image.width as number) * this.#scale,
          (image.height as number) * this.#scale
        );
      },
      drawImage = (
        path: string,
        x: number,
        y: number,
        augment: (image: CanvasImageSource) => CanvasImageSource = (image) =>
          image
      ): void => {
        const size = this.#tileSize * this.#scale,
          offsetX = x * size,
          offsetY = y * size,
          image = this.getPreloadedImage(path);

        putImage(augment(image), offsetX, offsetY);
      };

    rows.forEach((row: Tile[]) => {
      row.forEach((tile: Tile) => {
        const x = tile.x,
          y = tile.y,
          size = this.#tileSize * this.#scale,
          offsetX = x * size,
          offsetY = y * size;

        this.#context.fillStyle = '#000';
        this.#context.fillRect(offsetX, offsetY, size, size);

        if (tile.terrain._ === 'Unknown') {
          return;
        }

        if (tile.isLand) {
          drawImage('terrain/land', x, y);
        } else if (tile.isWater) {
          drawImage('terrain/ocean', x, y);

          const sprite = this.getPreloadedImage(
              'terrain/coast_sprite'
            ) as HTMLImageElement,
            // formula from: http://forums.civfanatics.com/showpost.php?p=13507808&postcount=40
            // Build a bit mask of all 8 surrounding tiles, setting the bit if the tile is not an
            // ocean tile. Starting with the tile to the left as the least significant bit and
            // going clockwise
            bitmask =
              (!this.#world.getNeighbour(tile, 'w').isWater ? 1 : 0) |
              (!this.#world.getNeighbour(tile, 'nw').isWater ? 2 : 0) |
              (!this.#world.getNeighbour(tile, 'n').isWater ? 4 : 0) |
              (!this.#world.getNeighbour(tile, 'nw').isWater ? 8 : 0) |
              (!this.#world.getNeighbour(tile, 'e').isWater ? 16 : 0) |
              (!this.#world.getNeighbour(tile, 'se').isWater ? 32 : 0) |
              (!this.#world.getNeighbour(tile, 's').isWater ? 64 : 0) |
              (!this.#world.getNeighbour(tile, 'sw').isWater ? 128 : 0);

          if (bitmask > 0) {
            // There are at least one surrounding tile that is not ocean, so we need to render
            // coast. We divide the tile into four 8x8 subtiles and for each of these we want
            // a 3 bit bitmask of the surrounding tiles. We do this by looking at the 3 least
            // significant bits for the top left subtile and shift the mask to the right as we
            // are going around the tile. This way we are "rotating" our bitmask. The result
            // are our x offsets into ter257.pic
            let topLeftSubtileOffset = bitmask & 7,
              topRightSubtileOffset = (bitmask >> 2) & 7,
              bottomRightSubtileOffset = (bitmask >> 4) & 7,
              bottomLeftSubtileOffset =
                ((bitmask >> 6) & 7) | ((bitmask & 1) << 2);

            this.#context.drawImage(
              sprite,
              topLeftSubtileOffset << 4,
              0,
              8,
              8,
              offsetX,
              offsetY,
              8 * this.#scale,
              8 * this.#scale
            );

            this.#context.drawImage(
              sprite,
              (topRightSubtileOffset << 4) + 8,
              0,
              8,
              8,
              offsetX + 8 * this.#scale,
              offsetY,
              8,
              8
            );

            this.#context.drawImage(
              sprite,
              (bottomRightSubtileOffset << 4) + 8,
              8,
              8,
              8,
              offsetX + 8 * this.#scale,
              offsetY + 8 * this.#scale,
              8 * this.#scale,
              8 * this.#scale
            );

            this.#context.drawImage(
              sprite,
              bottomLeftSubtileOffset << 4,
              8,
              8,
              8,
              offsetX + 8 * this.#scale,
              offsetY,
              8 * this.#scale,
              8 * this.#scale
            );
          }

          filterNeighbours(
            tile,
            (tile: Tile): boolean => tile.terrain._ === 'River'
          ).forEach((direction) =>
            drawImage(`terrain/river_mouth_${direction}`, x, y)
          );
        }

        type ImprovementLookup = {
          [Irrigation: string]: boolean;
          Mine: boolean;
          Road: boolean;
          Railroad: boolean;
          Pollution: boolean;
        };

        const improvements = tile.improvements.reduce(
          (
            state: ImprovementLookup,
            improvement: EntityInstance
          ): ImprovementLookup => {
            state[improvement._] = true;

            return state;
          },
          {
            Irrigation: false,
            Mine: false,
            Road: false,
            Railroad: false,
            Pollution: false,
          } as ImprovementLookup
        );

        if (improvements.Irrigation) {
          drawImage('improvements/irrigation', x, y);
        }

        const adjoining = filterNeighbours(
          tile,
          (adjoiningTile: Tile): boolean =>
            (tile.terrain._ === 'River' && adjoiningTile.isWater) ||
            tile.terrain._ === adjoiningTile.terrain._
        ).join('');

        if (adjoining && tile.terrain._ !== 'Ocean') {
          drawImage(
            `terrain/${tile.terrain._.toLowerCase()}_${adjoining}`,
            x,
            y
          );
        } else {
          drawImage(`terrain/${tile.terrain._.toLowerCase()}`, x, y);
        }

        ['Mine', 'Pollution'].forEach((improvementName: string) => {
          if (improvements[improvementName]) {
            drawImage(`improvements/${improvementName.toLowerCase()}`, x, y);
          }
        });

        if (improvements.Road) {
          const neighbouringRoad = filterNeighbours(
              tile,
              (adjoiningTile: Tile): boolean =>
                adjoiningTile.improvements.some(
                  (improvement: EntityInstance): boolean =>
                    improvement._ === 'Road'
                ),
              ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw']
            ),
            neighbouringRailroad = filterNeighbours(
              tile,
              (adjoiningTile: Tile): boolean =>
                adjoiningTile.improvements.some(
                  (improvement: EntityInstance): boolean =>
                    improvement._ === 'Railroad'
                ),
              ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw']
            );

          neighbouringRoad.forEach((direction: Neighbouring): void => {
            if (
              improvements.Railroad &&
              !neighbouringRailroad.includes(direction)
            ) {
              drawImage(`improvements/road_${direction}`, x, y);
            }
          });

          neighbouringRailroad.forEach((direction: Neighbouring): void =>
            drawImage(`improvements/railroad_${direction}`, x, y)
          );

          // TODO: render a dot or something like civ
        }

        const activeUnit = this.#activeUnit;

        if (
          tile.units.length > 0 &&
          (activeUnit !== null ? activeUnit.tile.id !== tile.id : true)
        ) {
          const [unit] = tile.units.sort(
              (a: Unit, b: Unit): number => b.defence.value - a.defence.value
            ),
            player = unit.player,
            civilization = player.civilization,
            [colors] = civilization.attributes.filter(
              (attribute) => attribute.name === 'colors'
            ),
            image = this.replaceColors(
              this.getPreloadedImage(`units/${unit._.toLowerCase()}`),
              ['#61e365', '#2c7900'],
              colors.value
            );

          if (tile.units.length > 1) {
            const size = this.#tileSize * this.#scale,
              offsetX = x * size,
              offsetY = y * size;

            putImage(image, offsetX - this.#scale, offsetY - this.#scale);
          }

          putImage(image, offsetX, offsetY);
        }

        if (tile.city) {
          const city = tile.city,
            player = city.player,
            civilization = player.civilization,
            [colors] = civilization.attributes.filter(
              (attribute) => attribute.name === 'colors'
            );

          this.#context.fillStyle = colors.value[0];
          this.#context.fillRect(offsetX, offsetY, size, size);

          drawImage(`map/city`, x, y, (image) =>
            this.replaceColors(image, ['#61e365', '#2c7900'], [colors.value[1]])
          );

          putImage(
            this.replaceColors(
              this.getPreloadedImage(`map/city`),
              ['#000'],
              [colors.value[1]]
            ),
            offsetX,
            offsetY
          );

          const sizeOffsetX = (this.#tileSize / 2) * this.#scale,
            sizeOffsetY = this.#tileSize * 0.75 * this.#scale,
            textOffsetX = (this.#tileSize / 2) * this.#scale,
            textOffsetY = this.#tileSize * this.#scale;

          this.#context.font = `bold ${10 * this.#scale}px sans-serif`;
          this.#context.fillStyle = 'black';
          this.#context.textAlign = 'center';
          this.#context.fillText(
            city.growth.size.toString(),
            offsetX + textOffsetX,
            offsetY + textOffsetY
          );
          this.#context.fillText(
            city.name,
            offsetX + sizeOffsetX,
            offsetY + sizeOffsetY
          );
          this.#context.fillStyle = 'white';
          this.#context.fillText(
            city.growth.size.toString(),
            offsetX + textOffsetX - 1,
            offsetY + textOffsetY - 1
          );
          this.#context.fillText(
            city.name,
            offsetX + sizeOffsetX - 1,
            offsetY + sizeOffsetY - 1
          );
        }

        filterNeighbours(
          tile,
          (tile) => tile.terrain._ === 'Unknown'
        ).forEach((direction) => drawImage(`map/fog_${direction}`, x, y));

        if (activeUnit !== null) {
          const player = activeUnit.player,
            civilization = player.civilization,
            [colors] = civilization.attributes.filter(
              (attribute) => attribute.name === 'colors'
            ),
            image = this.replaceColors(
              this.getPreloadedImage(`units/${activeUnit._.toLowerCase()}`),
              ['#61e365', '#2c7900'],
              colors.value
            );

          if (tile.units.length > 1) {
            const size = this.#tileSize * this.#scale,
              offsetX = x * size,
              offsetY = y * size;

            putImage(image, offsetX - this.#scale, offsetY - this.#scale);
          }

          putImage(image, offsetX, offsetY);
        }
      });
    });
  }

  replaceColors(
    image: CanvasImageSource,
    source: string[],
    replacement: string[]
  ) {
    const canvas = e('canvas') as HTMLCanvasElement,
      context = canvas.getContext('2d') as CanvasRenderingContext2D;

    context.drawImage(
      image,
      0,
      0,
      image.width as number,
      image.height as number
    );
    context.save();

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
          imageData.data[i + 2] === color.b
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
    context.save();

    return canvas;
  }

  scale(): number {
    return this.#scale;
  }

  tileSize(): number {
    return this.#tileSize;
  }
}

export default Map;
