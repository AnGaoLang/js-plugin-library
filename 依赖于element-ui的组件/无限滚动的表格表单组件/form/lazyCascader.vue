<template>
  <lazy-wrap :label="getSelectItem()" 
    :disabled="disabled"
    triggle="visible-change"
    type="cascader">
    <el-cascader class="lazy-bottom"
      ref="elCascader"
      size="small"
      placeholder="请选择"
      :disabled="disabled"
      v-model="rowData[head.props]"
      :options="head.list"
      :props="head.listKey"
      :show-all-levels="!head.onlySelectLast"
      @change="change" />
  </lazy-wrap>
</template>

<script>
import LazyWrap from './lazyWrap';

export default {
  data() {
    return {
      toggle: false,
      label: '',
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
  components: {
    LazyWrap
  },
  methods: {
    getSelectItem() {
      let curSelectId = this.rowData[this.head.props];
      if (curSelectId[0]) {
        let list = this.head.list;
        let listKey = this.head.listKey || { label: 'label', value: 'value', children: 'children'};
        let listLabel = listKey.label;
        let listValue = listKey.value;
        let listChild = listKey.children;
        let parent = this.head.list.filter(item => {
          return item[listValue] == curSelectId[0]
        });
        if (parent && parent[0]) {
          parent = parent[0];
          let child = parent[listChild].filter(item => {
            return item[listValue] == curSelectId[1]
          });
          (child && child[0]) && (child = child[0]);
          return `${parent[listLabel]}/${child[listLabel]}`
        }
      }
    },
    change(value) {
      this.$emit('change', {value})
    }
  },
}
</script>

<style lang="scss" scoped>
.lazy-bottom {
  width: 100%;
  height: 100%;
}
</style>