export function toPlainObject(object: any) {
  return JSON.parse(JSON.stringify(object))
}