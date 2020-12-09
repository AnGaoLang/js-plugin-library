<template>
  <div class="lazy-select" @click.stop="toogle">
    <span v-if="!toggle"
      :class="['lazy-text', (!rowData[head.props]|| rowData[head.props] == 0 || disabled) && 'disabled-text']">
      <span :title="rowData[head.props]" >
        {{
          (rowData[head.props] || rowData[head.props] === 0) ? 
            rowData[head.props]: 
            (disabled ? '禁用' : '请点击并输入')
        }}
        {{rowData[head.tipsProps]}}
      </span>
      <i class="el-icon-edit"></i>
    </span>
    <span v-if="toggle">
      <el-popover v-if="head.inputType != 'number'"
        :disabled="disabled"
        placement="top" 
        trigger="click" 
        width="500">
        <el-input ref="textarea" 
          type="textarea"
          style="width: 100%;"
          maxLength="400" 
          v-model="rowData[head.props]"
          :disabled="disabled"
          :autosize="{ minRows: 5 }"
          placeholder="请输入"
          @blur="blurToggle" />
          <span slot="reference" ref="input" class="text-hide" @click.stop>
            <span class="text-hide" :title="rowData[head.props]">
              {{rowData[head.props] || '请点击并输入'}}
            </span>
          </span>
      </el-popover>
      <span v-else>
        <el-input ref="input" 
          class="el-input"
          maxLength="500"
          type="number"
          :disabled="disabled"
          :title="rowData[head.props]"
          v-model="rowData[head.props]" 
          placeholder="请输入"
          @blur="blurToggle"
          @input="validate"
          @change="inputFun"
          @mousewheel.native.prevent />
      </span>
    </span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      toggle: false,
    }
  },
  props: {
    rowData: {
      type: Object
    },
    head: {
      type: Object
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    toogle() {
      if (this.disabled) return;
      this.toggle = true;
      this.$nextTick(() => {
        if (this.head.inputType == 'number') {
          this.$refs.input.focus();
        } else {
          this.$refs.input.click();
          setTimeout(() => {
            this.$refs.textarea.focus();
          });
        }
      })
    },
    blurToggle() {
      this.toggle && (this.toggle = false);
    },
    inputFun() {
      this.head.inputFun && this.head.inputFun(this.rowData);
    },
    validate(value) {
      if (this.head.noZero && value == 0) {
        this.rowData[this.head.props] = '';
      };
      if (value > 99999999) {
        this.rowData[this.head.props] = 99999999;
      };
      if (value < 0) {
        this.$errorMsg('请输入正数');
        this.rowData[this.head.props] = this.rowData[this.head.props].replace('-', '');
      };
      if (this.head.noFloat && value.indexOf(".") > -1) {
        this.$errorMsg('请输入整数数');
        this.rowData[this.head.props] = this.rowData[this.head.props].replace('.', '');
      };
    }
  },
}
</script>

<style lang="scss" scoped>
.lazy-select {
  width: 100%;
  height: 100%;
}
.text-hide {
  display: inline-block;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis; 
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