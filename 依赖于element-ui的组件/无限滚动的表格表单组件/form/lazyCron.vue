<template>
  <div class="lazy-select" @click.stop="toogle">
    <span v-if="!toggle" :class="['lazy-text', (!cronParse(rowData[head.props]) || disabled) && 'disabled-text']">
      <span :title="rowData[head.cronResult] || cronParse(rowData[head.props])">
        {{rowData[head.cronResult] || cronParse(rowData[head.props]) || '请点击并选择'}}
      </span>
      <i class="el-icon-caret-bottom"></i>
    </span>
    <span v-if="toggle">
      <el-popover placement="top" 
        trigger="click"
        width="400px"
        height="400px"
        @hide="toggle = false">
        <cron v-model="rowData[head.props]" @showResult="geCornResult($event, rowData, head)"></cron>
        <span slot="reference" ref="cronitem" @click.stop>
          <span :class="['lazy-text', (!rowData[head.cronResult] || disabled) && 'disabled-text']">
            <span :title="rowData[head.cronResult]">
              {{rowData[head.cronResult] || '请点击并选择'}}
            </span>
            <i class="el-icon-caret-bottom"></i>
          </span>
        </span>
      </el-popover>
    </span>
  </div>
</template>

<script>
import Cron from 'components/Cron/cron';
import { splitDate } from 'utils/date.js'
import cronParser from 'cron-parser'

export default {
  data() {
    return {
      toggle: false,
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
    Cron
  },
  methods: {
    toogle() {
      if (this.disabled) return;
      if (this.toggle) {
        this.toggle = false;
      } else {
        this.toggle = true;
        this.$nextTick(() => {
          this.$refs.cronitem.click();
        })
      }
    },
    cronParse(value) {
      if (!value || value == '00 00 01 ? * ?') return '';
      let cronResult = [];
      let vArray = value.split(' ');
      let vDay = vArray[3];
      let vWeek = vArray[5];
      let vMonth = vArray[4];
      if (vDay === '?' && vWeek === '?') {
        return '';
      };
      if (vDay && vWeek && vMonth) {
        try {
          if (vDay == 'L') {
            let temV = value.split(' ');
            temV[3] = '01';
            temV = temV.join(' ')
            let interval = cronParser.parseExpression(temV);
            for(let i = 0; i < 10; i++) {
              let curDate = new Date(interval.next().toString());
              let year = curDate.getFullYear();
              let month = curDate.getMonth();
              cronResult.push(splitDate(new Date(year,month,0)));
            };
          } else {
            let interval = cronParser.parseExpression(value);
            for(let i = 0; i < 10; i++) {
              cronResult.push(splitDate(interval.next().toString()))
            };
          }
        } catch(e) {
          console.log(e)
        }
      };
      return (cronResult && Array.isArray(cronResult)) ? cronResult.join(',\n') : '';
    },
    geCornResult(val, trs, headItem) {
      if (val && Array.isArray(val) && val.length > 0) {
        this.$set(trs, headItem.cronResult, val.join(',\n'));
      } else {
        this.$set(trs, headItem.cronResult, '');
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.lazy-select {
  width: 100%;
  height: 100%;
}
.lazy-text {
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