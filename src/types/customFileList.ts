export type CustomFileList = {
  [key: number]: File;
  length: number;
  item(index: number): File | null;
  [Symbol.iterator](): IterableIterator<File>;
};
