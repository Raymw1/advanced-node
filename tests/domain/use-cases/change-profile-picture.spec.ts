import { UUIDGenerator, UploadFile } from '@/domain/contracts/gateways'
import { setupChangeProfilePicture } from '@/domain/use-cases'

import { mock } from 'jest-mock-extended'

describe('ChangeProfilePicture', () => {
  it('should call UploadFile with correct input', async () => {
    const uuid = 'any_unique_id'
    const file = Buffer.from('any_buffer')
    const fileStorage = mock<UploadFile>()
    const crypto = mock<UUIDGenerator>()
    crypto.uuid.mockReturnValueOnce(uuid)
    const sut = setupChangeProfilePicture(fileStorage, crypto)

    await sut({ userId: 'any_id', file })

    expect(fileStorage.upload).toHaveBeenCalledTimes(1)
    expect(fileStorage.upload).toHaveBeenCalledWith({ file, key: uuid })
  })
})
