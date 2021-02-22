var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _activeUnit, _canvas, _context, _preload, _scale, _tileSize, _world;
import { e } from '../lib/html.js';
export class Map {
    constructor(world, canvas, activeUnit = null, scale = 2) {
        _activeUnit.set(this, void 0);
        _canvas.set(this, void 0);
        _context.set(this, void 0);
        _preload.set(this, void 0);
        _scale.set(this, void 0);
        _tileSize.set(this, void 0);
        _world.set(this, void 0);
        __classPrivateFieldSet(this, _activeUnit, activeUnit);
        __classPrivateFieldSet(this, _canvas, canvas);
        __classPrivateFieldSet(this, _world, world);
        __classPrivateFieldSet(this, _tileSize, 16);
        __classPrivateFieldSet(this, _scale, scale);
        __classPrivateFieldSet(this, _context, __classPrivateFieldGet(this, _canvas).getContext('2d'));
        __classPrivateFieldSet(this, _preload, document.querySelector('#preload'));
    }
    getPreloadedImage(path) {
        const image = __classPrivateFieldGet(this, _preload).querySelector(`[src$="${path}.png"]`);
        if (image === null) {
            console.error(`Missing image: ${path}.`);
            return e('canvas');
        }
        return image;
    }
    render(rows = __classPrivateFieldGet(this, _world).getRows()) {
        const filterNeighbours = (tile, filter, directions = ['n', 'e', 's', 'w']) => directions.filter((direction) => filter(__classPrivateFieldGet(this, _world).getNeighbour(tile, direction))), putImage = (image, offsetX, offsetY) => {
            __classPrivateFieldGet(this, _context).imageSmoothingEnabled = false;
            __classPrivateFieldGet(this, _context).drawImage(image, offsetX, offsetY, image.width * __classPrivateFieldGet(this, _scale), image.height * __classPrivateFieldGet(this, _scale));
        }, drawImage = (path, x, y, augment = (image) => image) => {
            const size = __classPrivateFieldGet(this, _tileSize) * __classPrivateFieldGet(this, _scale), offsetX = x * size, offsetY = y * size, image = this.getPreloadedImage(path);
            putImage(augment(image), offsetX, offsetY);
        };
        rows.forEach((row) => {
            row.forEach((tile) => {
                const x = tile.x, y = tile.y, size = __classPrivateFieldGet(this, _tileSize) * __classPrivateFieldGet(this, _scale), offsetX = x * size, offsetY = y * size;
                __classPrivateFieldGet(this, _context).fillStyle = '#000';
                __classPrivateFieldGet(this, _context).fillRect(offsetX, offsetY, size, size);
                if (tile.terrain._ === 'Unknown') {
                    return;
                }
                if (tile.isLand) {
                    drawImage('terrain/land', x, y);
                }
                else if (tile.isWater) {
                    drawImage('terrain/ocean', x, y);
                    const sprite = this.getPreloadedImage('terrain/coast_sprite'), 
                    // formula from: http://forums.civfanatics.com/showpost.php?p=13507808&postcount=40
                    // Build a bit mask of all 8 surrounding tiles, setting the bit if the tile is not an
                    // ocean tile. Starting with the tile to the left as the least significant bit and
                    // going clockwise
                    bitmask = (!__classPrivateFieldGet(this, _world).getNeighbour(tile, 'w').isWater ? 1 : 0) |
                        (!__classPrivateFieldGet(this, _world).getNeighbour(tile, 'nw').isWater ? 2 : 0) |
                        (!__classPrivateFieldGet(this, _world).getNeighbour(tile, 'n').isWater ? 4 : 0) |
                        (!__classPrivateFieldGet(this, _world).getNeighbour(tile, 'nw').isWater ? 8 : 0) |
                        (!__classPrivateFieldGet(this, _world).getNeighbour(tile, 'e').isWater ? 16 : 0) |
                        (!__classPrivateFieldGet(this, _world).getNeighbour(tile, 'se').isWater ? 32 : 0) |
                        (!__classPrivateFieldGet(this, _world).getNeighbour(tile, 's').isWater ? 64 : 0) |
                        (!__classPrivateFieldGet(this, _world).getNeighbour(tile, 'sw').isWater ? 128 : 0);
                    if (bitmask > 0) {
                        // There are at least one surrounding tile that is not ocean, so we need to render
                        // coast. We divide the tile into four 8x8 subtiles and for each of these we want
                        // a 3 bit bitmask of the surrounding tiles. We do this by looking at the 3 least
                        // significant bits for the top left subtile and shift the mask to the right as we
                        // are going around the tile. This way we are "rotating" our bitmask. The result
                        // are our x offsets into ter257.pic
                        let topLeftSubtileOffset = bitmask & 7, topRightSubtileOffset = (bitmask >> 2) & 7, bottomRightSubtileOffset = (bitmask >> 4) & 7, bottomLeftSubtileOffset = ((bitmask >> 6) & 7) | ((bitmask & 1) << 2);
                        __classPrivateFieldGet(this, _context).drawImage(sprite, topLeftSubtileOffset << 4, 0, 8, 8, offsetX, offsetY, 8 * __classPrivateFieldGet(this, _scale), 8 * __classPrivateFieldGet(this, _scale));
                        __classPrivateFieldGet(this, _context).drawImage(sprite, (topRightSubtileOffset << 4) + 8, 0, 8, 8, offsetX + 8 * __classPrivateFieldGet(this, _scale), offsetY, 8, 8);
                        __classPrivateFieldGet(this, _context).drawImage(sprite, (bottomRightSubtileOffset << 4) + 8, 8, 8, 8, offsetX + 8 * __classPrivateFieldGet(this, _scale), offsetY + 8 * __classPrivateFieldGet(this, _scale), 8 * __classPrivateFieldGet(this, _scale), 8 * __classPrivateFieldGet(this, _scale));
                        __classPrivateFieldGet(this, _context).drawImage(sprite, bottomLeftSubtileOffset << 4, 8, 8, 8, offsetX + 8 * __classPrivateFieldGet(this, _scale), offsetY, 8 * __classPrivateFieldGet(this, _scale), 8 * __classPrivateFieldGet(this, _scale));
                    }
                    filterNeighbours(tile, (tile) => tile.terrain._ === 'River').forEach((direction) => drawImage(`terrain/river_mouth_${direction}`, x, y));
                }
                const improvements = tile.improvements.reduce((state, improvement) => {
                    state[improvement._] = true;
                    return state;
                }, {
                    Irrigation: false,
                    Mine: false,
                    Road: false,
                    Railroad: false,
                    Pollution: false,
                });
                if (improvements.Irrigation) {
                    drawImage('improvements/irrigation', x, y);
                }
                const adjoining = filterNeighbours(tile, (adjoiningTile) => (tile.terrain._ === 'River' && adjoiningTile.isWater) ||
                    tile.terrain._ === adjoiningTile.terrain._).join('');
                if (adjoining && tile.terrain._ !== 'Ocean') {
                    drawImage(`terrain/${tile.terrain._.toLowerCase()}_${adjoining}`, x, y);
                }
                else {
                    drawImage(`terrain/${tile.terrain._.toLowerCase()}`, x, y);
                }
                ['Mine', 'Pollution'].forEach((improvementName) => {
                    if (improvements[improvementName]) {
                        drawImage(`improvements/${improvementName.toLowerCase()}`, x, y);
                    }
                });
                if (improvements.Road) {
                    const neighbouringRoad = filterNeighbours(tile, (adjoiningTile) => adjoiningTile.improvements.some((improvement) => improvement._ === 'Road'), ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw']), neighbouringRailroad = filterNeighbours(tile, (adjoiningTile) => adjoiningTile.improvements.some((improvement) => improvement._ === 'Railroad'), ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw']);
                    neighbouringRoad.forEach((direction) => {
                        if (improvements.Railroad &&
                            !neighbouringRailroad.includes(direction)) {
                            drawImage(`improvements/road_${direction}`, x, y);
                        }
                    });
                    neighbouringRailroad.forEach((direction) => drawImage(`improvements/railroad_${direction}`, x, y));
                    // TODO: render a dot or something like civ
                }
                const activeUnit = __classPrivateFieldGet(this, _activeUnit);
                if (tile.units.length > 0 &&
                    (activeUnit !== null ? activeUnit.tile.id !== tile.id : true)) {
                    const [unit] = tile.units.sort((a, b) => b.defence.value - a.defence.value), player = unit.player, civilization = player.civilization, [colors] = civilization.attributes.filter((attribute) => attribute.name === 'colors'), image = this.replaceColors(this.getPreloadedImage(`units/${unit._.toLowerCase()}`), ['#61e365', '#2c7900'], colors.value);
                    if (tile.units.length > 1) {
                        const size = __classPrivateFieldGet(this, _tileSize) * __classPrivateFieldGet(this, _scale), offsetX = x * size, offsetY = y * size;
                        putImage(image, offsetX - __classPrivateFieldGet(this, _scale), offsetY - __classPrivateFieldGet(this, _scale));
                    }
                    putImage(image, offsetX, offsetY);
                }
                if (tile.city) {
                    const city = tile.city, player = city.player, civilization = player.civilization, [colors] = civilization.attributes.filter((attribute) => attribute.name === 'colors');
                    __classPrivateFieldGet(this, _context).fillStyle = colors.value[0];
                    __classPrivateFieldGet(this, _context).fillRect(offsetX, offsetY, size, size);
                    drawImage(`map/city`, x, y, (image) => this.replaceColors(image, ['#61e365', '#2c7900'], [colors.value[1]]));
                    putImage(this.replaceColors(this.getPreloadedImage(`map/city`), ['#000'], [colors.value[1]]), offsetX, offsetY);
                    const sizeOffsetX = (__classPrivateFieldGet(this, _tileSize) / 2) * __classPrivateFieldGet(this, _scale), sizeOffsetY = __classPrivateFieldGet(this, _tileSize) * 0.75 * __classPrivateFieldGet(this, _scale), textOffsetX = (__classPrivateFieldGet(this, _tileSize) / 2) * __classPrivateFieldGet(this, _scale), textOffsetY = __classPrivateFieldGet(this, _tileSize) * __classPrivateFieldGet(this, _scale);
                    __classPrivateFieldGet(this, _context).font = `bold ${10 * __classPrivateFieldGet(this, _scale)}px sans-serif`;
                    __classPrivateFieldGet(this, _context).fillStyle = 'black';
                    __classPrivateFieldGet(this, _context).textAlign = 'center';
                    __classPrivateFieldGet(this, _context).fillText(city.growth.size.toString(), offsetX + textOffsetX, offsetY + textOffsetY);
                    __classPrivateFieldGet(this, _context).fillText(city.name, offsetX + sizeOffsetX, offsetY + sizeOffsetY);
                    __classPrivateFieldGet(this, _context).fillStyle = 'white';
                    __classPrivateFieldGet(this, _context).fillText(city.growth.size.toString(), offsetX + textOffsetX - 1, offsetY + textOffsetY - 1);
                    __classPrivateFieldGet(this, _context).fillText(city.name, offsetX + sizeOffsetX - 1, offsetY + sizeOffsetY - 1);
                }
                filterNeighbours(tile, (tile) => tile.terrain._ === 'Unknown').forEach((direction) => drawImage(`map/fog_${direction}`, x, y));
                if (activeUnit !== null) {
                    const player = activeUnit.player, civilization = player.civilization, [colors] = civilization.attributes.filter((attribute) => attribute.name === 'colors'), image = this.replaceColors(this.getPreloadedImage(`units/${activeUnit._.toLowerCase()}`), ['#61e365', '#2c7900'], colors.value);
                    if (tile.units.length > 1) {
                        const size = __classPrivateFieldGet(this, _tileSize) * __classPrivateFieldGet(this, _scale), offsetX = x * size, offsetY = y * size;
                        putImage(image, offsetX - __classPrivateFieldGet(this, _scale), offsetY - __classPrivateFieldGet(this, _scale));
                    }
                    putImage(image, offsetX, offsetY);
                }
            });
        });
    }
    replaceColors(image, source, replacement) {
        const canvas = e('canvas'), context = canvas.getContext('2d');
        context.drawImage(image, 0, 0, image.width, image.height);
        context.save();
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height), getColor = (input) => {
            var _a;
            let match = null, color = {
                r: 0,
                g: 0,
                b: 0,
                a: 0,
            };
            if (typeof input === 'string') {
                if ((match = input.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i)) !== null) {
                    color = {
                        r: parseInt(match[1], 16),
                        g: parseInt(match[2], 16),
                        b: parseInt(match[3], 16),
                        a: 1,
                    };
                }
                else if ((match = input.match(/^#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])$/)) !== null) {
                    color = {
                        r: parseInt(match[1] + match[1], 16),
                        g: parseInt(match[2] + match[2], 16),
                        b: parseInt(match[3] + match[3], 16),
                        a: 1,
                    };
                }
                else if ((match = input.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/)) !== null) {
                    color = {
                        r: parseInt(match[1]),
                        g: parseInt(match[2]),
                        b: parseInt(match[3]),
                        a: 1,
                    };
                }
                else if ((match = input.match(/^rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+|\d+\.|\.\d+|\d+\.\d+)\s*\)\s*$/)) !== null) {
                    color = {
                        r: parseInt(match[1]),
                        g: parseInt(match[2]),
                        b: parseInt(match[3]),
                        a: parseFloat((_a = match[4]) !== null && _a !== void 0 ? _a : 1),
                    };
                }
            }
            else if ('length' in input) {
                color = {
                    r: input[0] || 0,
                    g: input[1] || 0,
                    b: input[2] || 0,
                    a: input[3] || 1,
                };
            }
            return color;
        };
        let sourceColors = source.map(getColor), replaceColors = replacement.map(getColor);
        for (let i = 0; i < imageData.data.length; i += 4) {
            sourceColors.forEach((color, n) => {
                if (imageData.data[i] === color.r &&
                    imageData.data[i + 1] === color.g &&
                    imageData.data[i + 2] === color.b) {
                    imageData.data[i] = (replaceColors[n] || replaceColors[0]).r;
                    imageData.data[i + 1] = (replaceColors[n] || replaceColors[0]).g;
                    imageData.data[i + 2] = (replaceColors[n] || replaceColors[0]).b;
                    imageData.data[i + 3] = Math.trunc((replaceColors[n] || replaceColors[0]).a * 255);
                }
            });
        }
        context.putImageData(imageData, 0, 0);
        context.save();
        return canvas;
    }
    scale() {
        return __classPrivateFieldGet(this, _scale);
    }
    tileSize() {
        return __classPrivateFieldGet(this, _tileSize);
    }
}
_activeUnit = new WeakMap(), _canvas = new WeakMap(), _context = new WeakMap(), _preload = new WeakMap(), _scale = new WeakMap(), _tileSize = new WeakMap(), _world = new WeakMap();
export default Map;
//# sourceMappingURL=Map.js.map