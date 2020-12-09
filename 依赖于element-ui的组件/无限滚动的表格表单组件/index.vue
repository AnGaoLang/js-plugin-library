<template>
  <div class="bree-table-wrap">
    <basic-title v-if="title" class="sub-title">
      {{title}}<i>{{subTitle}}</i>
      <!-- 饲喂标准<i>（表头的选择框勾选后，此行或此列将不能在批次版本上修改）</i> -->
    </basic-title>
    <div class="fixed-table" ref="fixedTable" v-resize="checkXScroll">
      <div class="table-head-fixed">
        <table-head ref="tableHeadFixed"
          :disabledCofig="disabledCofig"
          :tableHead="normalHead"
          :tableData="main" />
      </div>
      <div class="table-body" @scroll="scrollTable" v-resize="checkYScroll">
        <div :style="{height: `${main.length == 1 ? 43 : (main.length * 42) + 1}px`}">
          <table-body :style="{transform: `translatey(${startIndex * 42}px)`}"
            :disabledCofig="disabledCofig"
            :tableHead="normalHead"
            :tableData="curMain"
            :totalData="main"
            :minRowNum="minRowNum"
            @delete="delData" />
        </div>
      </div>
      <!-- 左侧的固定栏 -->
      <div v-if="fixedHead[0]" 
           :class="['table-left-fixed', warpScrollLeft > 0 && 'right-shadow']"
           :style="isHasXScroll ? 'height: calc(100% - 20px)': ''">
        <div class="table-head-fixed">
          <table-head :disabledCofig="disabledCofig"
            :tableHead="fixedHead"
            :tableData="main" />
        </div>
        <div class="fixed-table-body" ref="tableLeftFixed">
          <div :style="{height: `${main.length * 42}px`}">
            <table-body :style="{transform: `translatey(${startIndex * 42}px)`}"
              :disabledCofig="disabledCofig"
              :tableHead="fixedHead"
              :tableData="curMain"
              :totalData="main"
              showFixed />
          </div>
        </div>
      </div>
      <!-- 固定的操作栏 -->
      <div v-if="operateHead[0] && isHasXScroll" 
           :class="['table-operate-fixed', isScrollXEnd || 'right-shadow']"
           :style="{
             height: isHasXScroll ? 'calc(100% - 20px)' : '100%',
             right: isHasYScroll ? '10px' : '0'
           }">
         <div class="table-head-fixed">
            <table-head :disabledCofig="disabledCofig"
              :tableHead="operateHead"
              :tableData="main" />
        </div>
        <div class="fixed-table-body" ref="tableOperateFixed">
          <div :style="{height: `${main.length * 42}px`}">
            <table-operate :style="{transform: `translatey(${startIndex * 42}px)`}"
              :disabledCofig="disabledCofig"
              :tableHead="normalHead"
              :tableData="main"
              :curTableData="curMain"
              :minRowNum="minRowNum"
              @delete="delData" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BasicTitle from 'components/Basic/BasicTitle';
import Cron from 'components/Cron/cron';
import TableHead from './table/head';
import TableBody from './table/body';
import TableOperate from './table/operate';

