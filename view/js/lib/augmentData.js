export const augmentData = (store, patch, seenObjects = []) => {
    Object.entries(patch).forEach(([key, value]) => {
        var _a;
        if ((value && ((_a = value['#delete']) !== null && _a !== void 0 ? _a : false)) === true) {
            delete store[key];
            return;
        }
        if (key in store &&
            !Array.isArray(value) &&
            typeof store[key] === 'object' &&
            store[key] !== null &&
            typeof value === 'object' &&
            value !== null &&
            !seenObjects.includes(value)) {
            seenObjects.push(value);
            augmentData(store[key], value, seenObjects);
            return;
        }
        store[key] = value;
    });
};
export default augmentData;
//# sourceMappingURL=augmentData.js.map