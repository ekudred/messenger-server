import nodemailer, { Transporter } from 'nodemailer'

interface SendOptions {
  from: string
  to: string
  subject: string
  text: string
  html: string
}

class MailService {
  public transporter: Transporter

  constructor() {
    this.transporter = nodemailer.createTransport({
      pool: true,
      service: 'Gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.MAIL_USER,
        refreshToken: process.env.MAIL_REFRESH_TOKEN,
        clientId: process.env.MAIL_CLIENT_ID,
        clientSecret: process.env.MAIL_CLIENT_SECRET,
      },
    })

    this.subscription()
  }

  public async send(options: SendOptions) {
    await this.transporter.sendMail({ ...options })
  }

  public subscription() {
    this.transporter.on('token', token => {
      console.log('A new access token was generated')
      console.log('User: %s', token.user)
      console.log('Access Token: %s', token.accessToken)
      console.log('Expires: %s', new Date(token.expires))
    })
  }
}

export default MailService
