import { UUIDGenerator } from '@/domain/contracts/gateways'

export class UniqueId implements UUIDGenerator {
  constructor (private readonly date: Date) {}

  uuid ({ key }: UUIDGenerator.Input): UUIDGenerator.Output {
    return key
      .concat('_')
      .concat(this.date.getFullYear().toString().padStart(2, '0'))
      .concat(this.date.getMonth().toString().padStart(2, '0'))
      .concat(this.date.getDate().toString().padStart(2, '0'))
      .concat(this.date.getHours().toString().padStart(2, '0'))
      .concat(this.date.getMinutes().toString().padStart(2, '0'))
      .concat(this.date.getSeconds().toString().padStart(2, '0'))
  }
}
