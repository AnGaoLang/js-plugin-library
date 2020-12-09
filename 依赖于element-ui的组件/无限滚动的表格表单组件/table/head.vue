<template>
  <table  class="common-table breed-table">
    <thead>
      <tr>
        <th v-for="item in tableHead"
            :key="item.label">
            <span class="td-inner-box" :style="{width: item.width}">
              <el-checkbox v-if="disabledCofig && !item.checkBoxHide" 
                v-model="item.select" 
                :title="item.label" 
                :label="item.label" 
                @change="(value) => {changeAll(value, item, tableHead)}"></el-checkbox>
              <span class="head-span" :title="item.label" v-if="!disabledCofig || item.checkBoxHide">{{item.label}}</span>
            </span>
        </th>
      </tr>
    </thead>
  </table>
</template>

<script>
export default {
  data() {
    return {}
  },
  props: {
    // 是否可以配置编辑权限
    disabledCofig: {
      type: Boolean,
      default: false,
    },
    tableHead: {
      type: Array,
      default: () => ([])
    },
    tableData: {
      type: Array,
      default: () => ([])
    }
  },
  methods: {
    // 全选关联
    changeAll(value, item, heads) {
      if (item.props == 'alterBo') {
        this.tableData.forEach(item => {
          item.alterBo = value;
        })
      } else {
        // 关联的表格项的表格头也会自动关联
        if (item.relateProps) {
          let relateHead = heads.filter(headItem => headItem.props == item.relateProps);
          relateHead && (relateHead[0].select = value);
        }
      }
    },
  }
}
</script>

<style style="scoped">

</style>