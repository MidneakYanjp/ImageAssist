<template>
    <div id="image-assist-app">
            <images-upload
                    v-if="uploading === 'plural' && status === 'open'"
                    @closeChildPage="closeCom"
                    @receiveImageUrl = 'receiveImageUrl'
            ></images-upload>
            <image-upload
                    v-if="uploading === 'single' && status === 'open'"
                    :file="s_file"
            ></image-upload>
        <div class="operation-box">
            <a class="operation-single" href="javascript: void (0)">
                <span v-show="status === 'close'" @click="openComS" class="image-ass-s">单张上传</span>
                <input v-show="status === 'close'" ref="singleImageUpload" @change="sendFile" class="single-image-upload" type="file">
            </a>
            <span v-show="status === 'close'" @click="openComP" class="image-ass-p">多张上传</span>
        </div>
    </div>
</template>

<script>
    import ImagesUpload from './components/ImagesUpload'
    import ImageUpload from './components/ImageUpload'
	export default {
		name: "App",
        extends: require('./components/UploadTemplate/UploadTemplate'),
        created () {
			this.uploading = ''
        },
        components: {ImagesUpload, ImageUpload},
        data () {
			return {
				uploading: '',
                status: 'close',
                s_file: ''
            }
        },
        methods: {
	        receiveImageUrl (urlList) {
	        	console.log(urlList)
            },
            openComS () {
	            this.status = 'open'
            },
	        openComP () {
		        this.status = 'open'
		        this.uploading = 'plural'
            },
            closeCom () {
	        	this.status = 'close'
            },
	        sendFile () {
	        	this.status = 'open'
		        this.uploading = 'single'
                this.s_file = this.$refs.singleImageUpload.files[0]
            }
        }
	}
</script>

<style scoped>
    #image-assist-app .operation-box{
        line-height: 60px;
        border-radius: 5px;
        overflow: hidden;
        position: relative;
    }
    .image-ass-s {
        text-align: center;
        background: #2ec53b;
        color: white;
        cursor: pointer;
        font-size: 17px;
        width: 100%;
        height: 100%;
        opacity: 0.9;
        display: inline-block;
    }
    .image-ass-p {
        text-align: center;
        background: #2ec53b;
        color: white;
        cursor: pointer;
        font-size: 17px;
        margin-bottom: 20px;
        width: 100%;
        opacity: 0.9;
        display: inline-block;
    }
    #image-assist-app .operation-single{
        width: 100%;
        position: relative;
        margin: 40px 0;
        height: 60px;
        display: inline-block;
    }
    #image-assist-app .single-image-upload {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: pointer;
        z-index: 1;
    }
</style>