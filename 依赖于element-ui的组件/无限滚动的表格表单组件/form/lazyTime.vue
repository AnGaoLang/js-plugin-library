<template>
  <lazy-wrap :label="rowData[head.props]" :disabled="disabled">
    <el-time-select class="lazy-bottom"
      style="width: 120px;"
      :disabled="disabled"
      v-model="rowData[head.props]"
      :picker-options="{
        start: '00:00',
        step: '01:00',
        end: '23:00'
      }"
      placeholder="选择时间">
    </el-time-select>
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
}
</script>

<style lang="scss" scoped>
.lazy-bottom {
  width: 100%;
  height: 100%;
}
</style>