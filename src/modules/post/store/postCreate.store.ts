import { defineStore } from 'pinia'
import { createPost, uploadMedia } from '../services/post.api';
import axios, { CanceledError } from 'axios'

type Status = 'initial' | 'ready' | 'loading' | 'canceled' | 'success' | 'error';

export const usePostCreateStore = defineStore('postCreate', {

    state: () => ({
        title: '' as string,
        files: [] as File[],

        tag: '' as string,
        tags: [] as string[],

        visibility: 'public' as 'public' | 'private',
        status: 'initial' as Status,
        error: '' as string,
        progress: 0 as number,
        // abortCtrl: null as AbortController | null,
    }),

    actions: {
        selectFile(files: File[]) {

            if (!files.length) { this.error = 'Formato não suportado'; return }
            // talvez validar o tipo de arquivo aqui ou coisa do tipo

            this.files.push(...files)
            this.status = 'ready'
        },

        removeFile(file: File) {
            // ou
            // removeFile(i: number) { this.files.splice(i, 1) }
            this.files = this.files.filter(f => f !== file)
        },

        async sendFiles() {

            const fakeJson = {
                userId: 66, // TODO - isso aqui tem que vim do usuario logado
                caption: this.title,
                visibility: this.visibility,
                tags: this.tags
            }

            console.log(fakeJson)

            this.status = 'loading'


            try {
                const result = await createPost(fakeJson)
                console.log("resultado do create post",result)

                //this.abortCtrl = new AbortController()

                if (result?.data.user_id && result?.data.id) {

                    //this.abortCtrl = new AbortController()

                    try {
                        console.log("files que vao ser uplodadas" ,this.files)

                        await uploadMedia(
                            this.files,
                            result?.data.id,
                            result?.data.user_id,

                            (pct) => (this.progress = pct),
                            //this.abortCtrl.signal
                        )
                    } catch (e) {
                        this.status = 'error'
                        this.error = e as string
                        console.log("caiu no catch")
                    }

                    this.status = 'success'
                    this.reset()
                }
            } catch (err) {

                if (err instanceof CanceledError || axios.isCancel?.(err)) {
                    this.status = 'canceled'
                } else {
                    this.status = 'error'
                    this.error = axios.isAxiosError(err)
                        ? (err.response?.data as any)?.message ?? err.message
                        : String(err)
                }
            } finally {
                //this.abortCtrl = null
            }

        },

        insertTag(tag: string) {
            const formatedTag = tag.replace(/#/g, '').trim()

            this.tags.push(formatedTag)
            this.tag = ''

        },

        removeTag(index:number) {
            this.tags.splice(index, 1)
            console.log(this.tags)
        },

        // feature de cancelar mais para frente 
        //cancel() {
            //this.abortCtrl?.abort()
            //this.status = 'initial'
        //},

        changeVisibility() {
            this.visibility === 'public' ? this.visibility = 'private' : this.visibility = 'public'
        },

        getPreviewUrl(file: File) {
            return URL.createObjectURL(file)
        },

        reset() { this.files = []; this.progress = 0; this.status = 'initial'; this.error = '' },

    },

    getters: {
        hasFiles: (s) => s.files.length > 0,
        hasTags: (s) => s.tags.length > 0,
        getCountOfVideos: (s) => s.files.filter(f => f.type.startsWith('video/')).length,
        getCountOfImages: (s) => s.files.filter(f => f.type.startsWith('image/')).length
    }

})
