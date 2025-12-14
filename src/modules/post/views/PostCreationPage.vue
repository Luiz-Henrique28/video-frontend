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

                        <button @click="postStore.removeFile(file)" class="position-absolute end-0 my-2 mx-2">x</button>
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

            <button id="saveBtn" @click="postStore.sendFiles()"><i class="bi bi-check-lg"></i> SAVE </button>

        </div>

    </main>

</template>

<script setup lang="ts">

import { storeToRefs } from 'pinia'
import { usePostCreationStore } from '../store/postCreation.store'

const postStore = usePostCreationStore()
const { title, files, status, tag, tags, progress, visibility, hasFiles, getCountOfImages, getCountOfVideos, hasTags, error } = storeToRefs(postStore)

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
    border: 2px dashed #999999;
    padding: 6px;
}

.basic-input::placeholder {
    font-size: large;
}

/* Esconde o input de arquivo padrão */
#file-upload {
    display: none;
}

/* Estiliza a área clicável */
.file-upload-area {
    width: 100%;
    /* max-width: 400px; */
    padding: 3rem;
    border: 2px dashed #999999;
    /* border-radius: 8px; */
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
}

.file-upload-area:hover {
    border-color: #007bff;
    /* Mude a cor da borda ao passar o mouse */
    /* background-color: #f8f9fa; */
    /* Adicione um fundo leve */
}

.file-upload-area i {
    font-size: xx-large;
}

.file-upload-area p {
    color: #999999;
    font-weight: 500;
    font-size: larger;
}

/* Estilo padrão: botão sem fundo, com borda e texto coloridos */
.btn-outline-custom {
    color: rgb(162, 0, 221);
    /* Cor do texto */
    background-color: rgba(0);
    /* Fundo transparente */
    border: 2px solid rgb(162, 0, 221);
    /* Borda com a mesma cor */
}

/* Estilo para quando o mouse passar por cima */
.btn-outline-custom:hover {
    color: #fff;
    /* Cor do texto muda para branco */
    background-color: rgb(162, 0, 221);
    /* Fundo ganha cor */
    border-color: rgb(162, 0, 221);
    /* Borda mantém a cor */
}

#saveBtn {
    color: #232323;
    background-color: rgb(162, 0, 221);
}

.dropdown-menu {
    background-color: #232323;
    border: 2px solid #999999;
}

.dropdown-menu li {
    color: #999999;
}
</style>