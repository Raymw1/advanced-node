import { TokenValidator } from '@/domain/contracts/crypto'

type Setup = (crypto: Readonly<TokenValidator>) => Authorize
type Input = { token: string }
export type Authorize = (params: Input) => Promise<void>

export const setupAuthorize: Setup = (crypto) => async params => {
  await crypto.validateToken(params)
}
