<template>
    <div class="image-ass-container">
        <div v-if="lookingSrc" class="ass-original-box">
            <div @click="lookingSrc = ''" class="original-real-part center-vertical">
                <img class="ass-original-real" :src="lookingSrc" alt="">
            </div>
        </div>
        <div class="center-vertical image-ass-wrapper">
            <div v-show="!imageList.length" class="image-ass-add center-vertical">
                <input @click="emptyContent" ref="fileBox" @change="uploadImg" multiple="multiple" accept="image/*" class="upload-enter" type="file">
            </div>
            <div v-show="imageList.length" class="ass-upload-title">已选{{imageList.length}}张图片</div>
            <ul class="image-ass-list">
                <li v-for="(mItem, index) in imageList" class="image-ass-item">
                    <div class="image-reset-box">
                        <div @click="lookingOriginal(index)" class="ass-look-original">查看大图</div>
                        <img class="image-reset-real center-vertical" :src="mItem" alt="">
                    </div>
                    <p class="image-ass-operation">
                        <a @click="addWatermark(index)" class="operation-preview operation-btn" href="javascript: void (0)">水印</a>
                        <button class="ass-fix-btn"></button>
                        <a @click="cancelImage(index)" class="operation-cancel operation-btn" href="javascript: void (0)">删除</a>
                    </p>
                </li>
            </ul>
            <div class="ass-emit-part">
                <button @click="addImage" v-if="imageList.length" class="ass-emit-btn">添加</button>
                <button @click="sendImageUrl" v-if="imageList.length" class="ass-emit-btn">确认</button>
                <button @click="closePage" class="ass-emit-btn">取消</button>
            </div>
        </div>
    </div>
</template>

<script>
	export default {
		name: "ImageUpload",
        extends: require('./UploadTemplate/UploadTemplate').default,
        data () {
			return {
				imageList: [],
                readIndex: 0,
                originalImage: [],
                originalUrlList: [],
				lookingSrc: ''
            }
        },
        methods: {
	        lookingOriginal(i) {
	        	this.lookingSrc = this.originalUrlList[i]
            },
	        closePage () {
	        	this.$emit('closeChildPage')
            },
	        sendImageUrl () {
	        	this.$emit('receiveImageUrl', this.imageList)
            },
	        cancelImage (i) {
	        	this.imageList.splice(i, 1)
		        this.originalUrlList.splice(i, 1)
            },
            emptyContent () {
	            var file = this.$refs.fileBox
	            file.value = ''
            },
            addImage () {
	        	this.emptyContent()
	            this.$refs.fileBox.click()
            },
	        uploadImg () {
	        	this.originalImage = this.$refs.fileBox.files
		        this._base64 (this.originalImage)
            },
            _base64 (fileList) {
	        	if (this.readIndex + 1 > fileList.length) {
			        this.originalImage = []
			        this.readIndex = 0
	        		return 'complete'
                }
	        	let reader = new FileReader()
                let file = fileList[this.readIndex]
                let type = file.type
                let _this = this
                let canvas = this.createCanvas()
                let ctx = canvas.getContext('2d')
                reader.readAsDataURL(file)
                reader.onload = function (e) {
                    let result = e.target.result
                    _this.originalUrlList.push(result)
                    let image = new Image()
                    image.src = result
                    image.onload = function () {
                        let resizeImage = _this.resetSize(150, this.width, this.height)
                        this.height = canvas.height = resizeImage.height
	                    this.width = canvas.width = resizeImage.width
                        ctx.drawImage(this, 0, 0, canvas.width, canvas.height)
                        let compressionUrl = canvas.toDataURL(type, 0.92)
                        _this.imageList.push(compressionUrl)
                        _this.readIndex++
                        _this._base64(_this.originalImage)
                    }
                }
            },
            addWatermark (index) {
	        	let canvas = this.createCanvas()
                let ctx = canvas.getContext('2d')
	            let image = new Image()
                let _this = this
	            image.src = this.originalUrlList[index]
	            image.onload = function () {
                    canvas.height = this.height
                    canvas.width = this.width
		            ctx.drawImage(this, 0, 0, this.width, this.height)
                    let max = this.width / 30
		            ctx.font = max + "px 微软雅黑"
		            ctx.fillStyle = "#fff"
		            ctx.fillText('呵呵',this.width*0.8, this.height*0.95)
		            _this.originalUrlList[index] = canvas.toDataURL()
                }
            }
        }
	}
