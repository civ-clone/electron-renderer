var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Map_activeUnit, _Map_canvas, _Map_context, _Map_visible, _Map_preload, _Map_scale, _Map_tileSize, _Map_world;
import { e } from '../lib/html.js';
export class Map {
    constructor(world, canvas = e('canvas'), activeUnit = null, scale = 2) {
        _Map_activeUnit.set(this, void 0);
        _Map_canvas.set(this, void 0);
        _Map_context.set(this, void 0);
        _Map_visible.set(this, true);
        _Map_preload.set(this, void 0);
        _Map_scale.set(this, void 0);
        _Map_tileSize.set(this, void 0);
        _Map_world.set(this, void 0);
        __classPrivateFieldSet(this, _Map_activeUnit, activeUnit, "f");
        __classPrivateFieldSet(this, _Map_canvas, canvas, "f");
        __classPrivateFieldSet(this, _Map_world, world, "f");
        __classPrivateFieldSet(this, _Map_tileSize, 16, "f");
        __classPrivateFieldSet(this, _Map_scale, scale, "f");
        this.setCanvasSize();
        __classPrivateFieldSet(this, _Map_context, __classPrivateFieldGet(this, _Map_canvas, "f").getContext('2d'), "f");
        __classPrivateFieldSet(this, _Map_preload, document.querySelector('#preload'), "f");
    }
    canvas() {
        return __classPrivateFieldGet(this, _Map_canvas, "f");
    }
    clear() {
        this.context().clearRect(0, 0, this.canvas().width, this.canvas().height);
    }
    context() {
        return __classPrivateFieldGet(this, _Map_context, "f");
    }
    render(...args) {
        throw new TypeError('Map#render must be overridden.');
    }
    scale() {
        return __classPrivateFieldGet(this, _Map_scale, "f");
    }
    tileSize() {
        return __classPrivateFieldGet(this, _Map_tileSize, "f") * __classPrivateFieldGet(this, _Map_scale, "f");
    }
    world() {
        return __classPrivateFieldGet(this, _Map_world, "f");
    }
    drawImage(path, x, y, augment = (image) => image) {
        const size = this.tileSize(), offsetX = x * size, offsetY = y * size, image = this.getPreloadedImage(path);
        this.putImage(augment(image), offsetX, offsetY);
    }
    filterNeighbours(tile, filter, directions = ['n', 'e', 's', 'w']) {
        return directions.filter((direction) => filter(__classPrivateFieldGet(this, _Map_world, "f").getNeighbour(tile, direction)));
    }
    getPreloadedImage(path) {
        const image = __classPrivateFieldGet(this, _Map_preload, "f").querySelector(`[src$="${path}.png"]`);
        if (image === null) {
            console.error(`Missing image: ${path}.`);
            return e('canvas');
        }
        return image;
    }
    putImage(image, offsetX, offsetY) {
        __classPrivateFieldGet(this, _Map_context, "f").imageSmoothingEnabled = false;
        __classPrivateFieldGet(this, _Map_context, "f").drawImage(image, offsetX, offsetY, image.width * __classPrivateFieldGet(this, _Map_scale, "f"), image.height * __classPrivateFieldGet(this, _Map_scale, "f"));
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
        __classPrivateFieldGet(this, _Map_canvas, "f").height = __classPrivateFieldGet(this, _Map_world, "f").height() * this.tileSize();
        __classPrivateFieldGet(this, _Map_canvas, "f").width = __classPrivateFieldGet(this, _Map_world, "f").width() * this.tileSize();
        // this.#canvas.setAttribute('height', this.#canvas.height.toString());
        // this.#canvas.setAttribute('width',this.#canvas.width.toString());
    }
    isVisible() {
        return __classPrivateFieldGet(this, _Map_visible, "f");
    }
    setVisible(visible) {
        __classPrivateFieldSet(this, _Map_visible, visible, "f");
    }
}
_Map_activeUnit = new WeakMap(), _Map_canvas = new WeakMap(), _Map_context = new WeakMap(), _Map_visible = new WeakMap(), _Map_preload = new WeakMap(), _Map_scale = new WeakMap(), _Map_tileSize = new WeakMap(), _Map_world = new WeakMap();
export default Map;
//# sourceMappingURL=Map.js.map