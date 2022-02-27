import { EntityInstance, NeighbourDirection, Tile } from '../../types';
import TerrainAbstract from './TerrainAbstract.js';

type Improvement = 'Mine' | 'Pollution' | 'Railroad' | 'Road';

type ImprovementLookup = {
  [key in Improvement]: boolean;
};

export class Terrain extends TerrainAbstract {
  renderTile(tile: Tile): void {
    super.renderTile(tile);

    if (tile.terrain._ === 'Unknown') {
      return;
    }

    const { x, y } = tile;

    const improvements = tile.improvements.reduce(
      (
        state: ImprovementLookup,
        improvement: EntityInstance
      ): ImprovementLookup => {
        const improvementType = improvement._ as Improvement;

        if (!(improvementType in state)) {
          return state;
        }

        state[improvementType] = true;

        return state;
      },
      {
        Mine: false,
        Road: false,
        Railroad: false,
        Pollution: false,
      }
    );

    (['Mine', 'Pollution'] as (keyof ImprovementLookup)[]).forEach(
      (improvementName: keyof ImprovementLookup) => {
        if (improvements[improvementName]) {
          this.drawImage(`improvements/${improvementName.toLowerCase()}`, x, y);
        }
      }
    );

    // Can't have Railroad without Road!
    if (improvements.Road) {
      const neighbouringRoad = this.filterNeighbours(
          tile,
          (adjoiningTile: Tile): boolean =>
            adjoiningTile.improvements.some(
              (improvement: EntityInstance): boolean => improvement._ === 'Road'
            ),
          ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw']
        ),
        neighbouringRailroad = this.filterNeighbours(
          tile,
          (adjoiningTile: Tile): boolean =>
            adjoiningTile.improvements.some(
              (improvement: EntityInstance): boolean =>
                improvement._ === 'Railroad'
            ),
          ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw']
        );

      neighbouringRoad.forEach((direction: NeighbourDirection): void => {
        if (
          !improvements.Railroad ||
          !neighbouringRailroad.includes(direction)
        ) {
          this.drawImage(`improvements/road_${direction}`, x, y);
        }
      });

      neighbouringRailroad.forEach((direction: NeighbourDirection): void =>
        this.drawImage(`improvements/railroad_${direction}`, x, y)
      );

      // TODO: render a dot or something like civ
    }
  }
}

export default Terrain;
