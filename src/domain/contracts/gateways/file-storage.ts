export interface UploadFile {
  upload: (params: UploadFile.Input) => Promise<UploadFile.Output>
}

export namespace UploadFile {
  export type Input = { file: Buffer, key: string }
  export type Output = { fileUrl: string }
}

export interface DeleteFile {
  delete: (params: DeleteFile.Input) => Promise<void>
}

export namespace DeleteFile {
  export type Input = { key: string }
}
