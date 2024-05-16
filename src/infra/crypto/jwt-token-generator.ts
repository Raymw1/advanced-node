import { TokenGenerator } from '@/data/contracts/crypto'
import { sign } from 'jsonwebtoken'

type GenerateTokenParams = TokenGenerator.Params
type GenerateTokenResult = TokenGenerator.Result

export class JwtTokenGenerator implements TokenGenerator {
  constructor (private readonly secret: string) {}

  async generateToken ({ expirationInMs, key }: GenerateTokenParams): Promise<GenerateTokenResult> {
    const expirationInSeconds = expirationInMs / 1000
    return sign({ key }, this.secret, { expiresIn: expirationInSeconds })
  }
}
