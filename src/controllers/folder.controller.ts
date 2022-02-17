import { JsonController as Controller, Body, Post, UseBefore } from 'routing-controllers'
import 'reflect-metadata'

import FolderService from '../services/folder.service'
import { AddDTO, CreateDTO, FindAllDTO, DeleteDTO } from '../dtos/folder.dto'
import authMiddleware from '../middlewares/auth.middleware'

import { Roles } from '../utils/constants'

@Controller('/folder')
class ProfileController {
  @Post('/create')
  @UseBefore(authMiddleware([Roles.ADMIN, Roles.USER]))
  async find(@Body() body: CreateDTO) {
    const folderData = await FolderService.create(body)

    return folderData
  }

  @Post('/add')
  @UseBefore(authMiddleware([Roles.ADMIN, Roles.USER]))
  async edit(@Body() body: AddDTO) {
    const folderData = await FolderService.add(body)

    return folderData
  }

  @Post('/findAll')
  @UseBefore(authMiddleware([Roles.ADMIN, Roles.USER]))
  async findAll(@Body() body: FindAllDTO) {
    const folderRoster = await FolderService.findAll(body)

    return folderRoster
  }

  @Post('/delete')
  @UseBefore(authMiddleware([Roles.ADMIN, Roles.USER]))
  async delete(@Body() body: DeleteDTO) {
    await FolderService.delete(body)

    return null
  }
}

export default ProfileController
