import uuid from 'uuid/v1'

export default function generateId(): string {
  return uuid()
}
