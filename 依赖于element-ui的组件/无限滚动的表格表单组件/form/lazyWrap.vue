<template>
  <div class="lazy-select" ref="lazySelect">
    <span class="lazy-text"
      v-if="!toggle" 
      :class="(!label || disabled) && 'disabled-text'"
      @click="toogle">
      <span :title="label">
        {{label || (disabled ? '禁用' : '请点击并选择')}}
      </span>
      <i class="el-icon-caret-bottom"></i>
    </span>
    <slot v-if="toggle"></slot>
  </div>
</template>

<script>
export default {
  data() {
    return {
      toggle: false,
      slotInstance: null,
    }
  },
  props: {
    label: {
      type: String,
      default: ''
    },
    triggle: {
      type: String,
      default: 'blur'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
    }
  },
  methods: {
    toogle() {
      if (this.disabled) return;
      this.toggle = true;
      this.$nextTick(() => {
        if (this.type != 'cascader') {
          this.$slots.default[0].context.$children[0].$children[0].focus()
        } else {
          this.$slots.default[0].context.$children[0].$children[0].$el.click()
        }
      })
    },
    blurToggle(val) {
      switch(this.triggle) {
        case 'blur':
          this.toggle = false;
          break;
        case 'visible-change':
          !val && (this.toggle = false);
          break;
      }
    },
  },
  watch: {
    toggle(val) {
      if (val) {
        this.$nextTick(() => {
          this.$slots.default[0].context.$children[0].$children[0].$on(this.triggle, this.blurToggle);
        })
      }
    }
  }
}
</script>

<style>
.el-cascader--small {
  line-height: 31px;
}
</style>
<style lang="scss" scoped>
.lazy-select {
  width: 100%;
  height: 100%;
}
.lazy-text {
  display: inline-block;
  width: 100%;
  height: 100%;
  span {
    display: inline-block;
    max-width: calc(100% - 16px - 5px);
    overflow: hidden;
    vertical-align: middle;
  }
  i {
    margin-left: 5px;
    display: inline-block;
    width: 16px;
    vertical-align: middle;
  }
}
.disabled-text {
  color: #9a9a9a;
}
</style>