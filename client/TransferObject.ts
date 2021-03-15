import DataObject from '@civ-clone/core-data-object/DataObject';

export class TransferObject extends DataObject {
  constructor(data: { [key: string]: any }) {
    super();

    // if `id` exists, skip it, as it'll break stuff
    const { id, ...rest } = data;

    Object.assign(this, rest);

    // @ts-ignore
    this.addKey(...Object.keys(data));
  }
}

export default TransferObject;
