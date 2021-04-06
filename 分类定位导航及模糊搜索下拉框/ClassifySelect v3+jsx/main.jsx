import { defineComponent, toRef, computed } from 'vue'
import { classNames } from '@/utils'

export default defineComponent({
  inheritAttrs: false,
  emits: [
    'toggle',
    'clear',
  ],
  props: {
    visible: Boolean,
    placeholder: String,
    curData: Object,
    modelValue: [String, Number],
    list: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, { attrs, slots, emit }) {
    const placeholder = toRef(props, 'placeholder')
    const modelValue = toRef(props, 'modelValue')
    const list = toRef(props, 'list')
    const visible = toRef(props, 'visible')
    const curData = toRef(props, 'curData')

    const toggle = () => emit('toggle')
    const clear = () => emit('clear')

    return {
      placeholder,
      modelValue,
      list,
      visible,
      curData,
      toggle,
      clear
    }
  },
  render() {
    const inputClassName = classNames(['classify-input', this.visible && 'input-focus'])
    const icon = this.modelValue && <i className='el-icon-circle-close' onClick={this.clear}></i>

    return (
      <>
        <input type='text'
          class={inputClassName}
          readOnly
          value={this.curData && this.curData.label}
          placeholder={this.placeholder}
          onClick={this.toggle} />
        <div className='icon-warp'>
          {icon}
          <i className='el-icon-arrow-down'></i>
        </div>
      </>
    )
  }
})
