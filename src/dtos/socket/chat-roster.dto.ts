import { IsOptional, IsString, ValidateNested } from 'class-validator'

export class GetChatsDTO {
  @IsString()
  public userID!: string
}

export class GetDialogsDTO {
  @IsString()
  public userID!: string
}

export class SearchChatsDTO {
  @IsString()
  public userID!: string

  @IsString()
  public value!: string
}

export class CreateDialogDTO {
  @IsString()
  public userID!: string

  @IsString()
  public companionID!: string
}

export class CreateGroupDTO {
  @IsString()
  public creatorID!: string

  @IsString()
  public name!: string

  @IsOptional()
  @IsString()
  public image!: string

  @ValidateNested()
  public roster!: { userID: string }[]
}
