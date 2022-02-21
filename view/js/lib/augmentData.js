export const augmentData = (store, patch, seenObjects = []) => {
    Object.entries(patch).forEach(([key, value]) => {
        if (key in store &&
            !Array.isArray(value) &&
            typeof store[key] === 'object' &&
            store[key] !== null &&
            typeof value === 'object' &&
            value !== null &&
            !seenObjects.includes(value)) {
            augmentData(store[key], value, seenObjects);
            return;
        }
        seenObjects.push(value);
        store[key] = value;
    });
};
export default augmentData;
//# sourceMappingURL=augmentData.js.map