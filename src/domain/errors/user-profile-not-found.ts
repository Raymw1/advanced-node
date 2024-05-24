export class UserProfileNotFoundError extends Error {
  constructor () {
    super('User profile not found')
    this.name = 'UserProfileNotFoundError'
  }
}
