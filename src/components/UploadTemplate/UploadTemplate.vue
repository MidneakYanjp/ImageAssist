<template>
    <div class="image-ass-template"></div>
</template>

<script>
	export default {
		name: "UploadTemplate",
        methods: {
	        createCanvas () {
		        let canvas
		        canvas = document.getElementById('image_ass_canvas')
		        if (!canvas) {
			        var canvasEl = document.createElement('canvas')
			        canvasEl.setAttribute('id', 'image_ass_canvas')
                    canvasEl.setAttribute('margin', '0 auto')
			        canvasEl.setAttribute('style', 'display: none')
			        document.body.appendChild(canvasEl)
			        canvas = document.getElementById('image_ass_canvas')
		        }
		        return canvas
	        },
	        resetSize (set, width, height) {
		        let imgScale = {}
		        let w = 0, h = 0;
		        if (width < set && height < set) {
			        imgScale = {
				        height,
				        width
			        }
		        }else {
			        if (width >= height) {
				        w = set;
				        h = Math.ceil(set * height / width)
				        console.log(w, h)
			        } else {
				        h = set
				        w = Math.ceil(set * width / height)
				        console.log(w, h)
			        }
			        imgScale = {
				        height: h,
				        width: w
			        }
		        }
		        return imgScale
	        },
        }
	}
</script>

<style scoped>

</style>