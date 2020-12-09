<template>
  <div>
    <basic-filter
      v-if="filterList.length !== 0" 
      ref="basicfilter"
      :filterList="filterList"
      :labelList="labelList"
      @search="searchFilter"
      @labelSelect="changeLabel"
      @reset="reset">
    </basic-filter>
    <div class="user-table">
      <basic-table :tableData="tableData"
        :tableHead="tableHead"
        :pagination="pagination"
        :currentChange="currentChange"
        :sizeChange="sizeChange"
        :isExpand="isExpand">
        <template v-slot:expand="slotProp">
          <slot name="clumnExpand" :expandSlot="slotProp.expandProps"></slot>
        </template>
        <template v-slot:add>
          <basic-button v-if="pageObj.isAdd" type="primary"
            size="small"
            @click="add">{{pageObj.isAddText}}</basic-button>
        </template>
        <template slot-scope="scope">
          <span v-for="item in outButton(scope.operate.row)" :key="item.emitName">
            <basic-button v-if="item.text == '启用'" 
              size="mini" 
              class="btn-drowDown" 
              :type="scope.operate.row.status == 1 ? 'danger' : 'primary'"
              @click="toggleStatus(scope.operate.$index, scope.operate.row)">
              {{scope.operate.row.status == 1 ? "禁用" : "启用"}}
            </basic-button>
            <basic-button v-else-if="item.text == '删除'" size="mini" type="danger" class="btn-drowDown" @click="del(scope.operate.$index, scope.operate.row)">删除</basic-button>
            <basic-button v-else size="mini" type="primary"
              @click="operateBtn(scope.operate.row, item)">{{item.text}}</basic-button>
          </span>
          <el-dropdown v-if="moreButton(scope.operate.row)[0]" class="btn-drowDown" >
            <basic-button size="mini" type="simple">更多<i class="el-icon-arrow-down el-icon--right" /></basic-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="item in moreOtherButton(scope.operate.row)" 
                :key="item.emitName"
                @click.native="operateBtn(scope.operate.row, item)">{{item.text}}</el-dropdown-item>
              <el-dropdown-item v-if="ableBtn.length !== 0" @click.native="toggleStatus(scope.operate.$index, scope.operate.row)">
                {{scope.operate.row.status == 1 ? "禁用" : "启用"}}
              </el-dropdown-item>
              <el-dropdown-item v-if="deleBtn.length !== 0" @click.native="del(scope.operate.$index, scope.operate.row)">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </basic-table>
    </div>
  </div>
</template>

<script>
import BasicFilter from 'components/Basic/BasicFilter';
import BasicTable from 'components/Basic/BasicTable';

