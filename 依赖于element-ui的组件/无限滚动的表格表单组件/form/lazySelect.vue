<template>
  <lazy-wrap :label="getSelectItem()" 
    triggle="visible-change"
    :disabled="disabled">
    <el-select v-if="!head.unique" 
      class="lazy-bottom"
      automatic-dropdown
      collapse-tags
      :disabled="disabled"
      :multiple="head.multiple"
      :multiple-limit="head.mulLimit || 0"
      :clearable="head.clearable"
      placeholder="请选择"
      v-model="rowData[head.props]"
      @change="changeSelect">
      <el-option  v-for="listItem in head.list"
        :key="!head.listKey ? listItem.label : listItem[head.listKey.label]"
        :label="!head.listKey ? listItem.label : listItem[head.listKey.label]"
        :value="!head.listKey ? listItem.value : listItem[head.listKey.value]"
        :disabled="listItem.disabled">
      </el-option>
    </el-select>
    <el-select v-else
      placeholder="请选择"
      automatic-dropdown
      collapse-tags
      :disabled="disabled"
      v-model="rowData[head.props]"
      :key="keyValue"
      :multiple="rowData.unique ? rowData.unique.multiple : false"
      :multiple-limit="rowData.unique ? rowData.unique.multipleLimit : 0">
      <el-option v-for="listItem in ((rowData.unique && rowData.unique.list) ? rowData.unique.list : [])"
        :key="!head.listKey ? listItem.label : listItem[head.listKey.label]"
        :label="!head.listKey ? listItem.label : listItem[head.listKey.label]"
        :value="!head.listKey ? listItem.value : listItem[head.listKey.value]"
        :disabled="listItem.disabled">
      </el-option>
    </el-select>
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
    },
    keyValue: {
      type: String
    }
  },
  components: {
    LazyWrap
  },
  methods: {
    getSelectItem() {
      let curSelectId = this.rowData[this.head.props];
      let unique = this.head.unique;
      let list = [];
      if (!this.head.unique) {
        list = this.head.list;
      } else {
        if (this.rowData.unique && this.rowData.unique.list) {
          list = this.rowData.unique.list;
        }
      };
      let listKey = this.head.listKey || { label: 'label', value: 'value'};
      let listLabel = listKey.label;
      let listValue = listKey.value;
      let filterList = list.filter(item => {
        return item[listValue] == curSelectId 
          || (Array.isArray(curSelectId) && curSelectId.includes(item[listValue]))
      });
      let filterBool = filterList && filterList[0];
      let labels = this.label = filterList.map(item => item[listLabel]).join('，');
      return filterList ?  labels : '';
    },
    changeSelect(value) {
      let curSel = {};
      if (value) {
        curSel = this.head.list.filter(item => {
          let listKey = this.head.listKey || { label: 'label', value: 'value'};
          return item[listKey.value] == value
        });
        curSel = curSel[0] || {};
      };
      this.$emit('change', {value, curSel})
    }
  },
}
</script>

<style lang="scss"> 
.lazy-select {
  .el-input__inner {
    height: 31px!important;
  }
  .el-tag.el-tag--info > span {
    display: inline-block;
    max-width: 85px;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: middle;
  }
}
</style>
<style lang="scss" scoped>
.lazy-bottom {
  width: 100%;
  height: 100%;
}
</style>