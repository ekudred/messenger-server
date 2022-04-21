import { JsonController, Body, Post, UseBefore } from 'routing-controllers'
import 'reflect-metadata'

import UserService from '../../services/external/user.service'
import { EditDTO, FindDTO, DeleteDTO, ConfirmDTO } from '../../dtos/router/profile.dto'
import { authRouterMiddleware } from '../../middlewares/router/auth.router-middleware'

import { authRolesArray } from '../../utils/constants'

@JsonController('/profile')
@UseBefore(authRouterMiddleware(authRolesArray))
class ProfileController {
  @Post('/find')
  async find(@Body() body: FindDTO) {
    const userData = await UserService.find(body)

    return userData
  }

  @Post('/edit')
  async edit(@Body({ options: { limit: '10mb' } }) body: EditDTO) {
    const userData = await UserService.edit(body, { id: body.id })

    return userData
  }

  @Post('/delete')
  async delete(@Body() body: DeleteDTO) {
    await UserService.delete(body)

    return null
  }

  @Post('/confirm')
  async confirm(@Body() body: ConfirmDTO) {
    const isConfirm = await UserService.confirm(body)

    return isConfirm
  }
}

export default ProfileController