</script>

<style scoped>
    .center-vertical {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    .image-ass-container {
        position: fixed;
        width: 100%;
        top: 0;
        left: 0;
        height: 100%;
        background: rgba(0,0,0,0.6);
        z-index: 9;
    }
    .image-ass-container .ass-original-box{
        position: absolute;
        z-index: 99;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
    }
    .image-ass-container .original-real-part{
        background: #fff;
        width: auto;
        height: auto;
        max-height: 520px;
    }
    .image-ass-container .ass-original-real{
        max-height: 520px;
    }
    .image-ass-container .image-ass-wrapper {
        background: #fff;
        width: 86%;
        min-width: 950px;
        min-height: 600px;
        height: 86%;
    }
    .image-ass-container .ass-upload-title {
        height: 80px;
        color: #fff;
        text-align: center;
        line-height: 80px;
        width: 100%;
        background: #449eaf;
    }
    .image-ass-container .image-ass-list {
        overflow: scroll;
        position: absolute;
        top: 80px;
        bottom: 60px;
        height: auto;
        padding: 30px;
    }
    .image-ass-container .image-ass-list:after {
        content: '';
        display: table;
        clear: both;
    }
    .image-ass-container .image-ass-item {
        float: left;
        margin-right: 40px;
        position: relative;
        padding: 10px;
        margin-bottom: 20px;
    }
    .image-ass-container .image-reset-box {
        height: 150px;
        width: 150px;
        padding: 10px;
        position: relative;
        border: 1px solid #c7c7c7;
    }
    .image-ass-container .ass-look-original {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        z-index: 1;
        text-align: center;
        color: #fcfcfc;
        font-size: 14px;
        line-height: 150px;
        background: rgba(0,0,0, 0.6);
    }
    .image-ass-container .ass-look-original:hover {
        opacity: 1;
    }
    .image-ass-container .image-reset-real {
    }
    .image-ass-container .image-ass-operation {
        height: 40px;
        line-height: 40px;
    }
    .image-ass-container .operation-btn {
        text-decoration: none;
        font-size: 14px;
        line-height: 0;
        display: inline-block;
        padding: 15px 19px;
        color: #fff;
        position: relative;
        top: 0;
        border: none;
        border-radius: 4px;
        transition: top .3s;
    }
    .image-ass-container .operation-preview {
        background: #55a859;
      }
    .image-ass-container .operation-preview:hover {
        box-shadow: 2px 4px 10px #5a805e;
        top: -2px;
        opacity: 0.7;
    }
    .image-ass-container .operation-cancel {
        background: #cd5741;
    }
    .image-ass-container .operation-cancel:hover {
        box-shadow: 2px 4px 10px #ffb0b0;
        top: -2px;
        opacity: 0.7;
    }
    .image-ass-container .image-ass-add {
        width: 200px;
        color: #555555;
        cursor: pointer;
        height: 200px;
    }
    .image-ass-container .ass-fix-btn{
        font-size: 0;
        width: 10px;
        outline: none;
        border: none;
    }
    .image-ass-container .image-ass-add:hover {
        color: #46b7e5;
    }
    .image-ass-container .image-ass-add:before {
        position: absolute;
        top: 25px;
        left: 90px;
        content: '';
        border-left: 10px solid;
        height: 150px;
    }
    .image-ass-container .image-ass-add:after {
        position: absolute;
        top: 90px;
        left: 20px;
        content: '';
        border-bottom: 10px solid;
        width: 150px;
    }
    .image-ass-container .upload-enter {
        opacity: 0;
        z-index: 1;
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        left: 0;
    }
    .image-ass-container .ass-emit-part {
        position: absolute;
        bottom: 0;
        height: 60px;
        line-height: 60px;
        width: 100%;
        left: 0;
        text-align: center;
        background: #449eaf;
    }
    .image-ass-container .ass-emit-btn{
        padding: 5px 20px;
        margin-right: 20px;
        color: white;
        background: transparent;
        border: none;
        font-size: 16px;
        cursor: pointer;
        outline: none;
    }
</style>