export interface UploadFile {
  upload: (params: UploadFile.Input) => Promise<void>
}

export namespace UploadFile {
  export type Input = { file: Buffer, key: string }
}
