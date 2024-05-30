import { adaptExpressRoute as adapt, adaptMulter as upload } from '@/main/adapters'
import { makeSaveProfilePictureController } from '@/main/factories/controllers'
import { auth } from '@/main/middlewares'

import { Router } from 'express'

export default (router: Router): void => {
  router.delete('/users/picture', auth, adapt(makeSaveProfilePictureController()))
  router.put('/users/picture', auth, upload, adapt(makeSaveProfilePictureController()))
}
