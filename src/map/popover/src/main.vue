<template>
  <transition name="msgbox-fade">
    <div class="sf-popover" :style="computedStyle" :class="className">
      <div class="sf-popover-header clearfix">
        <span class="sf-popover-header-title">
          <span class="name">{{name}}</span>
          <span class="code">{{code}}</span>
        </span>
        <span class="sf-popover-header-tools">
          <span
            v-for="tool in tools"
            class="tool iconfont"
            @click.stop="handleToolAction(tool)"
            :class="tool.icon"
            :title="tool.name"></span>
        </span>
        <button
          type="button"
          class="sf-popover__headerbtn"
          v-if="showClose"
          @click="handleAction('close')"
          @keydown.enter="handleAction('close')">
          <i class="sf-popover__close el-icon-close"></i>
        </button>
      </div>
      <div class="sf-popover-content" v-if="content !== ''">
        <div class="sf-popover-content__body">
          <slot>
            <p v-if="!dangerouslyUseHTMLString">{{ content }}</p>
            <p v-else v-html="content"></p>
          </slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  const size = {
    medium: [270, 'auto'],
    small: [],
    mini: []
  }
  export default {
    props: {
      size: {
        type: [String, Array],
        default: 'medium' // small mini
      },
      padding: {
        type: [String, Number],
        default: '10px'
      },
      showClose: {
        type: Boolean,
        default: true
      },
      closeOnHashChange: {
        default: true
      },
      className: {
        type: String,
        default: ''
      }
    },

    data () {
      return {
        content: '',
        name: '',
        code: '',
        tools: '',
        action: '',
        callback: null,
        beforeClose: null,
        dangerouslyUseHTMLString: false
      }
    },
    computed: {
      computedStyle () {
        return {
          width: (typeof this.size === 'string')
            ? size[this.size][0] + 'px'
            : (typeof this.size[0] === 'string' ? this.size[0] : this.size[0] + 'px'),
          height: (typeof this.size === 'string')
            ? size[this.size][1] + 'px'
            : (typeof this.size[1] === 'string' ? this.size[1] : this.size[1] + 'px'),
          padding: typeof this.padding === 'string' ? this.padding : this.padding + 'px'
        }
      }
    },
    watch: {
      content (v, ov) {
        this.content = this.content.replace(/null/g, '')
        this.content = this.content.replace(/undefined/g, '')
      }
    },
    mounted () {
      if (this.closeOnHashChange) {
        window.addEventListener('hashchange', this.close)
      }
      this.content = this.content.replace(/null/g, '')
      this.content = this.content.replace(/undefined/g, '')
    },
    methods: {
      getSafeClose () {
        return () => {
          this.$nextTick(() => {
            this.doClose()
          })
        }
      },
      doClose () {
        setTimeout(() => {
          if (this.action) this.callback(this.action, this)
        })
      },

      handleAction (action) {
        this.action = action
        if (typeof this.beforeClose === 'function') {
          this.close = this.getSafeClose()
          this.beforeClose(action, this, this.close)
        } else {
          this.doClose()
        }
      },

      handleToolAction (tool) {
      }
    },
    beforeDestroy () {
      if (this.closeOnHashChange) {
        window.removeEventListener('hashchange', this.close)
      }
    },
    components: {}
  }
</script>

<style lang="scss">
  .hmap-js-popup {
    padding: 0;
    border-radius: 3px;
    border: none;
    box-sizing: border-box;
    box-shadow: 1px 1px 4px 1px rgba(0, 0, 0, 0.15);
    pointer-events: auto;
    background: #fff;
    &:before {
      position: absolute;
      bottom: -26px;
      left: 35%;
      content: '';
      display: inline-block;
      border-left: 0px solid transparent;
      border-right: 22px solid transparent;
      border-top: 26px solid #c2c2c2;
      transform: translate(-50%, 0)
    }
    &:after {
      position: absolute;
      bottom: -25px;
      left: 35%;
      content: '';
      display: inline-block;
      border-left: 0px solid transparent;
      border-right: 22px solid transparent;
      border-top: 26px solid #ffffff;
    }
    .hmap-js-popup-content {
      min-width: 100px;
      word-wrap: break-word;
      overflow-y: auto;
      overflow-x: hidden;
      .toll-stations-popover-list {
        height: 28px;
        line-height: 28px;
      }
    }
  }
  .sf-popover {
    &-header {
      font-family: SimSun;
      font-size: 14px;
      .sf-popover__headerbtn {
        position: absolute;
        right: 15px;
        padding: 0;
        border: none;
        outline: none;
        background: transparent;
        cursor: pointer;
        i {
          color: #747474;
        }
        &:hover {
          i {
            color: #409eff;
          }
        }
      }
      &-title {
        width: calc(100% - 40px);
        color: #292929;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: block;
        float: left;
      }
      &-tools {
        position: absolute;
        right: 35px;
        padding: 0;
        border: none;
        outline: none;
        background: transparent;
        font-size: 16px;
        .tool {
          display: inline-block;
          padding: 0 5px;
          color: #747474;
          &:hover {
            cursor: pointer;
            color: #409eff;
          }
        }
      }
    }
    &-content {
      margin: 15px 10px;
      font-size: 12px;
      font-weight: normal;
      font-stretch: normal;
      li {
        font-family: SimSun;
        line-height: 20px;
      }
    }
  }
</style>
