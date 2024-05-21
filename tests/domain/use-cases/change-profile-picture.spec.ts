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

  it('should throw if UploadFile throws', async () => {
    const file = Buffer.from('any_buffer')
    const fileStorage = mock<UploadFile>()
    fileStorage.upload.mockRejectedValueOnce(new Error('upload_error'))
    const crypto = mock<UUIDGenerator>()
    const sut = setupChangeProfilePicture(fileStorage, crypto)

    const promise = sut({ userId: 'any_id', file })

    await expect(promise).rejects.toThrow(new Error('upload_error'))
  })

  it('should call UUIDGenerator with correct input', async () => {
    const file = Buffer.from('any_buffer')
    const fileStorage = mock<UploadFile>()
    const crypto = mock<UUIDGenerator>()
    const sut = setupChangeProfilePicture(fileStorage, crypto)

    await sut({ userId: 'any_id', file })

    expect(crypto.uuid).toHaveBeenCalledTimes(1)
    expect(crypto.uuid).toHaveBeenCalledWith({ key: 'any_id' })
  })

  it('should throw if UUIDGenerator throws', async () => {
    const file = Buffer.from('any_buffer')
    const fileStorage = mock<UploadFile>()
    const crypto = mock<UUIDGenerator>()
    crypto.uuid.mockImplementationOnce(() => { throw new Error('uuid_error') })
    const sut = setupChangeProfilePicture(fileStorage, crypto)

    const promise = sut({ userId: 'any_id', file })

    await expect(promise).rejects.toThrow(new Error('uuid_error'))
  })
})
