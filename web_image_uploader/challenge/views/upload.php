<!DOCTYPE html>
<html lang="en">
<head>
    <title>Image Uploader</title>
    <meta name="author" content="makelaris, makelarisjr">
    <link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet"/>
</head>
<body class="bg-gray-900">
    <div id="app" class="h-screen w-screen">
        <div class="container mx-auto max-w-screen h-full">
            <div class="flex flex-col justify-center items-center h-screen">
                <h1 class="py-4 mb-4 text-white text-3xl">
                    Image Uploader
                </h1>
                <div class="flex flex-col bg-white shadow-lg rounded-lg">
                    <div class="flex flex-col p-8">
                        <div
                            :class="[this.drag ? '' : 'border-dashed', 'border-4', 'border-gray-400', 'py-12', 'flex', 'flex-col', 'justify-center', 'items-center']"
                            @dragover.prevent="dragOver"
                            @dragleave="dragLeave"
                            @drop.prevent="drop"
                        >
                            <h1
                                v-show="!this.uploading && this.message !== ''"
                                class="px-28"
                                style="display:none"
                            >
                                {{ this.message }}
                            </h1>
                            <h1
                                v-show="this.uploading"
                                class="px-28"
                                style="display:none"
                            >
                                Uploading image...
                            </h1>
                            <div
                                v-if="!this.uploading && this.message === ''"
                                class="flex flex-col justify-center items-center"
                            >
                                <p class="mb-3 px-3 font-semibold text-gray-900 flex flex-wrap justify-center">
                                    <span>Drag and drop or select the image you want to share.</span>
                                </p>
                                <input ref="fileInput" @change="fileChanged" type="file" class="hidden" />
                                <button 
                                    class="rounded-md px-3 py-1 bg-gray-700 hover:bg-gray-900 text-white focus:shadow-outline focus:outline-none"
                                    @click.prevent="selectImage()"
                                >
                                    Select Image
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
<script src="https://cdn.jsdelivr.net/npm/vue@2.6.12/dist/vue.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.21.1/axios.min.js"></script>
<script>
new Vue({
    el: '#app',
    data: {
        uploading: false,
        drag: false,
        message: ''
    },
    methods: {
        fileChanged() {
            let file = this.$refs.fileInput.files[0];
            this.uploadImage(file);
        },
        selectImage() {
            this.$refs.fileInput.click();
        },
        drop(e) {
            this.drag = false;
            this.$refs.fileInput.files = event.dataTransfer.files;
            this.fileChanged();
        },
        dragOver() {
            this.drag = true;
        },
        dragLeave() {
            this.drag = false;
        },
        uploadImage(image) {
            this.uploading = true;
            this.message = '';
            
            let formData = new FormData();
            formData.append('uploadFile', image);

            axios
                .post('/api/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                .then(({ data }) => {
                    if (!data.image) {
                        this.uploading = false;
                        this.message   = 'Something went wrong';
                    } else {
                        window.location.href = data.image;
                    }
                })
                .catch(() => {
                    this.uploading = false;
                    this.message   = 'Something went wrong';
                })
        }
    }
});
</script>
</html>