import { defineComponent, toRef, watch } from 'vue'
import { classNames } from '@/utils'

export default defineComponent({
  inheritAttrs: false,
  emits: [
    'update:modelValue'
  ],
  props: {
    modelValue: [String, Number],
    visible: {
      type: Boolean,
      default: false
    },
    list: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, { emit }) {
    const modelValue = toRef(props, 'modelValue')
    const list = toRef(props, 'list')
    const visible = toRef(props, 'visible')
    const setScrollTop = (top = 0) => {
      const optionsWrap = document.getElementsByClassName('_classify_options_warp')
      optionsWrap && optionsWrap[0] && (optionsWrap[0].scrollTop = top)
    }

    watch(visible, (val) => {
      if (val) {
        let selOption = document.getElementsByClassName('_classify_options select')
        if (selOption && selOption[0] && selOption[0].offsetTop > 300) {
          setScrollTop(selOption[0].offsetTop - 100)
        }
      }
    })

    return {
      modelValue,
      list,
      setScrollTop
    }
  },
  render() {
    let optionsRender
    if (!this.list || this.list.length == 0) {
      optionsRender = (
        <div className="options-warp no-data">
          暂无数据...
        </div>
      )
    } else {
      optionsRender = this.list.map((item, index) => {
        return (
          <div key={`option${index}`}
            className={classNames(['_classify_options', item.value == this.modelValue && 'select'])}
            option={item.value}>
            {item.label}
          </div>
        )
      })
    }
    const clickOption = (e) => {
      const val = e.target.getAttribute('option')
      if (val || val === 0) {
        this.$emit('update:modelValue', val)
      }
    }

    return (
      <div className="_classify_options_warp" onClick={clickOption}>
        {optionsRender}
      </div>
    )
  }
})