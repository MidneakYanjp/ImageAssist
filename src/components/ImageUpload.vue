<template>
    <div class="single-upload">
        <div class="single-upload-title">图片截取</div>
        <div ref="showBox" class="single-upload-show">
            <div class="overlay vertical-center">
                <div class="overlay-outer"></div>
            </div>
            <div
                    @mousedown.prevent="dragStart"
                    @mouseup.stop = 'endmove'
                    ref="moveImage"
                    class="activated-box">
                <i @mousedown.stop="resizingStart('nw')" class="resize-handle resize-handle-nw"></i>
                <i @mousedown.stop="resizingStart('ne')" class="resize-handle resize-handle-ne"></i>
                <img ref="imageReal"
                        class="resize-image" :src="url" alt="">
                <i @mousedown.stop="resizingStart('sw')" class="resize-handle resize-handle-sw"></i>
                <i @mousedown.stop="resizingStart('se')"
                   class="resize-handle resize-handle-se"></i>
            </div>
            <input type="button" value="create" class="canvas-create">
        </div>
        <div class="close-page">
            取消
        </div>
    </div>
</template>

<script>
    import '../assets/styles/single_upload.css'
	export default {
		name: "ImageUpload",
        props: ['file'],
		extends: require('./UploadTemplate/UploadTemplate').default,
        mounted () {
			let reader = new FileReader()
            reader.readAsDataURL(this.file)
            let image = new Image()
            reader.onload = e => {
				image.src = e.target.result
				this.originalUrlList = image
			}
            document.addEventListener('mouseup', this.endmove)
			this.drawImage()
        },
        data () {
			return {
				url: '',
                orgImageUrl: '',
                canMove: false,
                canResize: false,
                ePageX: 0,
                ePageY: 0,
                partX: 0,
                partY: 0,
                canvasW: 0,
                canvasH: 0,
                direction: '',
                ImageWidth: '',
                ImageHeight: '',
                reL: '',
                reT: ''
            }
         },
        computed: {
	        imageReal () {
	        	return this.$refs.imageReal
            },
            imageParent () {
	        	return this.$refs.moveImage
            }
        },
        watch: {
			canResize (val) {
				if (!val) {
					document.removeEventListener('mousemove', this.resizing)
                }
            }
        },
        methods: {
	        resizingStart (direction) {
	        	this.canResize = !this.canResize
	        	// console.log(this.imageParent.style.left = '20px')
	        	let e = window.event
		        this.ePageX = e.pageX
		        this.ePageY = e.pageY
                this.direction = direction
		        this.ImageWidth = this.imageReal.clientWidth
		        this.ImageHeight = this.imageReal.clientHeight
		        this.reL = parseInt(this.imageParent.style.left.replace('px', '')) || 0
		        this.reT = parseInt(this.imageParent.style.top.replace('px', '')) || 0
                document.addEventListener('mousemove', this.resizing)
            },
            resizing (e) {
	        	e.preventDefault()
	            let widthSize = e.pageX - this.ePageX
	            let heightSize = e.pageY - this.ePageY
                let width
                let height
                let left
                let top
	        	switch (this.direction) {
                    case 'se': {
	                    width = this.ImageWidth + widthSize
	                    height = this.ImageHeight + heightSize
	                    left = this.reL + widthSize/2 + 'px'
	                    top = this.reT
                        break
                    }
                    case 'ne': {
	                    width = this.ImageWidth + widthSize
	                    height = this.ImageHeight - heightSize
	                    left = this.reL + widthSize/2 + 'px'
                        top = this.reT + heightSize + 'px'
	                    break
                    }
			        case 'sw': {
				        width = this.ImageWidth - widthSize
				        height = this.ImageHeight + heightSize
				        left = this.reL + widthSize/2 + 'px'
				        top = this.reT
				        break
			        }
			        case 'nw': {
				        width = this.ImageWidth - widthSize
				        height = this.ImageHeight - heightSize
				        left = this.reL + widthSize/2 + 'px'
                        top = this.reT + heightSize + 'px'
				        break
			        }
                }
                if (width > 60 && height > 60 && height < 600 && width < 1050) {
	                this.resizeImage(width, height)
                    this.imageParent.style.left = left
                    this.imageParent.style.top = top
                }
            },
	        unresizing () {
	        	document.removeEventListener('mousemove', this.resizing)
            },
            resizeImage (w, h) {
                let canvas = this.createCanvas()
                let cxt = canvas.getContext('2d')
                canvas.width = w
                canvas.height = h
                cxt.drawImage(this.originalUrlList, 0, 0, w, h)
	            this.url = canvas.toDataURL('image/png', 1)
            },
	        dragStart (e) {
		        document.addEventListener('mousemove', this.moving)
                this.ePageX = e.pageX
                this.ePageY = e.pageY
                this.partX = parseInt(this.$refs.moveImage.style.left.replace('px', '')) || 0
                this.partY = parseInt(this.$refs.moveImage.style.top.replace('px', '')) || 0
            },
            moving (e) {
	        	let movBox = this.$refs.moveImage
                movBox.style.left = this.partX + e.pageX - this.ePageX + 'px'
                movBox.style.top = this.partY + e.pageY - this.ePageY + 'px'
            },
	        endmove (e) {
	        	console.log('end')
	        	let showBox = this.$refs.showBox
                if (e.pageX < showBox.offsetLeft || e.pageY < showBox.offsetTop || e.pageX > showBox.offsetLeft + showBox.clientWidth || e.pageY > showBox.offsetTop + showBox.clientHeight) {
	        		return false
                }
                document.removeEventListener('mousemove', this.moving)
            },
			drawImage () {
				let reader = new FileReader()
                let _this = this
                reader.readAsDataURL(this.file)
                reader.onload = function (e) {
	                let canvas = _this.createCanvas()
	                let cxt = canvas.getContext('2d')
	                let image = new Image()
                    image.src = e.target.result
                    image.onload = function () {
                        let resizeAttr = _this.resetSize(980, 580, this.width, this.height)
                        this.width = canvas.width = resizeAttr.width
                        this.height = canvas.height = resizeAttr.height
                        cxt.drawImage(this, 0, 0, this.width, this.height)
	                    _this.url = canvas.toDataURL()
                    }
                }
            },
	        resetSize (setW, setH, width, height) {
		        let imgScale = {}
		        let w = 0, h = 0;
		        if (width < setW && height < setH) {
			        imgScale = {
				        height,
				        width
			        }
		        }else {
		        	if (width > setW && height < setH) {
		        		imgScale = {
		        			width: setW,
                            height: height * setW / width
                        }
                    } else if (width < setW && height > setH) {
				        imgScale = {
					        width: width * setH / height,
					        height: setH
				        }
                    } else {
		        		if (width / setW > height / setH) {
		        			imgScale = {
		        				width: setW,
                                height: height * setW / width
                            }
                        } else {
					        imgScale = {
						        width: width * setH / height,
						        height: setH
					        }
                        }
                    }
                }
		        return imgScale
	        },
        }
	}
	// http://wow.techbrood.com/fiddle/2580
</script>

<style scoped>
</style>