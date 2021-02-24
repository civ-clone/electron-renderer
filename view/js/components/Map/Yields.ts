import Map from '../Map.js';
import { Tile } from '../../types';

export class Yields extends Map {
  render(tiles: Tile[] = this.world().tiles()): void {
    tiles.forEach((tile: Tile) => {
      const x = tile.x,
        y = tile.y,
        size = this.tileSize(),
        offsetX = x * size,
        offsetY = y * size,
        total = tile.yields.reduce(
          (total, tileYield) => total + tileYield.value,
          0
        );

      let i = 0;

      if (total < 5) {
        const offsets: [number, number][] = [
          [offsetX, offsetY],
          [offsetX + size / 2, offsetY],
          [offsetX, offsetY + size / 2],
          [offsetX + size / 2, offsetY + size / 2],
        ];

        tile.yields.forEach((tileYield) => {
          for (let n = 0; n < tileYield.value; n++) {
            this.putImage(
              this.getPreloadedImage(`city/${tileYield._.toLowerCase()}`),
              ...offsets[i++]
            );
          }
        });

        return;
      }

      if (total < 7) {
        const offsets: [number, number][] = [
          [offsetX, offsetY],
          [offsetX + size / 3, offsetY],
          [offsetX + (size / 3) * 2, offsetY],
          [offsetX, offsetY + size / 2],
          [offsetX + size / 3, offsetY + size / 2],
          [offsetX + (size / 3) * 2, offsetY + size / 2],
        ];

        tile.yields.forEach((tileYield) => {
          for (let n = 0; n < tileYield.value; n++) {
            this.putImage(
              this.getPreloadedImage(`city/${tileYield._.toLowerCase()}`),
              offsets[i][0],
              offsets[i++][1]
            );
          }
        });

        return;
      }

      if (total < 9) {
        const offsets: [number, number][] = [
          [offsetX, offsetY],
          [offsetX + size / 4, offsetY],
          [offsetX + (size / 4) * 2, offsetY],
          [offsetX + (size / 4) * 3, offsetY],
          [offsetX, offsetY + size / 2],
          [offsetX + size / 4, offsetY + size / 2],
          [offsetX + (size / 4) * 2, offsetY + size / 2],
          [offsetX + (size / 4) * 3, offsetY + size / 2],
        ];

        tile.yields.forEach((tileYield) => {
          for (let n = 0; n < tileYield.value; n++) {
            this.putImage(
              this.getPreloadedImage(`city/${tileYield._.toLowerCase()}`),
              ...offsets[i++]
            );
          }
        });

        return;
      }

      if (total < 11) {
        const offsets: [number, number][] = [
          [offsetX, offsetY],
          [offsetX + size / 5, offsetY],
          [offsetX + (size / 5) * 2, offsetY],
          [offsetX + (size / 5) * 3, offsetY],
          [offsetX + (size / 5) * 4, offsetY],
          [offsetX, offsetY + size / 2],
          [offsetX + size / 5, offsetY + size / 2],
          [offsetX + (size / 5) * 2, offsetY + size / 2],
          [offsetX + (size / 5) * 3, offsetY + size / 2],
          [offsetX + (size / 5) * 4, offsetY + size / 2],
        ];

        tile.yields.forEach((tileYield) => {
          for (let n = 0; n < tileYield.value; n++) {
            this.putImage(
              this.getPreloadedImage(`city/${tileYield._.toLowerCase()}`),
              ...offsets[i++]
            );
          }
        });

        return;
      }

      if (total < 13) {
        const offsets: [number, number][] = [
          [offsetX, offsetY],
          [offsetX + size / 6, offsetY],
          [offsetX + (size / 6) * 2, offsetY],
          [offsetX + (size / 6) * 3, offsetY],
          [offsetX + (size / 6) * 4, offsetY],
          [offsetX + (size / 6) * 5, offsetY],
          [offsetX, offsetY + size / 2],
          [offsetX + size / 6, offsetY + size / 2],
          [offsetX + (size / 6) * 2, offsetY + size / 2],
          [offsetX + (size / 6) * 3, offsetY + size / 2],
          [offsetX + (size / 6) * 4, offsetY + size / 2],
          [offsetX + (size / 6) * 5, offsetY + size / 2],
        ];

        tile.yields.forEach((tileYield) => {
          for (let n = 0; n < tileYield.value; n++) {
            this.putImage(
              this.getPreloadedImage(`city/${tileYield._.toLowerCase()}`),
              ...offsets[i++]
            );
          }
        });

        return;
      }
    });
  }
}
export default Yields;
