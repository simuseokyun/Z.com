import { User } from 'next-auth'

interface IRoom {
  room: string
  Receiver: User
  content: string
  createdAt: Date
}

export default IRoom