export default {
  data () {
    return {
      main: this.tableData,
      warpScrollLeft: 0,
      isScrollXEnd: false,
      startIndex: 0,
      endIndex: 10,
      isHasXScroll: false,
      isHasYScroll: false,
    }
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    subTitle: {
      type: String,
      default: ''
    },
    maxHeight: {
      type: String,
      default: 'auto'
    },
    tableHead: {
      type: Array,
      default: () => [],
    },
    tableData: {
      type: Array,
      default: () => []
    },
    // 是否可以配置编辑权限
    disabledCofig: {
      type: Boolean,
      default: false,
    },
    // 最少保留多少行数据不能删除
    minRowNum: {
      type: Number,
      default: 1
    }
  },
  computed: {
    // 常规情况下的表格头
    normalHead() {
      return this.tableHead.filter(item => (!item.hide || (item.type == 'operate' && item.noFixed)));
    },
    // 左侧的固定栏
    fixedHead() {
      return this.tableHead.filter(item => item.fixed && !item.hide);
    },
    // 操作栏的表格头
    operateHead() {
      let operateArray = this.tableHead.filter(item => (item.type == 'operate' && !item.noFixed));
      return operateArray[0] ? operateArray : [];
    },
    curMain() {
      return this.main.slice(this.startIndex, this.endIndex)
    }
  },
  directives: {
    resize: {
      bind(el, binding) {
        let width = '', height = '';
        function isReize() {
          const style = document.defaultView.getComputedStyle(el);
          if (width !== style.width || height !== style.height) {
            binding.value(el);
          }
          width = style.width;
          height = style.height;
        }
        el._interval = setInterval(isReize, 300);
      },
      unbind(el) {
        clearInterval(el._interval);
      }
    }
  },
  components: {
    BasicTitle,
    TableHead,
    TableBody,
    TableOperate,
  },
  methods: {
    // 判断必填项
    checkRequired() {
      for(let i = 0; i < this.tableHead.length; i++) {
        if (this.tableHead[i].required) {
          for(let j = 0; j < this.main.length; j++) {
            let props = this.tableHead[i].props;
            if (props instanceof Array) {
              let isEmpty = props.some(item => { return !this.main[j][item] && this.main[j][item] !== 0});
              if (isEmpty) {
                this.$errorMsg(this.tableHead[i].requireMsg);
                return false;
              };
            } else {
              if (typeof this.main[j][props] != 'boolean' && this.main[j][props] !== 0 && !this.main[j][props]) {
                this.$errorMsg(this.tableHead[i].requireMsg)
                return false;
              };
              if(this.main[j][props] instanceof Array) {
                let isEmpty = this.main[j][props].length == 0
                if (isEmpty) {
                  this.$errorMsg(this.tableHead[i].requireMsg);
                  return false;
                };
              }
              if(props == 'cron') {
                  if(!this.main[j]['cron'] || this.main[j]['cron'] == '00 00 01 ? * ?') {
                    this.$errorMsg(this.tableHead[i].requireMsg)
                    return false;
                  }
              }
            }
          }
        }
      };
      return true;
    },
    getCurData() {
      if (!this.checkRequired()) return false;
      let main = JSON.parse(JSON.stringify(this.main));
      main.forEach(item => {
        // execDateList转化为数组
        if (item.execDateList && !(item.execDateList instanceof Array)) {
          item.execDateList ? (item.execDateList = [item.execDateList]) : (item.execDateList = []);
        };
        delete item.unique;
        delete item.tips;
      });
      if (this.disabledCofig) {
        let obj = {};
        this.tableHead.forEach(item => {
          if (item.key) {
            obj[item.key] = item.select;
          }
        });
        return {
          head: obj,
          table: main,
        };
      } else {
        return main;
      }
    },
    checkXScroll(event) {
      let elScrollWidth = event.scrollWidth;
      let elClientWidth = event.clientWidth;
      this.isHasXScroll = elScrollWidth > elClientWidth;
    },
    checkYScroll(event) {
      let elScrollHeight = event.scrollHeight;
      let elClientHeight = event.clientHeight;
      this.isHasYScroll = elScrollHeight > elClientHeight;
    },
    scrollTable(event) {
      let target = event.target;
      let top = target.scrollTop;
      let left = this.warpScrollLeft = target.scrollLeft;
      requestAnimationFrame(() => {
        this.isScrollXEnd = (this.$refs.fixedTable.offsetWidth + left) >= target.scrollWidth;
        if (left >= 0) {
          this.$refs.tableHeadFixed.$el.style.transform = `translatex(-${left}px)`;
        };
        if (top >= 0) {
          let maxIndex = this.main.length;
          this.startIndex = Math.floor(top / 42);
          if (maxIndex > 10) {
            this.endIndex = (this.startIndex + 10) >= maxIndex ? maxIndex : (this.startIndex + 10);
          };
          this.$refs.tableLeftFixed && (this.$refs.tableLeftFixed.style.transform = `translatey(-${top}px)`);
          this.$refs.tableOperateFixed && (this.$refs.tableOperateFixed.style.transform = `translatey(-${top}px)`);
        };
      })
    },
    delData(value) {
      this.$emit('delete', value)
    }
  },
  watch: {
    tableData(value) {
      if (!value) return;
      this.main = value;
      this.main.forEach((item, index) => {
        item.indexId = index;
        if (item.cycle) {
          this.tableHead.forEach(headItem => {
            if (headItem.unique) {
              let cycleHead = this.tableHead.find(headitem => headitem.props == 'cycle');
              let cycleId = cycleHead.list.find(headitem => headitem.value == item.cycle);
              item.unique = headItem.preList[cycleId.id];
            };
          })
        };
      });
    }
  }
}
</script>

<style lang="scss" scoped>
  .right-shadow {
    box-shadow: 0 0 15px rgba(0,0,0,.2);
  }
  .sub-title {
    margin-left: 0!important;
    padding-left: 0!important;
    width: 100%!important;
    height: 30px;
    font-size: 18px;
    & > i {
      font-style: normal;
      font-size: 12px;
    }
  }
  .fixed-table {
    position: relative;
    overflow: hidden;
    height: calc(100% - 40px);
  }
  .table-head-fixed {
    display: inline-block;
    position: absolute;
  }
  .table-body {
    display: inline-block;
    max-width: 100%;
    margin-top: 43px;
    overflow: auto;
    max-height: 350px;
    .td-inner-box {
      span {
        display: inline-block;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
  .fixed-table-body {
    margin-top: 43px;
  }
  .table-left-fixed {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
    height: calc(100% - 20px);
    overflow: hidden;
    background: #fff;
    .table-head-fixed {
      z-index: 10;
      ::v-deep th {
        border-right: 1px solid #fff;
      }
    }
  }
  .table-operate-fixed {
    position: absolute;
    top: 0;
    right: 10px;
    z-index: 10;
    height: calc(100% - 20px);
    overflow: hidden;
    background: #fff;
    .table-head-fixed {
      z-index: 10;
      ::v-deep th {
        border-left: 1px solid #fff;
      }
    }
  }
</style>
