<template>

    <!-- aqui vem a importacao de componente de navbar futuramente -->

    <main class="container-fluid d-flex flex-column my-3">

        <div id="title" class="row">

            <div class="">
                <input type="text" placeholder="Add a title" class="basic-input col-12 p-2" v-model="title"
                    required></input>
            </div>
        </div>

        <div id="postOwner" class="row">

            <!-- aqui vai ter o nome do dono da publicacao e possivelmente a foto -->

            <div class="col-3">
                <img src="" alt=""> (imagem)
            </div>

            <div class="col-3">
                <p> (nome)</p>
            </div>

        </div>

        <div id="viewsAndSettings" class="d-flex justify-content-end mb-3 align-items-center">

            <div class="me-3" v-if="getCountOfVideos"> <i class="bi bi-camera-video-fill"> </i> {{ getCountOfVideos }} </div>
            <div class="me-3" v-if="getCountOfImages"> <i class="bi bi-camera-fill"></i> {{getCountOfImages }} </div>

            <!-- futuramente vai vir a contagem de visualizacao do post com incone de olho -->
            <div class="me-3"> <i class="bi bi-eye-fill"></i> 0 </div>

            <div class="dropdown ">
                <button class="btn btn-outline-custom" type="button" data-bs-toggle="dropdown" aria-expanded="false"
                    style="">
                    <i class="bi bi-gear"></i>
                </button>
                <ul class="dropdown-menu">
                    <li class="dropdown-item"> <i class="bi bi-check-lg"></i> SAVE</li>
                    <li class="dropdown-item" v-if="visibility === 'private'" @click="postStore.changeVisibility()"><i
                            class="bi bi-globe"></i> <span class="dropdonw-item"> MAKE PUBLIC </span></li>
                    <li class="dropdown-item" v-else-if="visibility === 'public'" @click="postStore.changeVisibility()">
                        <i class="bi bi-file-earmark-lock"></i> <span class="dropdonw-item"> MAKE PRIVATE </span>
                    </li>
                    <li class="dropdown-item" href="#">DELETE</li>
                </ul>
            </div>
        </div>

        <div id="sendMedia" class="">

            <div class="mb-3">

                <!-- listagem de midias publicadas -->
                <ul v-if="hasFiles" class="p-0">
                    <li v-for="(file, i) in files" :key="i" class="list-unstyled position-relative w-100 mb-3">
                        <!-- <span class="file-name">{{ file.name }}</span> -->

                        <!-- <span class="file-size">{{ file.size }}</span> -->

                        <img v-if="file.type.startsWith('image/')" :src="postStore.getPreviewUrl(file)" class="w-100">

                        <video v-if="file.type.startsWith('video/')" controls="true" :src="postStore.getPreviewUrl(file)" class="w-100"></video>

                        <button @click="postStore.removeFile(file)" class="btn-remove-media position-absolute top-0 end-0 m-2">
                            <i class="bi bi-x-lg"></i>
                        </button>
                    </li>
                </ul>

                <label for="file-upload" class="file-upload-area">
                    <i class="bi bi-plus-lg"></i>
                    <p>Click to add or drag and drop</p>
                </label>

                <input type="file" name="" id="file-upload" multiple @change="selectFile">

                <!-- dropdown de settings -->

                <div v-if="status === 'loading'">
                    <p>Enviando… {{ progress }}%</p>
                    <progress :value="progress" max="100" />
                    <!-- <button @click="postStore.cancel">Cancelar</button> -->
                </div>
            </div>

            <div id="addTags" class="mb-5">

                <label class="mb-3 basic-input col-12 p-3" for="input-tag"
                    @keypress.enter.prevent="postStore.insertTag(tag)">

                    <!-- tags -->
                    <ul v-if="hasTags" class="d-flex flex-wrap list-unstyled">
                        <li v-for="(tag, i) in tags" :key="i" class="border p-1 me-1 d-flex align-items-center">
                            <span class="text-truncate d-inline-block me-1" style="max-width: 70vw;"> #{{ tag }} </span>
                            <button type="button" class="btn btn-sm text-white"
                                @click="postStore.removeTag(i)">x</button>
                        </li>
                    </ul>
                    <!-- tags -->

                    <!-- a forma como tirei o focus do input pode nao ser a melhor maneira -->
                    <input id="input-tag" type="text" placeholder="Add tags (entrer key to create it)"
                        class="col-12 p-3 border-0 focus-ring focus-ring-dark" v-model="tag"></input>
                </label>

                <div class="text-start">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur eius eos
                </div>
            </div>

            <div class="text-center mt-4">
                <button id="saveBtn" @click="postStore.sendFiles()"><i class="bi bi-check-lg"></i> SAVE </button>
            </div>

        </div>

    </main>

