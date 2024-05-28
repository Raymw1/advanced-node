import { adaptExpressRoute as adapt } from '@/main/adapters'
import { makeSaveProfilePictureController } from '@/main/factories/controllers'
import { auth } from '@/main/middlewares'

import { Router } from 'express'

export default (router: Router): void => {
  router.delete('/users/picture', auth, adapt(makeSaveProfilePictureController()))
}