export default {
  name: 'TablePage',
  data() {
    return {
      filters: this.$root.$options.filters,
      pagination: {
        pageSize: 10,
        pageNum: 1,
        total: 0,
      },
      tableData: [],
    }
  },
  props: {
    // 页面的文本及是否用新增按钮
    pageObj: {
      type: Object,
      default() {
        return {}
        // isAdd: true, // 是否有新增按钮
        // isAddText: '新增仓库', // 新增按钮的文本
        // statusAble: true, // 接口的status是否为英文而不是数字
        // statusTitle: ['', '启用客户', '禁用客户'], // 状态切换的提示文本
        // statusText: ['',
        // '客户被启用后，可以被正常引用。',
        // '客户被禁用后，不能被引用。'],
        // delTetx: '客户', // 删除的提示文本
        // delProps: 'customerName',
      }
    },
    // 筛选输入框
    filterList: {
      type: Array,
      default() {
        return []
      }
    },
    // 标签列表
    labelList: {
      type: Array,
      default() {
        return []
      }
    },
    // 表头
    tableHead: {
      type: Array,
      default: () => []
    },
    isExpand: {
      type: Boolean,
      default: false
    },
    // 获取table数据的分页函数
    getPage: {
      type: Function || null
    },
    // 启用禁用
    ableRow: {
      type: Function || null
    },
    // 删除
    delRow: {
      type: Function || null
    },
    // 显示哪些操作按钮
    buttonGroup: {
      type: Object,
      default() {
        return {
          /**
           * 联动的情况
           * 默认的启用禁用按钮将无法使用，
           * 需要自定义事件，向上传递
           */
          // isRelate: true,
          // buttonObj: {
          //   out(row) {
          //     if (row.approve == '已驳回') {
          //       return [{
          //         text: '重新提交',
          //         emitName: 'submitAgain',
          //       }]
          //     } else {
          //       return [{
          //         text: '查看详情',
          //         emitName: 'goDetail',
          //       }]
          //     };
          //   },
          //   more(row) {
          //     if (row.approve == '审批中' ||  row.execution == '已作废') {
          //       return [];
          //     };
          //     let array = [{
          //       text: '查看饲喂标准',
          //       emitName: 'goFeedStandard',
          //     },
          //     {
          //       text: '查看免疫标准',
          //       emitName: 'goImmuStandard',
          //     },
          //     {
          //       text: '查看养殖标准',
          //       emitName: 'goBreedStandard',
          //     }];
          //     if (row.approve == '已驳回') {
          //       array.unshift({
          //         text: '查看详情',
          //         emitName: 'goDetail',
          //       });
          //       return array
          //     };
          //     if (row.execution == ' 审批通过' && row.execution == '待执行') {
          //       array.unshift({
          //         text: '作废单据',
          //         emitName: 'invalid',
          //       });
          //       return array
          //     };
          //     if (row.execution == ' 审批通过' && row.execution == '已执行') {
          //       return array
          //     };
          //     return [];
          //   },
          /**
           * 未联动情况
           */
          // out: [{
          //   text: '编辑',
          //   emitName: 'edit',
          // }],
          // more: [
          //   {
          //     text: '查看详情',
          //     emitName: 'goDetail',
          //   },
          //   {
          //     text: '启用',
          //   },
          //   {
          //     text: '删除',
          //   }
          // ]
        }
      }
    },
    // 分页查询以filter形式传递
    filter: {
      type: Boolean,
      default: false,
    }
  },
  components: {
    BasicFilter,
    BasicTable,
  },
  computed: {
    outButton() {
      return (row) => {
        let isRelate = this.buttonGroup.isRelate;
        if (isRelate) {
          let buttonObj = this.buttonGroup.buttonObj;
          return buttonObj.out(row);
        } else {
          return this.buttonGroup.out ? this.buttonGroup.out : [];
        }
      }
    },
    moreButton() {
      return (row) => {
        let isRelate = this.buttonGroup.isRelate;
        if (isRelate) {
          let buttonObj = this.buttonGroup.buttonObj;
          return buttonObj.more(row);
        } else {
          return this.buttonGroup.more ? this.buttonGroup.more : [];
        }
      };
    },
    moreOtherButton() {
      return (row) => {
        return this.moreButton(row).filter(item => item.text !== '启用' && item.text !== '删除')
      }
    },
    ableBtn() {
      if (this.buttonGroup.isRelate) return [];
      if (this.buttonGroup.more) {
        return this.buttonGroup.more.filter(item => item.text === '启用')
      } else {
        return []
      }
    },
    deleBtn() {
      if (this.buttonGroup.isRelate) return [];
      if (this.buttonGroup.more) {
        return this.buttonGroup.more.filter(item => item.text === '删除')
      } else {
        return []
      }
    }
  },
  created() {
    this.getTableData();
  },
  methods: {
    // getAllLabels() {
    //   materialByType(9).then(res => {
    //     res.forEach(item => item.selected = false)
    //     res.unshift({
    //       id: '',
    //       name: '全部',
    //       selected: true,
    //     })
    //     this.labelList = res;
    //   });
    // },
    getTableData(filters, clearFilters) {
      if (filters && (filters instanceof Array) && this.filterList.length !== 0) {
        let filter = [];
        filters.forEach((item, index) => {
          let key = Object.keys(item)[0];
          key = key.split(',');
          key.forEach((keyItem, keyIndex) => {
            // 值为数组时
            if (item[key] instanceof Array) {
              let data = item[key][keyIndex];
              this.pagination[keyItem] = data ? data : '';
            } else {
              this.pagination[keyItem] = item[key];
            };
          });
          if (this.filter && item[key]) {
            let operator = this.filterList.find(item => item.key == key).operator;
            filter.push(`${key} ${operator} "${item[key]}"`);
          }
        })
        if (this.filter) {
          this.pagination.filter = filter.join(' and ');
        };
      };
      if (clearFilters) {
        this.$refs.basicfilter.reset();
        this.reset();
      };
      if (!this.getPage) return;
      this.getPage(this.pagination).then(res => {
        this.tableData = res.data ? res.data : [];
        this.pagination.total = res.total;
      })
    },
    searchFilter(result) {
      this.pagination.pageNum = 1;
      this.getTableData(result);
    },
    reset() {
      let array = ['pageSize', 'pageNum', 'total'];
      let pageKeys = Object.keys(this.pagination);
      pageKeys.forEach(item => {
        if (array.indexOf(item) == -1) {
          this.pagination[item] = '';
        };
      });
    },
    changeLabel(item) {
      this.pagination.tags = item.id;
      this.getTableData()
    },
    pageChange(curIndex, size, isclear) {
      curIndex && (this.pagination.pageNum = curIndex);
      size && (this.pagination.pageSize = size);
      this.getTableData(false, isclear);
    },
    currentChange(curIndex) {
      this.pageChange(curIndex);
    },
    sizeChange(size) {
      this.pageChange(false, size);
    },
    add() {
      this.$emit('add');
    },
    operateBtn(row, item) {
      console.log(item.emitName)
      this.$emit(item.emitName, row);
    },
    toggleStatus(index, row) {
      let status = row.status == 1 ? 2 : 1;
      let stasuStr = ['', 'enable', 'disable'];
      let type = ['', 'info', 'warn'];
      let typeString = this.pageObj.statusTitle;
      let text = this.pageObj.statusText;
      this.$Confirm({
        type: type[status],
        title: typeString[status],
        text: text[status],
        confirmCall: () => {
          if (!this.ableRow) return;
          this.ableRow(row.id, this.pageObj.statusAble ? stasuStr[status] : status ).then(res => {
            row.status = status;
          })
        }
      })
    },
    del(index, row) {
      this.$Confirm({
        type: 'warn',
        title: `删除${this.pageObj.delText}`,
        text: `确定删除“${row[this.pageObj.delProps]}”${this.pageObj.delText}`,
        confirmCall: () => {
          if (!this.delRow) return;
          this.delRow(row.id).then(res => {
            this.$successMsg('删除成功');
            // 2020-10-20修改：如果删除的是当前页唯一的数据且当前页不是第一页，则改变pageNum为前一页再获取数据
            if(this.tableData.length == 1 && this.pagination.pageNum !== 1) {
              const curIndex = this.pagination.pageNum - 1
              this.pageChange(curIndex)
            } else{
              this.pageChange()
            }
          })
        }
      })
    },
    reflesh() {
      this.pageChange();
    },
  }
}
</script>

