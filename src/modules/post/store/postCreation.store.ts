import { defineStore } from 'pinia'
import { createPost } from '../services/post.api';
import axios, { CanceledError } from 'axios'

type Status = 'initial' | 'ready' | 'loading' | 'canceled' | 'success' | 'error';

export const usePostCreationStore = defineStore('postCreation', {

    state: () => ({
        title: '' as string,
        files: [] as File[],

        tag: '' as string,
        tags: [] as string[],

        visibility: 'public' as 'public' | 'private',
        status: 'initial' as Status,
        error: '' as string,
        progress: 0 as number,
    }),

    actions: {
        selectFile(files: File[]) {
            if (!files.length) { 
                this.error = 'Formato não suportado'; 
                return 
            }

            this.files.push(...files)
            this.status = 'ready'
        },

        removeFile(file: File) {
            this.files = this.files.filter(f => f !== file)
        },

        async sendFiles() {
            if (!this.files.length) {
                this.error = 'Selecione pelo menos um arquivo'
                this.status = 'error'
                return
            }

            const postData = {
                caption: this.title,
                visibility: this.visibility,
                tags: this.tags,
                files: this.files
            }

            this.status = 'loading'

            try {
                await createPost(postData, (pct) => {
                    this.progress = pct
                })

                this.status = 'success'
                this.reset()
            } catch (err) {
                if (err instanceof CanceledError || axios.isCancel?.(err)) {
                    this.status = 'canceled'
                } else {
                    this.status = 'error'
                    this.error = axios.isAxiosError(err)
                        ? (err.response?.data as any)?.message ?? err.message
                        : String(err)
                }
            }
        },

        insertTag(tag: string) {
            const formatedTag = tag.replace(/#/g, '').trim()
            if (formatedTag) {
                this.tags.push(formatedTag)
                this.tag = ''
            }
        },

        removeTag(index: number) {
            this.tags.splice(index, 1)
        },

        changeVisibility() {
            this.visibility = this.visibility === 'public' ? 'private' : 'public'
        },

        getPreviewUrl(file: File) {
            return URL.createObjectURL(file)
        },

        reset() { 
            this.files = []; 
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
        hasFiles: (s) => s.files.length > 0,
        hasTags: (s) => s.tags.length > 0,
        getCountOfVideos: (s) => s.files.filter(f => f.type.startsWith('video/')).length,
        getCountOfImages: (s) => s.files.filter(f => f.type.startsWith('image/')).length
    }
})