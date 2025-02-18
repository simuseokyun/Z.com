import { PostImage } from './PostImage'
import { User } from './User'

export default interface Comment {
  Images: PostImage[]
  postId: number
  User: User
  content: string
  createdAt: Date
  Parent: User
}
