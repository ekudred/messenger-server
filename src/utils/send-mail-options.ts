interface ActivationMailOptions {
  to: string
  link: string
}

export function getActivationMailOptions(options: ActivationMailOptions) {
  const { to, link } = options

  return {
    from: process.env.MAIL_USER!,
    to,
    subject: 'Activate your Messenger account',
    text: '',
    html: `
                    <div>
                        <h1>To activate your account, follow the link <a href="${link}">Messenger</a> and sign in</h1>
                    </div>
                `,
  }
}
