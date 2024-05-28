import { DeleteFile, UUIDGenerator, UploadFile } from '@/domain/contracts/gateways'
import { LoadUserProfileRepository, SaveUserPictureRepository } from '@/domain/contracts/repos'
import { UserProfile } from '@/domain/entities'
import { UserProfileNotFoundError } from '@/domain/errors'
import { ChangeProfilePicture, setupChangeProfilePicture } from '@/domain/use-cases'

import { MockProxy, mock } from 'jest-mock-extended'

jest.mock('@/domain/entities/user-profile')

describe('ChangeProfilePicture', () => {
  let uuid: string
  let fileUrl: string
  let buffer: Buffer
  let mimeType: string
  let file: { buffer: Buffer, mimeType: string }
  let fileStorage: MockProxy<UploadFile & DeleteFile>
  let crypto: MockProxy<UUIDGenerator>
  let userProfileRepository: MockProxy<SaveUserPictureRepository & LoadUserProfileRepository>
  let sut: ChangeProfilePicture

  beforeAll(() => {
    uuid = 'any_unique_id'
    fileUrl = 'any_url'
    buffer = Buffer.from('any_buffer')
    mimeType = 'image/png'
    file = { buffer, mimeType }
    fileStorage = mock<UploadFile & DeleteFile>()
    fileStorage.upload.mockResolvedValue({ fileUrl })
    crypto = mock<UUIDGenerator>()
    crypto.uuid.mockReturnValue(uuid)
    userProfileRepository = mock<SaveUserPictureRepository & LoadUserProfileRepository>()
    userProfileRepository.load.mockResolvedValue({ name: 'Rayan Melino Wilbert' })
  })

  beforeEach(() => {
    sut = setupChangeProfilePicture(fileStorage, crypto, userProfileRepository)
  })

  it('should call LoadUserProfileRepository with correct input', async () => {
    await sut({ userId: 'any_id', file: undefined })

    expect(userProfileRepository.load).toHaveBeenCalledTimes(1)
    expect(userProfileRepository.load).toHaveBeenCalledWith({ id: 'any_id' })
  })

  it('should throw UserProfileNotFoundError when LoadUserProfileRepository returns undefined', async () => {
    userProfileRepository.load.mockResolvedValueOnce(undefined)

    const promise = sut({ userId: 'any_id', file: undefined })

    await expect(promise).rejects.toThrow(new UserProfileNotFoundError())
  })

  it('should call UploadFile with correct input', async () => {
    await sut({ userId: 'any_id', file: { buffer, mimeType: 'image/png' } })

    expect(fileStorage.upload).toHaveBeenCalledTimes(1)
    expect(fileStorage.upload).toHaveBeenCalledWith({ file: buffer, fileName: `${uuid}.png` })
  })

  it('should call UploadFile with correct input', async () => {
    await sut({ userId: 'any_id', file: { buffer, mimeType: 'image/jpeg' } })

    expect(fileStorage.upload).toHaveBeenCalledTimes(1)
    expect(fileStorage.upload).toHaveBeenCalledWith({ file: buffer, fileName: `${uuid}.jpeg` })
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

  it('should call SaveUserPictureRepository with correct input', async () => {
    await sut({ userId: 'any_id', file })

    expect(userProfileRepository.savePicture).toHaveBeenCalledTimes(1)
    expect(userProfileRepository.savePicture).toHaveBeenCalledWith(jest.mocked(UserProfile).mock.instances[0])
  })

  it('should throw if LoadUserProfileRepository throws', async () => {
    userProfileRepository.load.mockImplementationOnce(() => { throw new Error('load_error') })

    const promise = sut({ userId: 'any_id', file: undefined })

    await expect(promise).rejects.toThrow(new Error('load_error'))
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

  it('should call DeleteFile when file exists and SaveUserPicture throws', async () => {
    userProfileRepository.savePicture.mockRejectedValueOnce(Error('save_error'))
    expect.assertions(2)

    const promise = sut({ userId: 'any_id', file })

    promise.catch(() => {
      expect(fileStorage.delete).toHaveBeenCalledTimes(1)
      expect(fileStorage.delete).toHaveBeenCalledWith({ fileName: uuid })
    })
  })

  it('should not call DeleteFile when file does not exist and SaveUserPicture throws', async () => {
    userProfileRepository.savePicture.mockRejectedValueOnce(Error('save_error'))

    const promise = sut({ userId: 'any_id', file: undefined })

    promise.catch(() => {
      expect(fileStorage.delete).not.toHaveBeenCalled()
    })
  })

  it('should throws if SaveUserPicture throws', async () => {
    userProfileRepository.savePicture.mockRejectedValueOnce(Error('save_error'))

    const promise = sut({ userId: 'any_id', file: undefined })

    await expect(promise).rejects.toThrow(new Error('save_error'))
  })
})
