import { PlainObject } from './reconstituteData.js';

export const applyPatch = (patch: PlainObject, to: PlainObject): void => {
  Object.entries(patch).forEach(([key, value]: [string, any]) => {
    if (value === undefined) {
      delete to[key];

      return;
    }

    if (Array.isArray(value)) {
      to[key] = value;

      return;
    }

    // exclude `null`
    if (
      to[key] !== null &&
      typeof to[key] === 'object' &&
      value !== null &&
      typeof value === 'object'
    ) {
      applyPatch(value, to[key]);

      return;
    }

    to[key] = value;
  });
};

export default applyPatch;
