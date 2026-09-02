import React, { useEffect, useRef, useState } from "react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import axios from "axios";
import "./comment.css"
import { io } from "socket.io-client";
interface CommentProps {
    taskId: string;
}

export const Comment = ({ taskId }: CommentProps) => {
    const [commentType, setCommentType] = useState<"content" | "image" | "file" | null>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [dataComment, setDataComment] = useState<any[]>([]);
    const [imgFile, setImgFile] = useState<File | null>(null);
    const [imgPreview, setImgPreview] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [comment, setComment] = useState<string>("")
    taskId = "4d03d3e0-9b08-4f31-83ee-bccf46e2a4b5"
    const callApiComment = async () => {
        const data = await axios.get(`http://localhost:3000/comments/${taskId}`)
        setDataComment(data.data?.data);
    }
    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (commentType !== null && commentType !== "content") {
            return;
        }
        const textarea = e.target;
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
        const content = textarea.value;
        setComment(content);
        if (textarea.value.trim()) {
            setCommentType("content");
        } else {
            setCommentType(null);
        }

    };
    const handleImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (commentType !== null && commentType !== "image") {
            e.target.value = "";
            return;
        }
        const files = e.target.files?.[0] ?? null;
        if (!files) return;
        setImgFile(files)
        setImgPreview(URL.createObjectURL(files));
        setCommentType("image");
        e.target.value = "";
    }
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (commentType !== null && commentType !== "file") {
            e.target.value = "";
            return;
        }
        const files = e.target.files?.[0] ?? null;
        if (!files) return;
        setFile(files)
        setCommentType("file");
        e.target.value = "";

    }
    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        try {
            if (
                commentType === null ||
                (
                    commentType === "content" &&
                    !comment.trim()
                ) ||
                (
                    commentType === "image" &&
                    imgFile === null
                ) ||
                (
                    commentType === "file" &&
                    file === null
                )
            ) {
                return;
            }
            if (commentType === "content" && comment.trim()) {
                try {
                    console.log(comment)
                    await axios.post("http://localhost:3000/comments/contents",
                        {
                            task_id: taskId,
                            user_id: "e780219e-490f-45bf-a194-ed80d0d827b7",
                            content: comment,
                            type: "comment"
                        }
                    )
                    setComment("");
                    setCommentType(null)
                } catch (error) {
                    console.log(error);
                }

            }
            else {
                try {
                    if (!file && !imgFile) return;
                    const uploadFile = commentType === "file"
                        ? file
                        : imgFile;

                    if (!uploadFile) {
                        return;
                    }
                    const formData = new FormData();
                    formData.append("task_id", taskId);
                    formData.append("file", uploadFile);
                    formData.append(
                        "uploaded_by",
                        "e780219e-490f-45bf-a194-ed80d0d827b7"
                    );
                    formData.append("type", "attachment");

                    await axios.post(
                        "http://localhost:3000/comments/attachments",
                        formData
                    );
                    setImgFile(null);
                    setImgPreview(null);
                    setFile(null);
                    setCommentType(null)
                } catch (error) {
                    console.log(error);
                }
            }
        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        callApiComment()
        const socket = io("http://localhost:3000");

        socket.emit("join_task", taskId);

        socket.on("new_comment", (newComment) => {
            setDataComment((prev) => [
                newComment,
                ...prev,

            ]);
        });
        socket.on("new_attachment", (newAttachment) => {
            console.log("Attachment mới:", newAttachment);

            setDataComment((prev) => [
                newAttachment,
                ...prev,
            ]);
        });
        return () => {
            socket.off("new_comment");
            socket.off("new_attachment");
            socket.disconnect();
        };
    }, [taskId]);
    const handleDeleteFileOrImg = (type: "file" | "img") => {
        if (type === "file") {
            setFile(null)
            setCommentType(null)
        }
        else if (type === "img") {
            setImgPreview(null)
            setImgFile(null);
            setCommentType(null)
        }
    }
    return (
        <>
            <div>
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl overflow-hidden ">
                    <div className="flex gap-2 border border-gray-200 p-2.5 justify-between items-center">
                        <div className="flex gap-2 ">
                            <div>
                                <Input id="file-img"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImgChange}
                                    disabled={commentType !== null && commentType !== "image"} />
                                <label
                                    htmlFor="file-img"
                                    className={`cursor-pointer text-gray-500 hover:text-blue-500 ${commentType !== null && commentType !== "image"
                                        ? "pointer-events-none opacity-40"
                                        : ""
                                        }`}
                                >
                                    <svg
                                        width="17"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="gray"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <rect width="18" height="18" x="3" y="3" rx="2" />
                                        <circle cx="9" cy="9" r="2" />
                                        <path d="m21 15-3.09-3.09a2 2 0 0 0-2.82 0L6 21" />
                                    </svg>
                                </label>

                            </div>
                            <div>
                                <Input id="file-upload"
                                    type="file"
                                    className="hidden"
                                    onChange={handleFileChange}
                                    disabled={commentType !== null && commentType !== "file"} />

                                <label
                                    htmlFor="file-upload"
                                    className={`cursor-pointer text-gray-500 hover:text-blue-500 ${commentType !== null && commentType !== "file"
                                        ? "pointer-events-none opacity-40"
                                        : ""
                                        }`}
                                >
                                    <svg
                                        width="17"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="gray"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                                    </svg>
                                </label>
                            </div>
                        </div>

                        <div>
                            <Input id="submit-comment" className="hidden" type="submit" />
                            <div className="w-8 h-8 rounded-full bg-gray-400 flex justify-center items-center"
                                style={{ backgroundColor: commentType !== null ? "#3A86FF" : "" }}>
                                <label
                                    htmlFor="submit-comment"
                                    className="cursor-pointer text-gray-500 hover:text-blue-500 "
                                    style={{ color: commentType !== null ? "#fff" : "" }}
                                >
                                    <svg
                                        width="17"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="m22 2-7 20-4-9-9-4Z" />
                                        <path d="M22 2 11 13" />
                                    </svg>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className={imgPreview || file ? "p-2.5 flex-row gap-2" : ""} >
                        {imgPreview && (
                            <div className="w-fit relative boxImg">
                                <img
                                    src={imgPreview}
                                    alt="Preview"
                                    className="mt-2 max-h-75 max-w-full rounded-lg object-contain"
                                />
                                <Button
                                    type="button"
                                    onClick={() => handleDeleteFileOrImg("img")}
                                    className="shrink-0 text-gray-400 hover:text-gray-700 hoverDelete"
                                >
                                    ×
                                </Button>
                            </div>
                        )}
                        {file && (
                            <div className="flex w-fit max-w-87.5 items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-1.5">
                                {/* Icon file */}
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="shrink-0 text-gray-600"
                                >
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                </svg>

                                <span
                                    className="min-w-0 truncate text-sm text-gray-700"
                                    title={file.name}
                                >
                                    {file.name}
                                </span>
                                <span className="shrink-0 text-sm text-gray-400">
                                    {(file.size / 1024).toFixed(1)} KB
                                </span>
                                <Button
                                    type="button"
                                    onClick={() => handleDeleteFileOrImg("file")}
                                    className="shrink-0 text-gray-400 hover:text-gray-700 cursor-pointer"
                                    style={{ backgroundColor: "white", color: "gray" }}
                                >
                                    ×
                                </Button>
                            </div>
                        )}
                    </div>
                    <div className="border border-gray-200 p-2.5">
                        <textarea
                            value={comment}
                            ref={textareaRef}
                            onChange={handleInput}
                            disabled={commentType !== null && commentType !== "content"}
                            className={`w-full resize-none overflow-hidden border-none outline-none focus:outline-none ${commentType !== null && commentType !== "content"
                                ? "cursor-not-allowed opacity-40"
                                : ""
                                }`}
                            placeholder={
                                commentType === "image"
                                    ? "Đã chọn ảnh"
                                    : commentType === "file"
                                        ? "Đã chọn file"
                                        : "Nhập nội dung..."
                            }
                        />
                    </div>
                </form >

            </div >
            <div className="flex flex-col gap-1 mt-2.5">
                {
                    dataComment?.map((items, index) => {
                        const checkFile = items?.file_url?.split("/")
                        return (
                            <div
                                key={index}
                                className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-3 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-500 text-sm font-semibold text-white"
                                    style={{ backgroundImage: `url(${items?.users?.avatar_url})`, backgroundRepeat: "no-repeat", backgroundSize: "100% 100%" }}>
                                    {items?.users?.full_name.charAt(0)?.toUpperCase() ?? "U"}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold text-gray-800">
                                            {items?.users?.full_name ?? "Người dùng"}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            {items?.createdAt}
                                        </span>
                                    </div>
                                    {
                                        items?.type === "comment" ?
                                            <div>
                                                <p className="mt-1 text-sm text-gray-700 whitespace-pre-wrap wrap-break-words">
                                                    {items?.content}
                                                </p>
                                            </div>
                                            :
                                            <div>
                                                {
                                                    checkFile !== undefined && checkFile[4] === "raw" && (
                                                        <a
                                                            href={items.file_url}
                                                            download={items.file_name}
                                                            className="min-w-0 truncate text-sm text-gray-700 hover:underline"
                                                            title={items.file_name}
                                                        >
                                                            <div className="flex w-fit max-w-87.5 items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-1.5">
                                                                <svg
                                                                    width="16"
                                                                    height="16"
                                                                    viewBox="0 0 24 24"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    className="shrink-0 text-gray-600"
                                                                >
                                                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                                                    <polyline points="14 2 14 8 20 8" />
                                                                </svg>

                                                                <span
                                                                    className="min-w-0 truncate text-sm text-gray-700"
                                                                    title={items.file_name}
                                                                >
                                                                    {items.file_name}
                                                                </span>
                                                                <span className="shrink-0 text-sm text-gray-400">
                                                                    {(items.size_bytes / 1024).toFixed(1)} KB
                                                                </span>

                                                            </div>
                                                        </a>

                                                    )
                                                }
                                                {
                                                    checkFile !== undefined && checkFile[4] === "image" && (
                                                        <img
                                                            src={items.file_url}
                                                            alt="Preview"
                                                            className="mt-2 max-h-75 max-w-full rounded-lg object-contain"
                                                        />
                                                    )
                                                }

                                            </div>
                                    }

                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </>


    )
}