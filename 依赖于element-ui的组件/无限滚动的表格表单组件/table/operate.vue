<template>
  <table class="common-table breed-table">
    <tbody>
      <tr v-for="trs in curTableData"
          :key="`item${trs.indexId}`"
          :data-index="trs.indexId">
        <td v-for="item in operateHead"
            :key="`tr${item.label}`">
          <span class="td-inner-box td-operate-box" :style="{width: item.width}">
            <span class="table-operate" 
              v-if="(item.type == 'operate' && !item.onlyLastAdd) || 
                    (item.type == 'operate' && item.onlyLastAdd && trs.indexId == main.length - 1)">
              <span class="danger" 
                v-if="main.length > minRowNum 
                && item.isDel 
                && !trs[configHead.props]
                && (!trs.alterBo || disabledCofig)"
                @click="del(trs.indexId)">删除</span>
              <span class="primary" v-if="item.isAdd" @click="add(trs.indexId)">增加</span>
              <span class="info" v-if="item.isCopy" @click="copy(item, trs, trs.indexId)">复制</span>
            </span>
          </span>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  data() {
    return {
      main: this.tableData
    }
  },
  props: {
    tableHead: {
      type: Array,
      default: () => []
    },
    tableData: {
      type: Array,
      default: () => []
    },
    curTableData: {
      type: Array,
      default: () => []
    },
    minRowNum: {
      type: Number,
      default: 1
    },
    disabledCofig: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    configHead() {
      let array = this.tableHead.filter(item => item.editConfig);
      return array[0] ? array[0] : {};
    },
    operateHead() {
      let operateArray = this.tableHead.filter(item => item.type == 'operate');
      return operateArray[0] ? operateArray : [];
    },
  },
  created() {
    if (this.main.length == 0) {
      this.add();
    }
  },
  methods: {
    generateMain() {
      let obj = {};
      this.tableHead.forEach(item => {
        if (item.type && item.type.indexOf('double') > -1 ) {
          item.props.forEach(propsItem => {
            obj[propsItem] = ''
          })
        } else {
          if (item.props) {
            if (item.type == 'checkbox') {
              obj[item.props] = false
            } else {
              !!item.multiple ? (obj[item.props] = []) : (obj[item.props] = '');
            }
          };
          if (item.defaultValue || typeof item.defaultValue == 'boolean') {
            obj[item.props] = item.defaultValue
          };
        }
      });
      return obj;
    },
    refleshMainId() {
      this.main.forEach((item, index) => {
        item.indexId = index;
      })
    },
    del(index) {
      let delItem = this.main.splice(index, 1);
      this.$emit('delete', delItem);
      this.refleshMainId();
    },
    add(index = 0) {
      // 是否在最后一行新增行,或在当前行之后新增行
      if (this.operateHead.onlyLastAdd) {
        this.main.push(this.generateMain());
      } else {
        this.main.splice(index + 1, 0 , this.generateMain());
      };
      this.refleshMainId();
    },
    copy(item, trs, index) {
      let obj = this.generateMain();
      item.copyKeys.forEach(item => {
        obj[item] = trs[item];
      });
      if(this.main[index].unique) {
        obj.unique = this.main[index].unique
      }
      if (this.operateHead.onlyLastAdd) {
        this.main.push(obj);
      } else {
        this.main.splice(index + 1, 0 , obj);
      };
      this.refleshMainId();
    },
  },
  watch: {
    tableData(value) {
      this.main = value;
      if (this.main.length == 0) {
        this.add();
      }
    }
  }
}
</script>

<style>

</style>