import { TokenGenerator } from '@/data/contracts/crypto'
import { sign } from 'jsonwebtoken'

export class JwtTokenGenerator {
  constructor (private readonly secret: string) {}

  async generateToken (params: TokenGenerator.Params): Promise<void> {
    const expirationInSeconds = params.expirationInMs / 1000
    sign({ key: params.key }, this.secret, { expiresIn: expirationInSeconds })
  }
}
