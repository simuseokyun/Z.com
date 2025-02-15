import { User } from './User'

export interface IRoom {
  room: string
  Receiver: User
  Sender: User
  content: string
  createdAt: Date
}

export default IRoom
