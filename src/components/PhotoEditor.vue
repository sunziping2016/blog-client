<template>
  <md-dialog ref="dialog" :md-fullscreen="true" @close="on_close">
    <md-dialog-title>图片编辑</md-dialog-title>
    <md-dialog-content class="editor-dialog-content">
      <div class="editor">
        <div class="canvas" ref="canvas" :style="size">
        </div>
        <div class="toolbar" v-if="cropper" @click="click">
          <button class="toolbar__button" data-action="move" title="Move (M)"><span class="fa fa-arrows"></span></button>
          <button class="toolbar__button" data-action="crop" title="Crop (C)"><span class="fa fa-crop"></span></button>
          <button class="toolbar__button" data-action="zoom-in" title="Zoom In (I)"><span class="fa fa-search-plus"></span></button>
          <button class="toolbar__button" data-action="zoom-out" title="Zoom Out (O)"><span class="fa fa-search-minus"></span></button>
          <button class="toolbar__button" data-action="rotate-left" title="Rotate Left (L)"><span class="fa fa-rotate-left"></span></button>
          <button class="toolbar__button" data-action="rotate-right" title="Rotate Right (R)"><span class="fa fa-rotate-right"></span></button>
          <button class="toolbar__button" data-action="flip-horizontal" title="Flip Horizontal (H)"><span class="fa fa-arrows-h"></span></button>
          <button class="toolbar__button" data-action="flip-vertical" title="Flip Vertical (V)"><span class="fa fa-arrows-v"></span></button>
        </div>
      </div>
    </md-dialog-content>
    <md-dialog-actions>
      <md-button class="md-primary" @click="close(false)">取消</md-button>
      <md-button class="md-primary" @click="close(true)">保存</md-button>
    </md-dialog-actions>
  </md-dialog>
</template>

