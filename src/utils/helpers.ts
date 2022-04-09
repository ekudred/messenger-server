export function toPlainObject(object: any) {
  return JSON.parse(JSON.stringify(object))
}

export function transformDialog(dialog: any, userID: string) {
  const id = dialog.id
  const companion = dialog.roster.filter((item: any) => item.user.id !== userID)[0].user
  const roster = dialog.roster.map((item: any) => ({ ...item.user }))

  return { id, companion, roster }
}

export function transformGroup(group: any) {
  const id = group.id
  const name = group.name
  const image = group.image
  const creator = group.creator
  const roster = group.roster.map((item: any) => ({ ...item.user }))

  return { id, name, image, creator, roster }
}
