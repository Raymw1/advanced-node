export interface LoadUserAccountRepository {
  load: (params: LoadUserAccountRepository.Input) => Promise<LoadUserAccountRepository.Output>
}

export namespace LoadUserAccountRepository {
  export type Input = {
    email: string
  }

  export type Output = {
    id: string
    name?: string
  } | undefined
}

export interface SaveFacebookAccountRepository {
  saveWithFacebook: (params: SaveFacebookAccountRepository.Input) => Promise<SaveFacebookAccountRepository.Output>
}

export namespace SaveFacebookAccountRepository {
  export type Input = {
    id?: string
    name: string
    email: string
    facebookId: string
  }

  export type Output = {
    id: string
  }
}
