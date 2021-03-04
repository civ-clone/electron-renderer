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
var _activeUnit, _canvas, _context, _visible, _preload, _scale, _tileSize, _world;
import { e } from '../lib/html.js';
export class Map {
    constructor(world, canvas = e('canvas'), activeUnit = null, scale = 2) {
        _activeUnit.set(this, void 0);
        _canvas.set(this, void 0);
        _context.set(this, void 0);
        _visible.set(this, true);
        _preload.set(this, void 0);
        _scale.set(this, void 0);
        _tileSize.set(this, void 0);
        _world.set(this, void 0);
        __classPrivateFieldSet(this, _activeUnit, activeUnit);
        __classPrivateFieldSet(this, _canvas, canvas);
        __classPrivateFieldSet(this, _world, world);
        __classPrivateFieldSet(this, _tileSize, 16);
        __classPrivateFieldSet(this, _scale, scale);
        this.setCanvasSize();
        __classPrivateFieldSet(this, _context, __classPrivateFieldGet(this, _canvas).getContext('2d'));
        __classPrivateFieldSet(this, _preload, document.querySelector('#preload'));
    }
    canvas() {
        return __classPrivateFieldGet(this, _canvas);
    }
    clear() {
        this.context().clearRect(0, 0, this.canvas().width, this.canvas().height);
    }
    context() {
        return __classPrivateFieldGet(this, _context);
    }
    render(...args) {
        throw new TypeError('Map#render must be overridden.');
    }
    scale() {
        return __classPrivateFieldGet(this, _scale);
    }
    tileSize() {
        return __classPrivateFieldGet(this, _tileSize) * __classPrivateFieldGet(this, _scale);
    }
    world() {
        return __classPrivateFieldGet(this, _world);
    }
    drawImage(path, x, y, augment = (image) => image) {
        const size = this.tileSize(), offsetX = x * size, offsetY = y * size, image = this.getPreloadedImage(path);
        this.putImage(augment(image), offsetX, offsetY);
    }
    filterNeighbours(tile, filter, directions = ['n', 'e', 's', 'w']) {
        return directions.filter((direction) => filter(__classPrivateFieldGet(this, _world).getNeighbour(tile, direction)));
    }
    getPreloadedImage(path) {
        const image = __classPrivateFieldGet(this, _preload).querySelector(`[src$="${path}.png"]`);
        if (image === null) {
            console.error(`Missing image: ${path}.`);
            return e('canvas');
        }
        return image;
    }
    putImage(image, offsetX, offsetY) {
        __classPrivateFieldGet(this, _context).imageSmoothingEnabled = false;
        __classPrivateFieldGet(this, _context).drawImage(image, offsetX, offsetY, image.width * __classPrivateFieldGet(this, _scale), image.height * __classPrivateFieldGet(this, _scale));
    }
    replaceColors(image, source, replacement) {
        const canvas = e('canvas'), context = canvas.getContext('2d');
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0, image.width, image.height);
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
                    imageData.data[i + 2] === color.b &&
                    imageData.data[i + 3] === color.a * 255) {
                    imageData.data[i] = (replaceColors[n] || replaceColors[0]).r;
                    imageData.data[i + 1] = (replaceColors[n] || replaceColors[0]).g;
                    imageData.data[i + 2] = (replaceColors[n] || replaceColors[0]).b;
                    imageData.data[i + 3] = Math.trunc((replaceColors[n] || replaceColors[0]).a * 255);
                }
            });
        }
        context.putImageData(imageData, 0, 0);
        return canvas;
    }
    setCanvasSize() {
        __classPrivateFieldGet(this, _canvas).height = __classPrivateFieldGet(this, _world).height() * this.tileSize();
        __classPrivateFieldGet(this, _canvas).width = __classPrivateFieldGet(this, _world).width() * this.tileSize();
        // this.#canvas.setAttribute('height', this.#canvas.height.toString());
        // this.#canvas.setAttribute('width',this.#canvas.width.toString());
    }
    isVisible() {
        return __classPrivateFieldGet(this, _visible);
    }
    setVisible(visible) {
        __classPrivateFieldSet(this, _visible, visible);
    }
}
_activeUnit = new WeakMap(), _canvas = new WeakMap(), _context = new WeakMap(), _visible = new WeakMap(), _preload = new WeakMap(), _scale = new WeakMap(), _tileSize = new WeakMap(), _world = new WeakMap();
export default Map;
//# sourceMappingURL=Map.js.map