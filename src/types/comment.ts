export interface CreateComment {
    task_id: string | null;
    project_id: string | null;
    content: string,
    type: string
}
export interface CreateAttach {
    task_id: string | null;
    project_id: string | null;
    file: File | null;
    type: string
}
export interface CommentProps {
    taskId: string | null;
    projectId: string | null;
}

export interface CommentUser {
    id: string;
    full_name?: string;
    avatar_url?: string;
}

export interface CommentItem {
    id: string;
    task_id?: string | null;
    project_id?: string | null;
    content?: string;
    type: string;
    created_at?: string;
    createdAt?: string;
    users?: CommentUser;
    file_url?: string;
    file_name?: string;
    size_bytes?: number | string;
}