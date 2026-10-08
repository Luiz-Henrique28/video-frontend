import { defineStore } from 'pinia'
import { createPost } from '../services/post.api';
import axios, { CanceledError } from 'axios'
import { validateMediaFile, MAX_FILES_PER_POST } from '../../../core/config/media';

export interface MediaUploadItem {
    id: string;
    file: File;
    previewUrl: string;
    type: 'image' | 'video';
}

type Status = 'initial' | 'ready' | 'loading' | 'canceled' | 'success' | 'error';

export const usePostCreationStore = defineStore('postCreation', {

    state: () => ({
        title: '' as string,
        items: [] as MediaUploadItem[],

        tag: '' as string,
        tags: [] as string[],

        visibility: 'public' as 'public' | 'private',
        status: 'initial' as Status,
        error: '' as string,
        progress: 0 as number,
    }),

    actions: {
        selectFile(newFiles: File[]) {
            if (!newFiles.length) { 
                return;
            }

            this.error = '';

            if (this.items.length + newFiles.length > MAX_FILES_PER_POST) {
                this.error = `Limite máximo de ${MAX_FILES_PER_POST} arquivos por publicação atingido.`;
                return;
            }

            const validItems: MediaUploadItem[] = [];

            for (const file of newFiles) {
                const validation = validateMediaFile(file);
                if (!validation.valid) {
                    this.error = validation.error ?? 'Arquivo inválido';
                    validItems.forEach(i => URL.revokeObjectURL(i.previewUrl));
                    return;
                }

                const previewUrl = URL.createObjectURL(file);
                validItems.push({
                    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
                    file,
                    previewUrl,
                    type: file.type.startsWith('image/') ? 'image' : 'video',
                });
            }

            this.items.push(...validItems);
            this.status = 'ready';
        },

        removeFile(target: File | MediaUploadItem) {
            const index = this.items.findIndex(item => 
                'id' in target ? item.id === target.id : item.file === target
            );

            if (index !== -1) {
                const [removed] = this.items.splice(index, 1);
                URL.revokeObjectURL(removed.previewUrl);
            }

            if (this.items.length === 0) {
                this.status = 'initial';
            }
        },

        async sendFiles() {
            if (!this.items.length) {
                this.error = 'Selecione pelo menos um arquivo';
                this.status = 'error';
                return null;
            }

            const postData = {
                caption: this.title,
                visibility: this.visibility,
                tags: this.tags,
                files: this.items.map(item => item.file)
            };

            this.status = 'loading';
            this.error = '';

            try {
                const response = await createPost(postData, (pct) => {
                    this.progress = pct;
                });

                this.status = 'success';
                const createdId = response.data?.id;
                this.reset();
                return createdId;
            } catch (err) {
                if (err instanceof CanceledError || axios.isCancel?.(err)) {
                    this.status = 'canceled';
                } else {
                    this.status = 'error';
                    this.error = axios.isAxiosError(err)
                        ? (err.response?.data as any)?.message ?? err.message
                        : String(err);
                }
                return null;
            }
        },

        insertTag(tag: string) {
            const formatedTag = tag.replace(/#/g, '').trim();
            if (formatedTag && !this.tags.includes(formatedTag)) {
                this.tags.push(formatedTag);
                this.tag = '';
            }
        },

        removeTag(index: number) {
            this.tags.splice(index, 1);
        },

        changeVisibility() {
            this.visibility = this.visibility === 'public' ? 'private' : 'public';
        },

        getPreviewUrl(file: File) {
            const item = this.items.find(i => i.file === file);
            return item ? item.previewUrl : '';
        },

        reset() { 
            this.items.forEach(item => URL.revokeObjectURL(item.previewUrl));
            this.items = [];
            this.progress = 0; 
            this.status = 'initial'; 
            this.error = '';
            this.title = '';
            this.tags = [];
            this.tag = '';
            this.visibility = 'public';
        },
    },

    getters: {
        files: (s) => s.items.map(item => item.file),
        hasFiles: (s) => s.items.length > 0,
        hasTags: (s) => s.tags.length > 0,
        getCountOfVideos: (s) => s.items.filter(item => item.type === 'video').length,
        getCountOfImages: (s) => s.items.filter(item => item.type === 'image').length
    }
})
