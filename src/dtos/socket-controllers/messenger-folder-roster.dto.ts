import { IsString, ValidateNested, Matches } from 'class-validator'

import { RegExpFolderName } from '../../utils/constants'

export class CreateDTO {
  @IsString()
  public userID!: string

  @IsString()
  @Matches(RegExpFolderName, { message: 'Folder name is invalid' })
  public name!: string

  @ValidateNested()
  public dialogs!: { id: string }[]

  @ValidateNested()
  public groups!: { id: string }[]
}

export class EditDTO {
  @IsString()
  public folderID!: string

  @IsString()
  @Matches(RegExpFolderName, { message: 'Folder name is invalid' })
  public folderName!: string
}

export class FindAllDTO {
  @IsString()
  public userID!: string
}

export class DeleteDTO {
  @IsString()
  public folderID!: string

  @IsString()
  public folderName!: string
}

// export class FolderDTO {
//   public id: string
//   public userID!: string
//   public name: string

//   constructor(object: { [key: string]: any }) {
//     this.id = object.id
//     this.name = object.name
//   }

//   public toPlainObj(): Object {
//     return Object.assign({}, this)
//   }
// }