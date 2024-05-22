export interface UploadFile {
  upload: (params: UploadFile.Input) => Promise<UploadFile.Output>
}

export namespace UploadFile {
  export type Input = { file: Buffer, key: string }
  export type Output = { fileUrl: string }
}
