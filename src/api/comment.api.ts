import { api } from '@/lib/axios';
import type { CreateComment } from '@/types/comment';
export const commentApi = {
    getComment: (id: string) => api.get(`/comments/${id}`).then((r) => r.data),
    createComment: (data: CreateComment) => api.post("/comments/contents", data).then((r) => r.data),
    createAttach: (data: FormData) =>
        api.post("/comments/attachments", data,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        ).then((r) => r.data)
}