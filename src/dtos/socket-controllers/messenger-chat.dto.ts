import { IsOptional, IsString, ValidateNested } from 'class-validator'

export class GetChatDTO {
  @IsString()
  public type!: string

  @IsString()
  public id!: string

  @IsString()
  public userID!: string
}

export class CreateDialogDTO {
  @IsString()
  public userID!: string

  @IsString()
  public companionID!: string
}

export class CreateGroupDTO {
  @IsString()
  public userID!: string

  @IsString()
  public name!: string

  @IsOptional()
  @IsString()
  public image!: string

  @ValidateNested()
  public roster!: { userID: string }[]
}
