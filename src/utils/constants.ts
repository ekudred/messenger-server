import { CookieOptions } from 'express'

export enum Roles {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

// Auth

export const rolesArray = [Roles.USER, Roles.ADMIN]
export const authRolesArray = [Roles.USER, Roles.ADMIN]
export const defaultAvatarImage = 'https://messenger-pet-project.s3.eu-central-1.amazonaws.com/avatars/avatar_default.png'

export const cookieOptionsToken: CookieOptions = { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'none', secure: true }

// RegExp's

export const RegExpPassword = /^.{8,32}$/
export const RegExpUserName = /^[a-zA-Z][a-zA-Z0-9-_\.]{3,15}$/
export const RegExpFullName = /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/
export const RegExpPhoneNumber = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,5}$/im
export const RegExpDate = /^(0?[1-9]|[12][0-9]|3[01]).(0?[1-9]|1[012]).((19|20)\d\d)$/
export const RegExpFolderName = /^.{4,16}$/
