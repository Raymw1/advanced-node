export interface SaveUserPictureRepository {
  savePicture: (params: SaveUserPictureRepository.Input) => Promise<void>
}

export namespace SaveUserPictureRepository {
  export type Input = {
    id: string
    pictureUrl: string | undefined
    initials: string | undefined
  }
}

export interface LoadUserProfileRepository {
  load: (params: LoadUserProfileRepository.Input) => Promise<LoadUserProfileRepository.Outuput>
}

export namespace LoadUserProfileRepository {
  export type Input = { id: string }
  export type Outuput = { name?: string }
}
