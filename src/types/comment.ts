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