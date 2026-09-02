import { Comment } from "../comments/comment"
import "./chatBoxs.css"
export const ChatBox = () => {
    return (
        <div className="w-80 h-120 border border-gray-300 rounded-2xl overflow-hidden ">
            <div className="bg-gray-100 h-[80%] overflow-y-scroll scrollbar-hide">

            </div>
            <div className="h-[20%] bg-white ">
                <Comment />
            </div>
        </div>
    )
}