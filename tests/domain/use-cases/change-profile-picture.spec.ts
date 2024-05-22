import { UUIDGenerator, UploadFile } from '@/domain/contracts/gateways'
import { LoadUserProfileRepository, SaveUserPictureRepository } from '@/domain/contracts/repos'
import { UserProfile } from '@/domain/entities'
import { ChangeProfilePicture, setupChangeProfilePicture } from '@/domain/use-cases'

import { MockProxy, mock } from 'jest-mock-extended'

jest.mock('@/domain/entities/user-profile')

describe('ChangeProfilePicture', () => {
  let uuid: string
  let fileUrl: string
  let file: Buffer
  let fileStorage: MockProxy<UploadFile>
  let crypto: MockProxy<UUIDGenerator>
  let userProfileRepository: MockProxy<SaveUserPictureRepository & LoadUserProfileRepository>
  let sut: ChangeProfilePicture

  beforeAll(() => {
    uuid = 'any_unique_id'
    fileUrl = 'any_url'
    file = Buffer.from('any_buffer')
    fileStorage = mock<UploadFile>()
    fileStorage.upload.mockResolvedValue({ fileUrl })
    crypto = mock<UUIDGenerator>()
    crypto.uuid.mockReturnValue(uuid)
    userProfileRepository = mock<SaveUserPictureRepository & LoadUserProfileRepository>()
    userProfileRepository.load.mockResolvedValue({ name: 'Rayan Melino Wilbert' })
  })

  beforeEach(() => {
    sut = setupChangeProfilePicture(fileStorage, crypto, userProfileRepository)
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

  it('should not call UUIDGenerator when file is undefined', async () => {
    await sut({ userId: 'any_id', file: undefined })

    expect(crypto.uuid).not.toHaveBeenCalled()
  })

  it('should call SaveUserPictureRepository with correct input', async () => {
    await sut({ userId: 'any_id', file })

    expect(userProfileRepository.savePicture).toHaveBeenCalledTimes(1)
    expect(userProfileRepository.savePicture).toHaveBeenCalledWith(jest.mocked(UserProfile).mock.instances[0])
  })

  it('should call LoadUserProfileRepository with correct input', async () => {
    await sut({ userId: 'any_id', file: undefined })

    expect(userProfileRepository.load).toHaveBeenCalledTimes(1)
    expect(userProfileRepository.load).toHaveBeenCalledWith({ id: 'any_id' })
  })

  it('should throw if LoadUserProfileRepository throws', async () => {
    userProfileRepository.load.mockImplementationOnce(() => { throw new Error('load_error') })

    const promise = sut({ userId: 'any_id', file: undefined })

    await expect(promise).rejects.toThrow(new Error('load_error'))
  })

  it('should not call LoadUserProfileRepository if file exists', async () => {
    await sut({ userId: 'any_id', file })

    expect(userProfileRepository.load).not.toHaveBeenCalled()
  })

  it('should return correct data on success', async () => {
    jest.mocked(UserProfile).mockImplementationOnce(id => ({
      setPicture: jest.fn(),
      id: 'any_id',
      pictureUrl: 'any_url',
      initials: 'any_initials'
    }))

    const result = await sut({ userId: 'any_id', file })

    expect(result).toMatchObject({
      pictureUrl: 'any_url',
      initials: 'any_initials'
    })
  })
})