<style lang="scss" scoped>
.user-table {
  margin-top: 10px;
  padding: 10px 20px 20px;
  @include boxShadow;
}
.btn-drowDown {
  margin-left: 10px;
  .el-icon-arrow-down {
    margin-right: 0;
  }
}
.search-box {
  & > p {
    font-size: 18px;
  }
  & > .search-input {
    display: flex;
    div {
      max-width: 300px;
    }
    .search-btn {
      margin-left: 30px;
    }
  }
  .search-result {
    margin: 0 10px 10px 0;
    padding: 10px;
    border: 1px solid #dcdfe6;
    border-radius: 5px;
    cursor: pointer;
    &.selected {
      border-color: $primary;
      background: $primarySel;
    }
  }
  .search-pagination {
    margin-top: 10px;
    text-align: right;
  }
}
.existRole {
  display: flex;
  margin: 0;
  padding: 10px;
  & > li {
    position: relative;
    margin: 0 10px 10px 0;
    padding: 15px 35px 30px 10px;
    border: 1px solid #dcdfe6;
    border-radius: 3px;
    cursor: pointer;
    &.selected {
      border-color: $danger;
      background: $dangerSel;
    }
  }
  .del {
    position: absolute;
    right: 5px;
    bottom: 5px;
    font-size: 12px;
    border: 3px;
  }
}
.common-tips {
  font-size: 18px;
  padding-left: 20px;
  color: #9a9a9a;
}
</style>