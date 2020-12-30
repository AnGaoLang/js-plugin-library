<template>
  <div class="classify-wrap" @click.stop>
    <input type="text" :class="['classify-input', visible && 'input-focus']" 
      :value="getLabel(curValue)" 
      readonly 
      :placeholder="placeholder"
      @click="toggle">
    <div class="icon-warp">
      <i v-show="curValue" class="el-icon-circle-close" @click="clear"></i>
      <i class="el-icon-arrow-up"></i>
    </div>
    <div v-show="visible" class="classify-options">
      <div class="search-input">
        <input type="text" v-model="searchValue" placeholder="输入并搜索" @input="search">
        <div class="icon-warp">
          <i v-if="!searchValue" class="el-icon-search"></i>
          <i v-else class="el-icon-circle-close" @click="searchValue = ''"></i>
        </div>
      </div>
      <div class="labels-head" @click="clickHead">
        <span v-for="(item, index) in options" 
          :key="`head${index}`"
          :style="{'width': `${100 / options.length}%`}"
          :data-offsetTop="item.offsetTop"
          :class="[item.select && 'select']">{{item.divide}}</span>
      </div>
      <div class="options-warp" @scroll="scrollOptions" @click="clickOption">
        <div class="divide-wrap" v-for="(item, index) in options" 
          :key="`divideWrap${index}`">
          <div class="divide-title">{{item.divide}}</div>
          <ul>
            <li v-for="(option, optionIndex) in item.list" 
              :key="`option${optionIndex}`"
              :class="{'select': option.value == curValue}"
              :data-label="option.label"
              :data-value="option.value">{{option.label}}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    model: {
      event: 'change'
    },
    props: {
      placeholder: String,
      value: String | Number
    },
    data() {
      return {
        visible: false,
        debounce: null,
        timer: null,
        getDivideOffsetTop: false,
        scrollHeight: 0,
        curValue: this.value,
        searchValue: '',
        options: [
          {
            divide: '生产数据',
            offsetTop: 0,
            select: true,
            list: [
              {
                label: '生产数据1',
                value: 1
              },
              {
                label: '生产数据2',
                value: 2
              },
              {
                label: '生产数据3',
                value: 3
              },
              {
                label: '生产数据4',
                value: 4
              },
              {
                label: '生产数据5',
                value: 5
              },
              {
                label: '生产数据6',
                value: 6
              }
            ]
          },
          {
            divide: '批次标准',
            offsetTop: 0,
            select: false,
            list: [
              {
                label: '批次标准1',
                value: 11
              },
              {
                label: '批次标准2',
                value: 21
              },
              {
                label: '批次标准3',
                value: 31
              },
              {
                label: '批次标准4',
                value: 41
              },
              {
                label: '批次标准5',
                value: 51
              },
              {
                label: '批次标准6',
                value: 61
              }
            ]
          },
          {
            divide: '批次标准1',
            offsetTop: 0,
            select: false,
            list: [
              {
                label: '批次标准1',
                value: 111
              },
              {
                label: '批次标准2',
                value: 211
              },
              {
                label: '批次标准3',
                value: 311
              },
              {
                label: '批次标准4',
                value: 411
              },
              {
                label: '批次标准5',
                value: 511
              },
              {
                label: '批次标准6',
                value: 611
              }
            ]
          },
          {
            divide: '批次标准2',
            offsetTop: 0,
            select: false,
            list: [
              {
                label: '批次标准1',
                value: 112
              },
              {
                label: '批次标准2',
                value: 212
              },
              {
                label: '批次标准3',
                value: 312
              },
              {
                label: '批次标准4',
                value: 412
              },
              {
                label: '批次标准5',
                value: 512
              },
              {
                label: '批次标准6',
                value: 612
              }
            ]
          },
          {
            divide: '批次标准3',
            offsetTop: 0,
            select: false,
            list: [
              {
                label: '批次标准1',
                value: 113
              },
              {
                label: '批次标准2',
                value: 213
              },
              {
                label: '批次标准3',
                value: 313
              },
              {
                label: '批次标准4',
                value: 413
              },
              {
                label: '批次标准5',
                value: 513
              },
              {
                label: '批次标准6',
                value: 613
              }
            ]
          }
        ],
      }
    },
    mounted() {
      document.body.addEventListener('click', this.hideOptios);
    },
    destroyed() {
      document.body.removeEventListener('click', this.hideOptios);
    },
    methods: {
      toggle() {
        this.visible = !this.visible;
        if (this.visible) {
          this.$nextTick(() => {
            let optionsWrap = document.querySelector('.options-warp');
            if (this.curValue) {
              let curSelected = document.querySelector(`li[data-value='${this.curValue}']`);
              optionsWrap.scrollTop = curSelected.offsetTop - 100;
            };
            if (!this.getDivideOffsetTop) {
              let domList = document.querySelectorAll('.divide-wrap');
              this.scrollHeight = optionsWrap.scrollHeight;
              for(let i = 0; i < domList.length; i++){
                let offsetTop = domList[i].offsetTop;
                this.options[i].offsetTop = offsetTop + 30;
              };
              this.getDivideOffsetTop = true;
            }
          })
        }
      },
      hideOptios() {
        this.visible = false;
      },
      getLabel(value) {
        let label = '';
        this.options.forEach(item => {
          let exit = false;
          item.list.forEach(option => {
            if (option.value == value) {
              label = option.label;
              exit = true;
              return;
            }
          });
          if (exit) return;
        });
        return label
      },
      clear() {
        let wrap = document.querySelector('.options-warp');
        wrap.scrollTop = 0;
        this.curValue = '';
        this.$emit('change', this.curValue);
        this.hideOptios();
      },
      clickHead(event) {
        let target = event.target;
        let offsetTop = target.getAttribute('data-offsetTop');
        offsetTop = offsetTop - 30;
        let wrap = document.querySelector('.options-warp');
        let instance = parseInt(offsetTop - wrap.scrollTop);
        if (instance == 0) return;
        if (this.debounce) {
          clearTimeout(this.debounce);
          clearInterval(this.timer);
          this.timer = null;
          this.debounce = null;
        };
        this.debounce = setTimeout(() => {
          this.timer = setInterval(() => {
            if ((instance > 0 && (wrap.scrollTop >= offsetTop || wrap.scrollTop >= (this.scrollHeight - 300))) || 
              (instance < 0 && wrap.scrollTop <= offsetTop)) {
              wrap.scrollTop = offsetTop;
              clearInterval(this.timer);
              this.timer = null;
              return;
            };
            console.log(1)
            wrap.scrollTop = wrap.scrollTop + (instance / 10);
          }, 20);
        }, 200);
      },
      clickOption(event) {
        let value = event.target.getAttribute('data-value');
        if (value) {
          this.curValue = value;
          this.$emit('change', this.curValue);
          this.hideOptios();
        };
      },
      scrollOptions(event) {
        let target = event.target;
        let offsetHeight = target.offsetHeight;
        let scrollTop = target.scrollTop;
        this.options.forEach(item => (item.select = false));
        if (scrollTop <= this.options[0].offsetTop) {
          this.options[0].select = true;
        };
        for(let i = 0; i + 1 < this.options.length; i++) {
          let curOption = this.options[i];
          let nextOption = this.options[i + 1];
          if (scrollTop > curOption.offsetTop && scrollTop <= nextOption.offsetTop) {
            nextOption.select = true;
          }
        };
      },
      search() {
        console.log(this.searchValue)
      }
    },
    watch: {
      value(newValue, oldValue) {
        if (newValue != oldValue) {
          this.curValue = newValue;
        }
      }
    }
  }
