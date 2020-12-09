<template>
   <table class="common-table breed-table">
      <tbody>
        <tr v-for="(trs, index) in main"
            :key="`item${index}`">
          <td v-for="item in tableHead"
              :key="`tr${item.label}`">
            <span :class="['td-inner-box',  item.type == 'operate' && 'td-operate-box' ]" :style="{width: item.width}">

              <span v-if="(!item.fixed || showFixed)">
                <span class="td-wrap" v-if="item.type == 'text'" v-function:[item]="trs[item.props]" :data-index="trs.indexId">
                  {{item.format ? item.format(trs[item.props]) : trs[item.props]}}
                </span>
                <el-checkbox v-if="item.type == 'checkbox'"
                  class="check-box" 
                  v-model="trs[item.props]"
                  @change="changeCur" />

                <lazy-input v-if="item.type == 'input'"
                  :disabled="isCanBeEdit(trs, item, configHead)"
                  :rowData="trs" 
                  :head="item" />

                <lazy-cascader v-if="item.type == 'cascader'" 
                  :rowData="trs" 
                  :head="item"
                  :disabled="isCanBeEdit(trs, item, configHead)" 
                  @change="(object) => {changeSelect(object, trs, item, index)}"/>

                <lazy-time v-if="item.type == 'time'" 
                  :rowData="trs" 
                  :head="item"
                  :disabled="isCanBeEdit(trs, item, configHead)" />
                
                <!-- v-relate:[item]="trs[item.props]" -->
                <span v-if="item.type == 'select'"
                  class="input-width td-wrap">
                  <lazy-select :rowData="trs"
                    :keyValue="`${item.props}-${selectChange}`"
                    :head="item"
                    :disabled=" !item.unique ?
                      isCanBeEdit(trs, item, configHead) :
                      isCanBeEdit(trs, item, configHead, true)"
                    @change="(object) => {changeSelect(object, trs, item, index)}"/>
                </span>

                <span v-if="item.type == 'cron'"
                  class="input-width td-wrap">
                  <lazy-cron :rowData="trs" 
                    :head="item"
                    :disabled="isCanBeEdit(trs, item, configHead)"/>
                </span>

                <!-- <el-popover v-if="item.type == 'cron'"
                  :disabled="isCanBeEdit(trs, item, configHead)"
                  placement="top" 
                  trigger="click"
                  width="400px"
                  height="400px">
                  <cron :key="`cron${index}`" v-model="trs[item.props]" @showResult="geCornResult($event, trs, item)"></cron>
                  <span slot="reference">
                    <span :class="['text-hide', isCanBeEdit(trs, item, configHead) && 'disabled-text']">
                      <span :title="trs[item.cronResult]">
                  {{trs[item.cronResult] || '请点击并选择'}}
                        {{trs[item.props]}}
                      </span>
                      <i class="el-icon-caret-bottom"></i>
                    </span>
                  </span>
                </el-popover> -->

                <span v-if="item.type == 'doubleinput'" class="input-width double-input">
                  <el-input type="number"
                    :disabled="isCanBeEdit(trs, item, configHead)" 
                    v-model="trs[item.props[0]]" 
                    :placeholder="item.placeholder[0]"
                    @mousewheel.native.prevent 
                    @change="(value) => {day(value, trs, item, 0)}"/>
                  -
                  <el-input type="number"
                    :disabled="isCanBeEdit(trs, item, configHead)" 
                    v-model="trs[item.props[1]]" 
                    :placeholder="item.placeholder[1]"
                    @mousewheel.native.prevent 
                    @change="(value) => {day(value, trs, item, 1)}"/>
                </span>
                
                <span class="input-width" v-if="item.type == 'doubletext'">
                  {{trs[item.props[0]]}} 至 {{trs[item.props[1]]}}
                </span>

                <span class="table-operate" 
                  v-if="(item.type == 'operate' && !item.onlyLastAdd) || 
                        (item.type == 'operate' && item.onlyLastAdd && trs.indexId == totalMain.length - 1)">
                  <span class="danger" 
                    v-if="totalMain.length > minRowNum 
                    && item.isDel 
                    && !trs[configHead.props] 
                    && (!trs.alterBo || disabledCofig)"
                    @click="del(trs.indexId)">删除</span>
                  <span class="primary" v-if="item.isAdd" @click="add(trs.indexId)">增加</span>
                  <span class="info" v-if="item.isCopy" @click="copy(item, trs, trs.indexId)">复制</span>
                </span>

              </span>
            </span>
          </td>
        </tr>
      </tbody>
    </table>
