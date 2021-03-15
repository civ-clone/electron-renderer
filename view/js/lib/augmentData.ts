export const augmentData = (
  store: { [key: string]: any },
  patch: { [key: string]: any },
  seenObjects: any[] = []
): void => {
  Object.entries(patch).forEach(([key, value]) => {
    if ((value && (value['#delete'] ?? false)) === true) {
      delete store[key];

      return;
    }

    if (
      key in store &&
      !Array.isArray(value) &&
      typeof store[key] === 'object' &&
      store[key] !== null &&
      typeof value === 'object' &&
      value !== null &&
      !seenObjects.includes(value)
    ) {
      seenObjects.push(value);

      augmentData(store[key], value, seenObjects);

      return;
    }

    store[key] = value;
  });
};

export default augmentData;