<script lang="ts">
  import Cropper from 'cropperjs';

  export default {
    data: function () {
      return {
        aspectRatio: NaN,
        cropper: null,
        canvasData: null,
        cropBoxData: null,
        data: null,
        cropped: false,
        cropping: false,
        size: {},
        status: false
      };
    },
    mounted() {
      window.addEventListener('keydown', (this.onKeydown = this.keydown.bind(this)));
    },
    beforeDestroy() {
      window.removeEventListener('keydown', this.onKeydown);
      this.stop();
    },
    methods: {
      open(url, options) {
        if (options === undefined)
          options = {};
        while(this.$refs.canvas.hasChildNodes())
          this.$refs.canvas.removeChild(this.$refs.canvas.lastChild);
        this.size = {};
        let image = new Image();
        image.src = url;
        image.style.visibility = 'hidden';
        image.onload = () => {
          this.$refs.dialog.open();
          if (image.width < 320) {
            image.style.width = `320px`;
            this.size = {'max-width': `320px`};
          } else
            this.size = {'max-width': `${image.width}px`};
          this.$refs.canvas.appendChild(image);
          this.start(image, options);
        };
      },
      close(status) {
        this.status = status;
        this.$refs.dialog.close();
      },
      on_close() {
        this.$emit('close', !!this.status && this.cropper.getCroppedCanvas({fillColor: '#fff'}));
        this.stop();
      },
      click({ target }) {
        const cropper = this.cropper;
        const action = target.dataset.action || target.parentNode.dataset.action;
        switch (action) {
          case 'move':
          case 'crop':
            cropper.setDragMode(action);
            break;
          case 'zoom-in':
            cropper.zoom(0.1);
            break;
          case 'zoom-out':
            cropper.zoom(-0.1);
            break;
          case 'rotate-left':
            cropper.rotate(-90);
            break;
          case 'rotate-right':
            cropper.rotate(90);
            break;
          case 'flip-horizontal':
            cropper.scaleX(-cropper.getData().scaleX || -1);
            break;
          case 'flip-vertical':
            cropper.scaleY(-cropper.getData().scaleY || -1);
            break;
          default:
        }
      },
      keydown(e) {
        switch (e.key) {
          // Undo crop
          case 'z':
            if (e.ctrlKey) {
              e.preventDefault();
              this.restore();
            }
            break;
          // Delete the image
          case 'Delete':
            this.reset();
            break;
          default:
        }
        const cropper = this.cropper;
        if (!cropper) {
          return;
        }
        switch (e.key) {
          // Crop the image
          case 'Enter':
            this.crop();
            break;
          // Clear crop area
          case 'Escape':
            this.clear();
            break;
          // Move to the left
          case 'ArrowLeft':
            e.preventDefault();
            cropper.move(-1, 0);
            break;
          // Move to the top
          case 'ArrowUp':
            e.preventDefault();
            cropper.move(0, -1);
            break;
          // Move to the right
          case 'ArrowRight':
            e.preventDefault();
            cropper.move(1, 0);
            break;
          // Move to the bottom
          case 'ArrowDown':
            e.preventDefault();
            cropper.move(0, 1);
            break;
          // Enter crop mode
          case 'c':
            cropper.setDragMode('crop');
            break;
          // Enter move mode
          case 'm':
            cropper.setDragMode('move');
            break;
          // Zoom in
          case 'i':
            cropper.zoom(0.1);
            break;
          // Zoom out
          case 'o':
            cropper.zoom(-0.1);
            break;
          // Rotate left
          case 'l':
            cropper.rotate(-90);
            break;
          // Rotate right
          case 'r':
            cropper.rotate(90);
            break;
          // Flip horizontal
          case 'h':
            cropper.scaleX(-cropper.getData().scaleX || -1);
            break;
          // Flip vertical
          case 'v':
            cropper.scaleY(-cropper.getData().scaleY || -1);
            break;
          default:
        }
      },
      start(image, options) {
        if (this.cropped) {
          return;
        }
        this.cropper = new Cropper(image, {
          dragMode: 'move',
          background: false,
          ready: () => {
            if (this.data) {
              this.cropper
                .crop()
                .setData(this.data)
                .setCanvasData(this.canvasData)
                .setCropBoxData(this.cropBoxData);
              this.data = null;
              this.canvasData = null;
              this.cropBoxData = null;
            }
          },
          crop: ({ detail }) => {
            if (detail.width > 0 && detail.height > 0 && !this.cropping)
                this.cropping = true;
          },
          ...options
        });
      },
      stop() {
        if (this.cropper) {
          this.cropper.destroy();
          this.cropper = null;
          this.cropping = false;
        }
      },
      crop() {
        const cropper = this.cropper;
        if (this.cropping) {
          this.data = cropper.getData();
          this.canvasData = cropper.getCanvasData();
          this.cropBoxData = cropper.getCropBoxData();
          this.data = cropper.getData();
          this.cropped = true;
          this.cropping = false;
          this.stop();
        }
      },
      clear() {
        if (this.cropping) {
          this.cropper.clear();
          this.cropping = false;
        }
      },
      restore() {
        if (this.cropped)
          this.cropped = false;
      },
      reset() {
        this.stop();
        this.cropped = false;
        this.cropping = false;
      },
    }
  }
</script>

<style lang="scss">
  .md-fullscreen {

  }
  .cropper-container {
    margin-left: -100%;
  }
  .editor-dialog-content {
    overflow: hidden;
  }
  .editor {
    overflow: hidden;
    max-height: 100%;
    max-width: 100%;
  }
  .canvas {
    align-items: center;
    display: flex;
    height: 100%;
    justify-content: center;
    & > img {
      max-height: 100%;
      max-width: 100%;
      display: block!important;
      visibility: hidden;
      z-index: -1;
    }
  }
  .toolbar {
    background-color: rgba(0, 0, 0, .5);
    bottom: 16px;
    color: #fff;
    height: 32px;
    left: 50%;
    margin-left: -128px;
    position: absolute;
    width: 256px;
    z-index: 2015;
    &__button {
       background-color: transparent;
       border-width: 0;
       color: #fff;
       cursor: pointer;
       display: block;
       float: left;
       font-size: 14px;
       height: 32px;
       text-align: center;
       width: 32px;
    &:focus {
       outline: none;
     }
    &:hover {
       background-color: #0074d9;
       color: #fff;
     }
    }
  }
</style>
