import { defineComponent, ref, toRef, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import Main from './main.jsx'
import Search from './search.jsx'
import FilterHead from './filterHead.jsx'
import Options from './options.jsx'
import { classNames } from '@/utils'
import './index.scss'

const filterType = (list) => {
  const temp = []
  list.forEach(item => {
    const isExist = temp.find(tempItem => tempItem.source == item.source)
    if (!isExist) {
      temp.push(item)
    }
  })
  return temp
}

export default defineComponent({
  inheritAttrs: false,
  emits: [
    'click',
    'update:modelValue'
  ],
  props: {
    className: String,
    placeholder: {
      type: String,
      default: '请选择',
    },
    modelValue: [String, Number],
    list: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, { attrs, slots, emit }) {
    const visible = ref(false)
    const list = ref([])
    const curValue = ref(props.modelValue)
    const curData = computed(() => {
      let filter = null
      if (list.value) {
        filter = list.value.filter(item => item.value == curValue.value)
      }
      return filter && filter.length ? filter[0] : null
    })
    let optionRef
    const getOptionRef = (el) => { optionRef = el }

    const searchStr = ref('')
    const cacheList = ref([])
    const headList = ref([])
    const selType = ref('')
    const resetType = () => {
      curValue.value ? (
        selType.value = curData.value.source
      ) : (
        selType.value = headList.value && headList.value[0] && headList.value[0].source
      )
    }
    watch(() => props.list, (newVal) => {
      list.value = newVal
      cacheList.value = JSON.parse(JSON.stringify(newVal))
      headList.value = filterType(newVal)
      resetType()
    }, {
      immediate: true
    })

    const search = (list, str, type) => {
      const options = JSON.parse(JSON.stringify(list))
      const result = []
      const temp = type ? options.filter(item => item.source == type) : options
      if (!str) return temp
      temp.forEach(item => {
        if (item.label.indexOf(str) > -1) {
          result.push(item)
        }
      })
      return result
    }
    const clickHead = (source) => {
      if (selType.value == source) return
      optionRef.setScrollTop()
      selType.value = source
      cacheList.value = search(list.value, searchStr.value, selType.value)
    }
    watch(searchStr, (newVal, oldVal) => {
      if (newVal != oldVal) {
        cacheList.value = search(list.value, newVal, selType.value)
      }
    })
    
    const reset = () => {
      visible.value = false
      resetType()
      searchStr.value = ''
      cacheList.value = search(list.value, searchStr.value, selType.value)
    }
    onMounted(() => {
      document.body.addEventListener('click', reset)
    })
    onBeforeUnmount(() => {
      document.body.removeEventListener('click', reset)
    })

    return {
      visible,
      list,
      curValue,
      curData,
      cacheList,
      searchStr,
      headList,
      selType,
      getOptionRef,
      resetType,
      search,
      clickHead,
      reset
    }
  },
  render() {
    const classifyWrap = classNames(['_classify-wrap', this.className])
    const classifyOptions = classNames(['classify-options', this.visible ? 'show' : 'hide'])
    const click = e => {
      e.stopPropagation()
      this.$emit('click')
    }
    const toggle = () => {
      this.visible = !this.visible
      if (!this.visible) {
        this.reset()
      }
    }
    const clear = () => {
      this.curValue = ''
      this.reset()
    }
    const selectOption = (val) => {
      this.curValue = val
      this.$emit('update:modelValue', val, this.curData)
      this.reset()
    }
    
    return (
      <div className={classifyWrap} onClick={click}>
        <Main visible={this.visible}
          placeholder={this.placeholder} 
          list={this.list} 
          modelValue={this.curValue}
          curData={this.curData}
          onToggle={toggle} 
          onClear={clear} />
        <div className={classifyOptions}>
          <Search v-model={this.searchStr} />
          <FilterHead headList={this.headList}
            modelValue={this.selType}
            onClickHead={this.clickHead}
          />
          <Options ref={this.getOptionRef}
            visible={this.visible}
            list={this.cacheList}
            modelValue={this.curValue}
            onUpdate:modelValue={selectOption}
          />
        </div>
      </div>
    )
  },
})