</script>

<style lang="scss" scoped="scoped">
input {
  display: block;
  width: 100%;
  height: 100%;
  padding: 0 30px 0 15px;
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    border-color: #C0C4CC;
  }
}
.classify-wrap {
  position: relative;
  width: 100%;
  height: 40px;
  line-height: 40px;
  cursor: pointer;
  box-sizing: border-box;
  .input-focus {
    border-color: $primary;
    & + .icon-warp > .el-icon-arrow-up {
      transform: rotate(180deg);
    }
  }
}
.icon-warp {
  position: absolute;
  top: 0;
  right: 5px;
  width: 25px;
  line-height: 40px;
  height: 100%;
  color:#C0C4CC;
  text-align: center;
  .el-icon-arrow-up, .el-icon-circle-close {
    transition: all 0.3s;
    line-height: 40px;
  }
  .el-icon-circle-close {
    display: none;
  }
  &:hover .el-icon-circle-close {
    display: block;
    & + .el-icon-arrow-up {
      display: none;
    }
  }
}
.classify-options {
  border: 1px solid #DCDFE6;
  position: absolute;
  top: 45px;
  z-index: 100;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  background: #fff;
  border-radius: 4px;
  user-select: none;
  .search-input {
    position: relative;
    width: 100%;
    line-height: 40px;
    height: 40px;
    input {
      width: 100%;
      border: none;
      border-bottom: 1px solid #DCDFE6;
    }
  }
  .el-icon-circle-close {
    display: inline-block;
  }
}
.labels-head {
  white-space: nowrap;
  text-align: center;
  span {
    display: inline-block;
    padding: 0 10px;
    border-bottom: 1px solid #DCDFE6;
    border-right: 1px solid #DCDFE6;
  }
   :last-child {
    border-right: none;
  }
}
.options-warp {
  width: 100%;
  height: 300px;
  line-height: 30px;
  overflow-y: auto;
  position: relative;
  .divide-wrap {
    .divide-title {
      font-size: 16px;
      padding-left: 10px;
      color: $fontGray;
    }
    li {
      padding-left: 20px;
      &:hover, &.select {
        background: $lightGray;
        color: $primary;
      }
    }
  }
}
.select {
  background: $lightGray;
  color: $primary;
}
</style>