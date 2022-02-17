import { IsEmail, IsString, Length, Matches } from 'class-validator'

import { RegExpUserName, RegExpFullName, RegExpPhoneNumber, RegExpDate, RegExpPassword } from '../utils/constants'

export class FindDTO {
  @IsString()
  public id!: string
}

export class UpdateDTO {
  @IsString()
  public id!: string

  @IsString()
  @Matches(RegExpUserName, { message: 'Username is invalid' })
  public username!: string

  @IsString()
  @Matches(RegExpFullName, { message: 'Fullname is invalid' })
  public fullname!: string

  @IsString()
  @Matches(RegExpDate, { message: 'Birthdate is invalid' })
  public birthdate!: string

  @IsString()
  @Matches(RegExpPhoneNumber, { message: 'Phone is invalid' })
  public phone!: string

  @IsString()
  @IsEmail({ message: 'Email is invalid' })
  public email!: string

  @IsString()
  public avatar!: string

  @IsString()
  // @Length(passwordLength.min, passwordLength.max, { message: 'Password is invalid' })
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
  // @Length(passwordLength.min, passwordLength.max, { message: 'Password is invalid' })
  @Matches(RegExpPassword, { message: 'Password is invalid' })
  public password!: string
}