</template>

<script setup lang="ts">

import { storeToRefs } from 'pinia'
import { usePostCreationStore } from '../store/postCreation.store'

const postStore = usePostCreationStore()
const { title, files, status, tag, tags, progress, visibility, hasFiles, getCountOfImages, getCountOfVideos, hasTags } = storeToRefs(postStore)

function selectFile(e: Event) {
    const input = e.target as HTMLInputElement
    const files = Array.from(input.files ?? [])

    console.log(getCountOfImages)

    postStore.selectFile(files)
    input.value = ''
}

</script>


<style lang="css" scoped>
.icon-lg {
    font-size: xx-large;
    font-weight: bolder;
}

.basic-input {
    border: 2px dashed var(--border-color);
    padding: 6px;
    background-color: transparent;
    color: var(--text-primary);
}

.basic-input::placeholder {
    font-size: large;
    color: var(--text-muted);
}

.basic-input:focus {
    outline: none;
    border-color: var(--primary-color);
    background-color: var(--bg-card);
}

/* Esconde o input de arquivo padrão */
#file-upload {
    display: none;
}

/* Estiliza a área clicável */
.file-upload-area {
    width: 100%;
    padding: 3rem;
    border: 2px dashed var(--border-color);
    text-align: center;
    cursor: pointer;
    transition: var(--transition-normal);
}

.file-upload-area:hover {
    border-color: var(--primary-color);
}

.file-upload-area i {
    font-size: xx-large;
}

.file-upload-area p {
    color: var(--text-muted);
    font-weight: 500;
    font-size: larger;
}

/* Estilo padrão: botão sem fundo, com borda e texto coloridos */
.btn-outline-custom {
    color: var(--primary-color);
    background-color: transparent;
    border: 2px solid var(--primary-color);
    transition: var(--transition-normal);
}

.btn-outline-custom:hover {
    color: var(--text-white);
    background-color: var(--primary-color);
    border-color: var(--primary-color);
}

#saveBtn {
    color: var(--text-white);
    background-color: var(--primary-color);
    border: none;
    padding: 0.5rem 1.5rem;
    cursor: pointer;
    transition: var(--transition-normal);
}

#saveBtn:hover {
    background-color: var(--primary-hover);
}

.dropdown-menu {
    background-color: var(--bg-secondary);
    border: 2px solid var(--border-color);
}

.dropdown-menu li {
    color: var(--text-muted);
}

/* Input de tags */
#input-tag {
    background-color: transparent;
    color: var(--text-primary);
}

#input-tag::placeholder {
    color: var(--text-muted);
}

#input-tag:focus {
    background-color: var(--bg-card);
    outline: none;
}

/* Botão de remover mídia */
.btn-remove-media {
    background-color: rgba(255, 255, 255, 0.9);
    border: none;
    border-radius: var(--radius-sm);
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: var(--transition-normal);
    padding: 0;
    color: #333;
    font-size: 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.btn-remove-media:hover {
    background-color: var(--error);
    color: var(--text-white);
    transform: scale(1.1);
}

.btn-remove-media:active {
    transform: scale(0.95);
}
</style>