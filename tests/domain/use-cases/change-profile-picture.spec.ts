import { UploadFile } from '@/domain/contracts/gateways'
import { setupChangeProfilePicture } from '@/domain/use-cases'

import { mock } from 'jest-mock-extended'

describe('ChangeProfilePicture', () => {
  it('should call UploadFile with correct input', async () => {
    const file = Buffer.from('any_buffer')
    const fileStorage = mock<UploadFile>()
    const sut = setupChangeProfilePicture(fileStorage)

    await sut({ userId: 'any_id', file })

    expect(fileStorage.upload).toHaveBeenCalledTimes(1)
    expect(fileStorage.upload).toHaveBeenCalledWith({ file, key: 'any_id' })
  })
})
