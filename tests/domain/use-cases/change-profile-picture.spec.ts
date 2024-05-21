import { UUIDGenerator, UploadFile } from '@/domain/contracts/gateways'
import { ChangeProfilePicture, setupChangeProfilePicture } from '@/domain/use-cases'

import { MockProxy, mock } from 'jest-mock-extended'

describe('ChangeProfilePicture', () => {
  let uuid: string
  let file: Buffer
  let fileStorage: MockProxy<UploadFile>
  let crypto: MockProxy<UUIDGenerator>
  let sut: ChangeProfilePicture

  beforeAll(() => {
    uuid = 'any_unique_id'
    file = Buffer.from('any_buffer')
    fileStorage = mock<UploadFile>()
    crypto = mock<UUIDGenerator>()
    crypto.uuid.mockReturnValue(uuid)
  })

  beforeEach(() => {
    sut = setupChangeProfilePicture(fileStorage, crypto)
  })

  it('should call UploadFile with correct input', async () => {
    await sut({ userId: 'any_id', file })

    expect(fileStorage.upload).toHaveBeenCalledTimes(1)
    expect(fileStorage.upload).toHaveBeenCalledWith({ file, key: uuid })
  })

  it('should throw if UploadFile throws', async () => {
    fileStorage.upload.mockRejectedValueOnce(new Error('upload_error'))

    const promise = sut({ userId: 'any_id', file })

    await expect(promise).rejects.toThrow(new Error('upload_error'))
  })

  it('should call UUIDGenerator with correct input', async () => {
    await sut({ userId: 'any_id', file })

    expect(crypto.uuid).toHaveBeenCalledTimes(1)
    expect(crypto.uuid).toHaveBeenCalledWith({ key: 'any_id' })
  })

  it('should throw if UUIDGenerator throws', async () => {
    crypto.uuid.mockImplementationOnce(() => { throw new Error('uuid_error') })

    const promise = sut({ userId: 'any_id', file })

    await expect(promise).rejects.toThrow(new Error('uuid_error'))
  })

  it('should not call UploadFile when file is undefined', async () => {
    await sut({ userId: 'any_id', file: undefined })

    expect(fileStorage.upload).not.toHaveBeenCalled()
  })
})
