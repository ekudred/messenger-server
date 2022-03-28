import { IsEmail, IsString, Matches, IsOptional } from 'class-validator'

import { RegExpUserName, RegExpFullName, RegExpPhoneNumber, RegExpDate, RegExpPassword } from '../../utils/constants'

export class FindDTO {
  @IsString()
  public id!: string
}

export class EditDTO {
  @IsString()
  public id!: string

  @IsOptional()
  @IsString()
  @Matches(RegExpUserName, { message: 'Username is invalid' })
  public username!: string

  @IsOptional()
  @IsString()
  @Matches(RegExpFullName, { message: 'Fullname is invalid' })
  public fullname!: string

  @IsOptional()
  @IsString()
  @Matches(RegExpDate, { message: 'Birthdate is invalid' })
  public birthdate!: string

  @IsOptional()
  @IsString()
  @Matches(RegExpPhoneNumber, { message: 'Phone is invalid' })
  public phone!: string

  @IsOptional()
  @IsString()
  @IsEmail({}, { message: 'Email is invalid' })
  public email!: string

  @IsOptional()
  @IsString()
  public avatar!: string

  @IsOptional()
  @IsString()
  @Matches(RegExpPassword, { message: 'Password is invalid' })
  public password!: string
}

export class DeleteDTO {
  @IsString()
  public id!: string
}

export class ConfirmDTO {
  @IsString()
  public id!: string

  @IsString()
  @Matches(RegExpPassword, { message: 'Password is invalid' })
  public password!: string
}
