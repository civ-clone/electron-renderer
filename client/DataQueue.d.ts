import { ObjectMap } from '@civ-clone/core-data-object/DataObject';
declare type DataPatchType = 'add' | 'remove' | 'update';
declare type DataPatchContents = {
  type: DataPatchType;
  index?: string | null;
  value?: (() => ObjectMap) | ObjectMap;
};
export declare type DataPatch = {
  [id: string]: DataPatchContents;
};
export declare class DataQueue {
  #private;
  add(
    targetId: string,
    value: DataPatchContents['value'],
    index?: DataPatchContents['index']
  ): void;
  clear(): void;
  remove(targetId: string, index?: DataPatchContents['index']): void;
  transferData(): DataPatch[];
  update(
    targetId: string,
    value: DataPatchContents['value'],
    index?: DataPatchContents['index']
  ): void;
}
export default DataQueue;
