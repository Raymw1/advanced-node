import { UUIDGenerator } from '@/domain/contracts/gateways'

import { v4 } from 'uuid'

export class UUIDHandler implements UUIDGenerator {
  uuid (input: UUIDGenerator.Input): UUIDGenerator.Output {
    v4()
    return 'invalid_uuid'
  }
}
