import { defineComponent, toRef } from 'vue'

export default defineComponent({
  inheritAttrs: false,
  emits: [
    'clear',
    'update:modelValue'
  ],  
  props: {
    modelValue: String
  },
  setup(props) {
    const value = toRef(props, 'modelValue')

    return {
      value
    }
  },
  render() {
    const clear = (e) => {
      e.stopPropagation()
      this.$emit('clear')
      this.$emit('update:modelValue', '')
    }
    const search = (e) => {
      this.$emit('update:modelValue', e.target.value)
    }

    return (
      <div className='search-input'>
        <input type='text' value={this.value} placeholder='输入并搜索' onInput={search} />
        <div className='icon-warp'>
          {!!this.value ? (
            <i key='close' className='el-icon-circle-close' onClick={clear}></i>
          ) : (
            <i key='search' className='el-icon-search'></i>
          )}
        </div>
      </div>
    )
  } 
})
