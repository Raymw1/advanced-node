export class UserProfile {
  initials: string | undefined
  pictureUrl: string | undefined

  constructor (readonly id: string) {}

  setPicture ({ pictureUrl, name }: { pictureUrl: string | undefined, name: string | undefined }): void {
    this.pictureUrl = pictureUrl
    if (pictureUrl === undefined && name !== undefined && name.trim() !== '') {
      const firstLetters = name.match(/\b(.)/g) ?? []
      if (firstLetters.length > 1) {
        this.initials = `${firstLetters.shift() ?? ''}${firstLetters.pop() ?? ''}`.toUpperCase()
      } else {
        this.initials = name.substring(0, 2).toUpperCase()
      }
    }
  }
}
