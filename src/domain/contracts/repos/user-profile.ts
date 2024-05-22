export interface SaveUserPictureRepository {
  savePicture: (params: SaveUserPictureRepository.Input) => Promise<void>
}

export namespace SaveUserPictureRepository {
  export type Input = { pictureUrl: string | undefined }
}

export interface LoadUserProfileRepository {
  load: (params: LoadUserProfileRepository.Input) => Promise<void>
}

export namespace LoadUserProfileRepository {
  export type Input = { id: string }
}
