import { JsonController, Body, Post, UseBefore } from 'routing-controllers'
import 'reflect-metadata'

import UserService from '../../services/user'
import { EditDTO, FindDTO, DeleteDTO } from '../../dtos/router/profile.dto'
import { authRouterMiddleware } from '../../middlewares/router/auth.router-middleware'

import { authRolesArray } from '../../utils/constants'

@JsonController('/profile')
@UseBefore(authRouterMiddleware(authRolesArray))
class ProfileController {
  @Post('/edit')
  async editProfile(@Body({ options: { limit: '10mb' } }) body: EditDTO) {
    const data = await UserService.editUser(body, { id: body.id })

    return data
  }

  @Post('/find')
  async findProfile(@Body() body: FindDTO) {
    const data = await UserService.findUser(body)

    return data
  }

  // @Post('/delete')
  // async deleteUser(@Body() body: DeleteDTO) {
  //   await Index.deleteUser(body)
  //
  //   return null
  // }
}

export default ProfileController
