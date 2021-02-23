import { Map } from '../Map.js';
export class Units extends Map {
    render(tiles = this.world().tiles(), activeUnit = null) {
        this.context().clearRect(0, 0, this.world().width() * this.tileSize(), this.world().height() * this.tileSize());
        tiles.forEach((tile) => {
            const x = tile.x, y = tile.y, size = this.tileSize(), offsetX = x * size, offsetY = y * size;
            if (tile.units.length > 0 &&
                (activeUnit !== null ? activeUnit.tile.id !== tile.id : true)) {
                const [unit] = tile.units.sort((a, b) => b.defence.value - a.defence.value), player = unit.player, civilization = player.civilization, [colors] = civilization.attributes.filter((attribute) => attribute.name === 'colors'), image = this.replaceColors(this.getPreloadedImage(`units/${unit._.toLowerCase()}`), ['#61e365', '#2c7900'], colors.value);
                if (tile.units.length > 1) {
                    this.putImage(image, offsetX - this.scale(), offsetY - this.scale());
                }
                this.putImage(image, offsetX, offsetY);
            }
        });
    }
}
export default Units;
//# sourceMappingURL=Units.js.map