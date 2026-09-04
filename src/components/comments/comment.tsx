import React, { useEffect, useRef, useState } from "react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import "./comment.css";
import { io } from "socket.io-client";
import { commentApi } from "@/api/comment.api";
import type { CommentProps } from "@/types/comment";
import { env } from "@/config/env";

export const Comment = ({ taskId, projectId }: CommentProps) => {
    const [commentType, setCommentType] = useState<
        "content" | "image" | "file" | null
    >(null);

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const [dataComment, setDataComment] = useState<any[]>([]);

    const [imgFile, setImgFile] = useState<File | null>(null);
    const [imgPreview, setImgPreview] = useState<string | null>(null);

    const [file, setFile] = useState<File | null>(null);

    const [comment, setComment] = useState<string>("");

    // =========================
    // TASK PAGINATION
    // =========================
    const [skip, setSkip] = useState(1);

    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    // =========================
    // PROJECT PAGINATION
    // =========================
    const [projectSkip, setProjectSkip] = useState(1);
    const [projectHasMore, setProjectHasMore] = useState(true);
    const [projectLoading, setProjectLoading] = useState(false);

    // =========================
    // REF
    // =========================

    const loadingRef = useRef(false);

    const projectLoadingRef = useRef(false);

    const projectScrollRef = useRef<HTMLDivElement>(null);

    const firstProjectLoadRef = useRef(true);

    const auth = localStorage.getItem("ln.auth");

    const idUser = auth ? JSON.parse(auth) : null;
    const uniqueKey = taskId ?? projectId ?? "default";
    // =========================================================
    // TASK - LOAD COMMENT
    // =========================================================

    const callApiTaskComment = async (currentSkip: number) => {
        if (loadingRef.current || !hasMore || !taskId) {
            return;
        }

        loadingRef.current = true;

        try {
            const query = `?taskId=${taskId}&skip=${currentSkip}&limit=10`;

            console.log("🔥 CALL TASK API:", query);

            const res = await commentApi.getComment(query);

            const newData = res.data ?? [];

            setDataComment((prev) => [
                ...prev,
                ...newData,
            ]);

            if (newData.length < 10) {
                setHasMore(false);
            }
        } catch (error) {
            console.log("❌ TASK COMMENT ERROR:", error);
        } finally {
            loadingRef.current = false;
        }
    };

    // =========================================================
    // PROJECT - LOAD COMMENT
    // =========================================================

    const callApiProjectComment = async (
        currentSkip: number,
        isInitial: boolean = false
    ) => {
        if (
            projectLoadingRef.current ||
            !projectHasMore ||
            !projectId
        ) {
            return;
        }

        const container = projectScrollRef.current;

        // Lưu vị trí scroll trước khi thêm dữ liệu
        const oldScrollHeight = container?.scrollHeight ?? 0;
        const oldScrollTop = container?.scrollTop ?? 0;

        projectLoadingRef.current = true;
        setProjectLoading(true);

        try {
            const query = `?projectId=${projectId}&skip=${currentSkip}&limit=10`;

            console.log("🔥 CALL PROJECT API:", query);

            const res = await commentApi.getComment(query);

            const newData = res.data ?? [];

            console.log("📦 PROJECT DATA:", newData);

            if (isInitial) {
                // Lần đầu tiên
                setDataComment(newData);
            } else {
                // Những lần sau:
                // thêm comment cũ vào ĐẦU danh sách
                setDataComment((prev) => [
                    ...newData,
                    ...prev,
                ]);
            }

            // Nếu < 10 thì không còn dữ liệu cũ
            if (newData.length < 10) {
                setProjectHasMore(false);
            }

            setProjectSkip(currentSkip);

            /*
             * Sau khi React render dữ liệu mới,
             * giữ nguyên vị trí đang đọc.
             */
            if (!isInitial) {
                requestAnimationFrame(() => {
                    const currentContainer = projectScrollRef.current;

                    if (!currentContainer) return;

                    const newScrollHeight =
                        currentContainer.scrollHeight;

                    const heightDifference =
                        newScrollHeight - oldScrollHeight;

                    currentContainer.scrollTop =
                        oldScrollTop + heightDifference;
                });
            }
        } catch (error) {
            console.log("❌ PROJECT COMMENT ERROR:", error);
        } finally {
            projectLoadingRef.current = false;
            setProjectLoading(false);
        }
    };
    console.log(dataComment)
    // =========================================================
    // INPUT TEXT
    // =========================================================

    const handleInput = (
        e: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        const textarea = e.target;

        const value = textarea.value;

        if (
            commentType !== null &&
            commentType !== "content"
        ) {
            return;
        }

        textarea.style.height = "auto";

        textarea.style.height = `${textarea.scrollHeight}px`;

        setComment(value);

        setCommentType(
            value.trim() ? "content" : null
        );
    };

    // =========================================================
    // IMAGE
    // =========================================================

    const handleImgChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (
            commentType !== null &&
            commentType !== "image"
        ) {
            e.target.value = "";
            return;
        }

        const selectedFile =
            e.target.files?.[0] ?? null;

        if (!selectedFile) return;

        setImgFile(selectedFile);

        setImgPreview(
            URL.createObjectURL(selectedFile)
        );

        setCommentType("image");

        e.target.value = "";
    };

    // =========================================================
    // FILE
    // =========================================================

    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (
            commentType !== null &&
            commentType !== "file"
        ) {
            e.target.value = "";
            return;
        }

        const selectedFile =
            e.target.files?.[0] ?? null;

        if (!selectedFile) return;

        setCommentType("file");

        setFile(selectedFile);

        e.target.value = "";
    };

    // =========================================================
    // SUBMIT
    // =========================================================

    const handleSubmit = async (
        e?: React.FormEvent
    ) => {
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

            // =================================================
            // CONTENT
            // =================================================
            setLoading(true);

            if (
                commentType === "content" &&
                comment.trim()
            ) {
                try {
                    await commentApi.createComment({
                        task_id: taskId ?? null,
                        project_id: projectId ?? null,
                        content: comment,
                        type: "comment",
                    });

                    setComment("");

                    setCommentType(null);

                    if (textareaRef.current) {
                        textareaRef.current.style.height =
                            "auto";
                    }
                } catch (error) {
                    console.log(
                        "❌ CREATE COMMENT ERROR:",
                        error
                    );
                } finally {
                    setLoading(false);

                }

                return;
            }

            // =================================================
            // FILE / IMAGE
            // =================================================

            if (!file && !imgFile) {
                return;
            }

            const uploadFile =
                commentType === "file"
                    ? file
                    : imgFile;

            if (!uploadFile) {
                return;
            }

            const formData = new FormData();

            if (taskId) {
                formData.append(
                    "task_id",
                    taskId
                );
            }

            if (projectId) {
                formData.append(
                    "project_id",
                    projectId
                );
            }

            formData.append(
                "file",
                uploadFile
            );

            formData.append(
                "uploaded_by",
                idUser?.state?.user?.id
            );

            formData.append(
                "type",
                "attachment"
            );

            await commentApi.createAttach(
                formData
            );

            setImgFile(null);

            setImgPreview(null);

            setFile(null);

            setCommentType(null);

        } catch (error) {
            console.log(
                "❌ HANDLE SUBMIT ERROR:",
                error
            );
        } finally {
            setLoading(false)
        }
    };
    console.log(loading)
    // =========================================================
    // DELETE PREVIEW
    // =========================================================

    const handleDeleteFileOrImg = (
        type: "file" | "img"
    ) => {
        if (type === "file") {
            setFile(null);

            setCommentType(null);
        }

        if (type === "img") {
            if (imgPreview) {
                URL.revokeObjectURL(
                    imgPreview
                );
            }

            setImgPreview(null);

            setImgFile(null);

            setCommentType(null);
        }
    };

    // =========================================================
    // TASK SCROLL
    // =========================================================

    const handleScrollTask = (
        e: React.UIEvent<HTMLDivElement>
    ) => {
        const element =
            e.currentTarget;

        const isNearBottom =
            element.scrollTop +
            element.clientHeight >=
            element.scrollHeight - 200;

        if (
            isNearBottom &&
            !loadingRef.current &&
            hasMore
        ) {
            const nextSkip =
                skip + 1;

            console.log(
                "🔥 LOAD MORE TASK:",
                nextSkip
            );

            setSkip(nextSkip);

            callApiTaskComment(
                nextSkip
            );
        }
    };

    // =========================================================
    // PROJECT SCROLL
    // =========================================================

    const handleScrollProject = (
        e: React.UIEvent<HTMLDivElement>
    ) => {
        const element =
            e.currentTarget;

        const isNearTop =
            Math.abs(element.scrollTop) + element.clientHeight >=
            element.scrollHeight - 100;



        if (isNearTop && !projectLoadingRef.current && projectHasMore) {
            const nextSkip = projectSkip + 1;
            callApiProjectComment(nextSkip);
        }
    };

    // =========================================================
    // LOAD DATA + SOCKET
    // =========================================================

    useEffect(() => {
        if (!taskId && !projectId) {
            return;
        }

        // Reset
        setDataComment([]);

        setSkip(1);

        setProjectSkip(1);

        setHasMore(true);

        setProjectHasMore(true);

        loadingRef.current = false;

        projectLoadingRef.current = false;

        firstProjectLoadRef.current = true;

        // =====================================================
        // LOAD INITIAL DATA
        // =====================================================

        if (taskId) {
            callApiTaskComment(1);
        }

        if (projectId) {
            callApiProjectComment(
                1,
                true
            );
        }

        // =====================================================
        // SOCKET
        // =====================================================

        const socket = io(env.apiBaseUrl);

        socket.on(
            "connect",
            () => {
                console.log(
                    "Socket connected:",
                    socket.id
                );

                if (taskId) {
                    socket.emit(
                        "join_task",
                        taskId
                    );
                }

                if (projectId) {
                    socket.emit(
                        "join_project",
                        projectId
                    );
                }
            }
        );

        // =====================================================
        // NEW COMMENT
        // =====================================================

        socket.on(
            "new_comment",
            (newComment) => {
                console.log(
                    "🔥 NEW COMMENT:",
                    newComment
                );
                setDataComment(
                    (prev) => [
                        ...prev,
                        newComment,
                    ]
                );

                // Project -> tự scroll xuống cuối
                if (projectId) {
                    requestAnimationFrame(
                        () => {
                            const container =
                                projectScrollRef.current;

                            if (!container) {
                                return;
                            }

                            container.scrollTop =
                                container.scrollHeight;
                        }
                    );
                }
            }
        );

        // =====================================================
        // NEW ATTACHMENT
        // =====================================================

        socket.on(
            "new_attachment",
            (newAttachment) => {
                console.log(
                    "🔥 NEW ATTACHMENT:",
                    newAttachment
                );

                setDataComment(
                    (prev) => [
                        ...prev,
                        newAttachment,
                    ]
                );

                if (projectId) {
                    requestAnimationFrame(
                        () => {
                            const container =
                                projectScrollRef.current;

                            if (!container) {
                                return;
                            }

                            container.scrollTop =
                                container.scrollHeight;
                        }
                    );
                }
            }
        );

        // =====================================================
        // DELETE COMMENT
        // =====================================================

        socket.on(
            "comment_deleted",
            (data) => {
                setDataComment(
                    (prev) =>
                        prev.filter(
                            (item) =>
                                item.id !==
                                data.id
                        )
                );
            }
        );

        // =====================================================
        // DELETE ATTACHMENT
        // =====================================================

        socket.on(
            "attachment_deleted",
            (data) => {
                setDataComment(
                    (prev) =>
                        prev.filter(
                            (item) =>
                                item.id !==
                                data.id
                        )
                );
            }
        );

        // =====================================================
        // CLEANUP
        // =====================================================

        return () => {
            socket.off(
                "new_comment"
            );

            socket.off(
                "new_attachment"
            );

            socket.off(
                "comment_deleted"
            );

            socket.off(
                "attachment_deleted"
            );

            socket.disconnect();
        };

    }, [taskId, projectId]);

    // =========================================================
    // PROJECT - SCROLL TO BOTTOM AFTER INITIAL LOAD
    // =========================================================

    useEffect(() => {
        if (!projectId) {
            return;
        }

        if (
            dataComment.length === 0
        ) {
            return;
        }

        if (
            firstProjectLoadRef.current
        ) {
            requestAnimationFrame(
                () => {
                    const container =
                        projectScrollRef.current;

                    if (!container) {
                        return;
                    }

                    container.scrollTop =
                        container.scrollHeight;

                    firstProjectLoadRef.current =
                        false;
                }
            );
        }
    }, [dataComment, projectId]);

    // =========================================================
    // SORT DATA
    // =========================================================

    const sortedProjectComments =
        [...dataComment].sort(
            (a, b) =>
                new Date(
                    a.created_at ??
                    a.createdAt
                ).getTime() -
                new Date(
                    b.created_at ??
                    b.createdAt
                ).getTime()
        );

    // =========================================================
    // RENDER COMMENT ITEM
    // =========================================================

    const renderCommentItem = (
        items: any,
        index: number,
        project: boolean = false
    ) => {
        const checkFile =
            items?.file_url?.split("/");

        const isMine =
            items?.users?.id ===
            idUser?.state?.user?.id;

        return (
            <div
                key={
                    index
                }
                className={
                    project
                        ? "flex justify-end "
                        : "flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-3 shadow-sm hover:shadow-md transition-shadow"
                }
                style={
                    project
                        ? {
                            justifyContent:
                                isMine
                                    ? "flex-start"
                                    : "flex-start",
                        }
                        : undefined
                }
            >
                <div
                    className={
                        project
                            ? "flex items-end w-fit gap-3 rounded-b-full p-3 shadow-sm hover:shadow-md transition-shadow"
                            : "flex items-start gap-3 w-full"
                    }
                >
                    {/* AVATAR */}

                    <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-500 text-sm font-semibold text-white"
                        style={{
                            backgroundImage:
                                items?.users
                                    ?.avatar_url
                                    ? `url(${items.users.avatar_url})`
                                    : undefined,

                            backgroundRepeat:
                                "no-repeat",

                            backgroundSize:
                                "100% 100%",
                        }}
                    >
                        {items?.users?.full_name
                            ?.charAt(0)
                            ?.toUpperCase() ??
                            "U"}
                    </div>

                    {/* CONTENT */}

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            {!project && (
                                <span className="text-sm font-semibold text-gray-800">
                                    {items?.users
                                        ?.full_name ??
                                        "Người dùng"}
                                </span>
                            )}

                            <span className="text-xs text-gray-400">
                                {items?.createdAt ??
                                    items?.created_at}
                            </span>
                        </div>

                        {/* TEXT COMMENT */}

                        {items?.type ===
                            "comment" ? (
                            <div className="flex min-w-0">
                                <p className="mt-1 text-sm text-gray-700 whitespace-pre-wrap break-words min-w-0">
                                    {items?.content}
                                </p>
                            </div>
                        ) : (
                            <div>
                                {/* FILE */}

                                {checkFile &&
                                    checkFile[4] ===
                                    "raw" && (
                                        <a
                                            href={
                                                items.file_url
                                            }
                                            download={
                                                items.file_name
                                            }
                                            className="min-w-0 truncate text-sm text-gray-700 hover:underline"
                                            title={
                                                items.file_name
                                            }
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
                                                    title={
                                                        items.file_name
                                                    }
                                                >
                                                    {
                                                        items.file_name
                                                    }
                                                </span>

                                                <span className="shrink-0 text-sm text-gray-400">
                                                    {items?.size_bytes
                                                        ? (
                                                            Number(
                                                                items.size_bytes
                                                            ) /
                                                            1024
                                                        ).toFixed(
                                                            1
                                                        )
                                                        : "0.0"}{" "}
                                                    KB
                                                </span>
                                            </div>
                                        </a>
                                    )}

                                {/* IMAGE */}

                                {checkFile &&
                                    checkFile[4] ===
                                    "image" && (
                                        <img
                                            src={
                                                items.file_url
                                            }
                                            alt="Preview"
                                            className="mt-2 max-h-75 max-w-full rounded-lg object-contain"
                                        />
                                    )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // =========================================================
    // RETURN
    // =========================================================

    return (
        <>
            {/* ================================================= */}
            {/* PROJECT COMMENT */}
            {/* ================================================= */}

            {projectId && (
                <div className="w-full min-w-0">
                    <div
                        ref={projectScrollRef}
                        onScroll={handleScrollProject}
                        className="
            flex
            h-100
            w-full
            min-w-0
            gap-3
            flex-col-reverse
            overflow-x-hidden
            overflow-y-auto
            rounded-xl
            border
            border-gray-200
            bg-white
            p-3
            shadow-sm
            scrollbar-hide
        "
                    >
                        {/* LOADING OLD MESSAGE */}
                        {projectLoading && (
                            <div className="flex w-full shrink-0 justify-center py-2">
                                <div
                                    className="
                        rounded-full
                        bg-gray-100
                        px-3
                        py-1.5
                        text-xs
                        text-gray-500
                    "
                                >
                                    Đang tải tin nhắn cũ...
                                </div>
                            </div>
                        )}

                        {/* COMMENT */}
                        <div className="flex w-full min-w-0 flex-col gap-3">
                            {sortedProjectComments.map(
                                (items, index) =>
                                    renderCommentItem(
                                        items,
                                        index,
                                        true
                                    )
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ================================================= */}
            {/* INPUT */}
            {/* ================================================= */}

            <div>
                <form
                    onSubmit={
                        handleSubmit
                    }
                    className="bg-white overflow-hidden"
                >
                    <div className="flex gap-2 border border-gray-200 p-2.5 justify-between items-center">
                        {/* LEFT */}

                        <div className="flex gap-2">
                            {/* IMAGE */}

                            <div>
                                <Input
                                    id={`file-img-${uniqueKey}`}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={
                                        handleImgChange
                                    }
                                    disabled={
                                        commentType !==
                                        null &&
                                        commentType !==
                                        "image"
                                    }
                                />

                                <label
                                    htmlFor={`file-img-${uniqueKey}`}
                                    className={`cursor-pointer text-gray-500 hover:text-blue-500 ${commentType !==
                                        null &&
                                        commentType !==
                                        "image"
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
                                        <rect
                                            width="18"
                                            height="18"
                                            x="3"
                                            y="3"
                                            rx="2"
                                        />

                                        <circle
                                            cx="9"
                                            cy="9"
                                            r="2"
                                        />

                                        <path d="m21 15-3.09-3.09a2 2 0 0 0-2.82 0L6 21" />
                                    </svg>
                                </label>
                            </div>

                            {/* FILE */}

                            <div>
                                <Input
                                    id={`file-upload-${uniqueKey}`}
                                    type="file"
                                    className="hidden"
                                    onChange={
                                        handleFileChange
                                    }
                                    disabled={
                                        commentType !==
                                        null &&
                                        commentType !==
                                        "file"
                                    }
                                />

                                <label
                                    htmlFor={`file-upload-${uniqueKey}`}
                                    className={`cursor-pointer text-gray-500 hover:text-blue-500 ${commentType !==
                                        null &&
                                        commentType !==
                                        "file"
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

                        {/* SEND */}

                        <div>
                            <button
                                type="submit"
                                disabled={
                                    commentType ===
                                    null
                                }
                                className="w-8 h-8 rounded-full flex justify-center items-center cursor-pointer disabled:cursor-not-allowed"
                                style={{
                                    backgroundColor:
                                        commentType !==
                                            null
                                            ? "#3A86FF"
                                            : "#9ca3af",

                                    color: "#fff",
                                }}
                            >
                                {
                                    loading ? <svg
                                        className="animate-spin"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    >
                                        <circle
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                            strokeOpacity="0.25"
                                        />
                                        <path
                                            d="M22 12a10 10 0 0 1-10 10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                            strokeLinecap="round"
                                        />
                                    </svg> : <svg
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

                                }

                            </button>
                        </div>
                    </div>

                    {/* ================================================= */}
                    {/* PREVIEW */}
                    {/* ================================================= */}

                    {(imgPreview ||
                        file) && taskId && (
                            <div className="p-2.5">
                                <div className="p-2.5 flex flex-row gap-2">
                                    {/* IMAGE PREVIEW */}

                                    {imgPreview && (
                                        <div className="relative w-fit boxImg">
                                            <img
                                                src={
                                                    imgPreview
                                                }
                                                alt="Preview"
                                                className="mt-2 max-h-75 max-w-full rounded-lg object-contain"

                                            />

                                            <Button
                                                type="button"
                                                onClick={() =>
                                                    handleDeleteFileOrImg(
                                                        "img"
                                                    )
                                                }
                                                className="shrink-0 text-gray-400 hover:text-gray-700 hoverDelete"
                                            >
                                                ×
                                            </Button>
                                        </div>
                                    )}

                                    {/* FILE PREVIEW */}

                                    {file && (
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
                                                title={
                                                    file.name
                                                }
                                            >
                                                {
                                                    file.name
                                                }
                                            </span>

                                            <span className="shrink-0 text-sm text-gray-400">
                                                {(
                                                    file.size /
                                                    1024
                                                ).toFixed(
                                                    1
                                                )}{" "}
                                                KB
                                            </span>

                                            <Button
                                                type="button"
                                                onClick={() =>
                                                    handleDeleteFileOrImg(
                                                        "file"
                                                    )
                                                }
                                                className="shrink-0 cursor-pointer text-gray-400 hover:text-gray-700"
                                                style={{
                                                    backgroundColor:
                                                        "white",
                                                    color: "gray",
                                                }}
                                            >
                                                ×
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                    {/* ================================================= */}
                    {/* TEXTAREA */}
                    {/* ================================================= */}

                    <div className="border border-gray-200 p-2.5">
                        <textarea
                            value={comment}
                            ref={
                                textareaRef
                            }
                            onChange={
                                handleInput
                            }
                            disabled={
                                commentType !==
                                null &&
                                commentType !==
                                "content"
                            }
                            className={`w-full resize-none overflow-hidden border-none outline-none focus:outline-none ${commentType !==
                                null &&
                                commentType !==
                                "content"
                                ? "cursor-not-allowed opacity-40"
                                : ""
                                }`}
                            placeholder={
                                commentType ===
                                    "image"
                                    ? "Đã chọn ảnh"
                                    : commentType ===
                                        "file"
                                        ? "Đã chọn file"
                                        : "Nhập nội dung..."
                            }
                        />
                    </div>
                </form>
            </div>

            {/* ================================================= */}
            {/* TASK COMMENT */}
            {/* ================================================= */}

            {taskId && (
                <div
                    className="flex flex-col gap-1 mt-2.5 overflow-y-auto scrollbar-hide"
                    style={{
                        maxHeight: "60vh",
                    }}
                    onScroll={
                        handleScrollTask
                    }
                >
                    {[...dataComment].sort(
                        (a, b) =>
                            new Date(b.created_at).getTime() -
                            new Date(a.created_at).getTime()
                    ).map(
                        (
                            items,
                            index
                        ) =>
                            renderCommentItem(
                                items,
                                index,
                                false
                            )
                    )}
                </div>
            )}
        </>
    );
};