</template>

<script>
import Cron from 'components/Cron/cron';
import LazySelect from '../form/lazySelect';
import LazyTime from '../form/lazyTime';
import LazyCascader from '../form/lazyCascader';
import LazyInput from '../form/lazyInput';
import LazyCron from '../form/lazyCron';

export default {
  data() {
    return {
      main: this.tableData,
      totalMain: this.totalData,
      selectChange: 0,
    }
  },
  props: {
    disabledCofig: {
      type: Boolean,
      default: false,
    },
    tableHead: {
      type: Array,
      default: () => []
    },
    tableData: {
      type: Array,
      default: () => []
    },
    totalData: {
      type: Array,
      default: () => []
    },
    minRowNum: {
      type: Number,
      default: 1
    },
    showFixed: {
      type: Boolean,
      default: false,
    },
  },
  directives: {
    // 基于文本内容处理关联逻辑
    function: (el ,binding, vnode) => {
      let arg = binding.arg;
      let newValue = binding.value;
      let oldValue = binding.oldValue;
      if (!arg.fun  || (!arg.nocache && newValue == oldValue)) return;
      let $curVue = vnode.context;
      let index = el.getAttribute('data-index');
      if (!$curVue.totalMain[index]) return;
      // 更新当前表格项的model
      let funReturn = arg.fun($curVue.totalMain[index], newValue);
    },
    // 关联源头数据更新时，触发相应函数，重写被关联的项
    // relate: (el ,binding, vnode) => {
    //   let arg = binding.arg;
    //   let newValue = binding.value;
    //   let oldValue = binding.oldValue;
    //   if (!arg.relateProps || !arg.vRelateFun || newValue == oldValue) return;
    //   let index = el.getAttribute('data-index');
    //   let $curVue = vnode.context;
    //   arg.vRelateFun($curVue.main[index], arg);
    //   // 如何旧值为真，即不是初次加载，则置空被关联表单项当前的值，并刷新key
    //   oldValue && ($curVue.main[index][arg.relateProps] = null);
    //   $curVue.selectChange++;
    // }
  },
  computed: {
    // 动态配置当前表单是否可编辑
    isCanBeEdit() {
      return (curData, headItem, configHead, isUnique = false) => {
        // 根据当前这条数据的id是否存在
        // 判断当前这条数据是旧数据还是新增的数据,新数据则处理默认的禁用逻辑
        if (!!headItem.disabled) return true;
        if (!this.disabledCofig && curData.alterBo) return true;
        if (!curData.id) {
          if (isUnique) {
            return curData.unique ? !!curData.unique.disabled : false
          } else {
            return false
          }
        } else {
          if (isUnique) {
            return Boolean(headItem.cantEdit || curData[configHead.props]) || (curData.unique ? !!curData.unique.disabled : false)
          } else {
            return Boolean(headItem.cantEdit || curData[configHead.props])
          }
        }
      }
    },
    // 当前表格行数据是否可编辑的表头配置项
    configHead() {
      let array = this.tableHead.filter(item => item.editConfig);
      return array[0] ? array[0] : {};
    },
    operateHead() {
      let operateArray = this.tableHead.filter(item => item.type == 'operate');
      return operateArray[0] ? operateArray : [];
    },
  },
  components: {
    Cron,
    LazySelect,
    LazyTime,
    LazyCascader,
    LazyInput,
    LazyCron,
  },
  created() {
    if (this.operateHead[0] && this.totalMain.length == 0) {
      this.add();
    }
  },
  methods: {
    changeCur(value) {
      if (!this.disabledCofig) return;
      this.tableHead[0].select = this.tableData.every(item => item.alterBo);
    },
    day(value, curData, trItem, index) {
      let curProps = trItem.props[index];
      let beforeProps = trItem.props[index - 1];
      if (!!trItem.positive && (Number(curData[curProps]) < 0 || Number(curData[beforeProps]) < 0)) {
        (Number(curData[curProps]) < 0) && (curData[curProps] = '');
        (Number(curData[beforeProps]) < 0) && (curData[beforeProps] = '');
        this.$errorMsg('不能输入负数，请重新输入');
        return;
      };
      if (index == 1 && Number(curData[curProps]) < Number(curData[beforeProps])) {
        this.$errorMsg('结束日龄不能小于开始日龄，请重新输入');
        curData[curProps] = '';
        return;
      };
      let relateId = trItem.relateId;
      if (!trItem.relateId) return;
      let associated = this.tableHead.filter(item => item.relateId === 'day' && item.label !== trItem.label);
      let fun = (value) => `${parseInt(value / 7)}周${parseInt(value % 7)}日`;
      associated[0] && (curData[associated[0].props[index]] = fun(value));
    },
    changeSelect(object, curData, trItem, index) {
      let { value, curSel } = object;
      let tableData = this.totalMain;
      if (trItem.relateProps) {
        curData[trItem.relateProps] = null;
        this.selectChange++;
      }
      trItem.changeSelFun && (trItem.changeSelFun({value, curSel, curData, trItem, index, tableData}))
      if (trItem.relateId && trItem.relateId == 'cycle') {
        this.selectChange++;
        let relateId = trItem.relateId;
        let curList = trItem.list;
        let curId = curList.filter(item => item.value === value)[0].id;
        let associated = this.tableHead.filter(item => item.relateId === 'cycle' && item.unique);
        if(associated[0]) {
          // 如果为每阶段一次，被关联的字段置为' '，以跳过必填校验;
          // 否则将被关联的字段置空。
          if (curId == 0) {
            curData[associated[0].props] = ' ';
          } else {
            curData[associated[0].props] = '';
          };
          curData.unique = {}; 
          let execDate = associated[0].preList;
          let array = [
            {
              label: 'disabled',
              defaultValue: false
            },
            {
              label: 'multiple',
              defaultValue: false
            },
            {
              label: 'multipleLimit',
              defaultValue: 0
            },
            {
              label: 'list',
              defaultValue: []
            },
          ];
          array.forEach(item => {
            let label = item.label;
            let defaultValue = item.defaultValue;
            let value = execDate[curId][label];
            value ? (curData.unique[label] = value) : (curData.unique[label] = defaultValue);
          });
        };
      }
    },
    geCornResult(val, trs, headItem) {
      if (val && Array.isArray(val) && val.length > 0) {
        this.$set(trs, headItem.cronResult, val.join(',\n'));
      } else {
        this.$set(trs, headItem.cronResult, '');
      }
    },
    // 操作
    generateMain() {
      let obj = {};
      this.tableHead.forEach(item => {
        if (item.type && item.type.indexOf('double') > -1 ) {
          item.props.forEach(propsItem => obj[propsItem] = '')
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
      this.totalMain.forEach((item, index) => {
        item.indexId = index;
      })
    },
    del(index) {
      let delItem = this.totalMain.splice(index, 1);
      this.$emit('delete', delItem);
      this.refleshMainId();
    },
    add(index = 0) {
      if (this.operateHead.onlyLastAdd) {
        this.totalMain.push(this.generateMain());
      } else {
        this.totalMain.splice(index + 1, 0 , this.generateMain());
      };
      this.refleshMainId();
    },
    copy(item, trs, index) {
      let obj = this.generateMain();
      item.copyKeys.forEach(item => {
        obj[item] = trs[item];
      });
      if (this.operateHead.onlyLastAdd) {
        this.totalMain.push(obj);
      } else {
        this.totalMain.splice(index + 1, 0 , obj);
      };
      this.refleshMainId();
    },
  },
  watch: {
    tableData(value) {
      this.main = value;
    },
    totalData(value) {
      this.totalMain = value;
      if (this.totalMain.length == 0) {
        this.add();
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.text-hide {
  display: inline-block;
  width: 100%;
  height: 100%;
  span {
    display: inline-block;
    max-width: calc(100% - 16px - 5px);
    overflow: hidden;
    vertical-align: middle;
  }
  i {
    margin-left: 5px;
    display: inline-block;
    width: 16px;
    vertical-align: middle;
  }
}
.disabled-text {
  color: #9a9a9a;
}
</style>