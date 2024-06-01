import { UUIDGenerator } from '@/domain/contracts/gateways'

export class UniqueId implements UUIDGenerator {
  uuid ({ key }: UUIDGenerator.Input): UUIDGenerator.Output {
    const date = new Date()
    return key
      .concat('_')
      .concat(date.getFullYear().toString().padStart(2, '0'))
      .concat(date.getMonth().toString().padStart(2, '0'))
      .concat(date.getDate().toString().padStart(2, '0'))
      .concat(date.getHours().toString().padStart(2, '0'))
      .concat(date.getMinutes().toString().padStart(2, '0'))
      .concat(date.getSeconds().toString().padStart(2, '0'))
  }
}
