import { Comment } from "../comments/comment"
import "./chatBoxs.css"
interface Project {
    id: string
}
export const ChatBox = ({ id }: Project) => {
    return (
        <Comment projectId={id} taskId={null} />
    )
}