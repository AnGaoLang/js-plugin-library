<template>
  <div class="classify-wrap" @click.stop>
    <input type="text" :class="['classify-input', visible && 'input-focus']" 
      :value="getLabel(curValue)" 
      readonly 
      :placeholder="placeholder"
      @click="toggle">
    <div class="icon-warp">
      <i v-if="curValue" class="el-icon-circle-close" @click="clear"></i>
      <i class="el-icon-arrow-up"></i>
    </div>
    <div :class="['classify-options', visible ? 'show' : 'hide']">
      <div class="search-input">
        <input type="text" v-model="searchValue" placeholder="输入并搜索" @input="search">
        <div class="icon-warp">
          <i v-if="!searchValue" class="el-icon-search"></i>
          <i v-else class="el-icon-circle-close" @click.stop="clearSearch"></i>
        </div>
      </div>
      <div v-if="!searchValue" class="labels-head" @click="clickHead">
        <span v-for="(item, index) in options" 
          :key="`head${index}`"
          :style="{'width': `${100 / options.length}%`}"
          :data-offsettop="item.offsetTop"
          :class="[item.select && 'select']">{{item.divide}}</span>
      </div>
      <div class="options-warp" ref="optionsWarp" @scroll="scrollOptions" @click="clickOption">
        <div class="divide-wrap" ref="divideWrap"
          v-for="(item, index) in options" 
          :key="`divideWrap${index}`">
          <div v-if="item.divide" class="divide-title">{{item.divide}}</div>
          <ul>
            <li v-for="(option, optionIndex) in item.list" 
              :key="`option${optionIndex}`"
              :class="{'select': option.value == curValue}"
              :data-value="option.value">{{option.label}}</li>
          </ul>
        </div>
        <div v-if="!options || options.length == 0" class="options-warp no-data">
          暂无数据...
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
      placeholder: {
        type: String,
        default: '请选择'
      },
      value: String | Number,
      list: {
        type: Array,
        default: () => []
      }
      // [
      //     {
      //       divide: '生产数据',
      //       list: [
      //         {
      //           label: '生产数据1',
      //           value: 1
      //         },
      //         {
      //           label: '生产数据2',
      //           value: 2
      //         },
      //         {
      //           label: '生产数据3',
      //           value: 3
      //         },
      //         {
      //           label: '生产数据4',
      //           value: 4
      //         },
      //         {
      //           label: '生产数据5',
      //           value: 5
      //         },
      //         {
      //           label: '生产数据6',
      //           value: 6
      //         }
      //       ]
      //     },
      // ]
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
        cacheOptions: null,
        options: [],
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
            // 用dom获取节点，当页面有多个组件实例时，或获多个组件实例的dom，这里需要通过ref将获取的dom封装在组件实例之内
            let optionsWrap = this.$refs.optionsWarp;
            if (this.curValue) {
              let curSelected = optionsWrap.querySelector(`li[data-value='${this.curValue}']`);
              optionsWrap.scrollTop = curSelected.offsetTop - 100;
            };
            if (!this.getDivideOffsetTop) {
              let domList = this.$refs.divideWrap;
              this.scrollHeight = optionsWrap.scrollHeight;
              console.log(this.scrollHeight)
              for(let i = 0; i < domList.length; i++){
                let offsetTop = domList[i].offsetTop;
                this.options[i].offsetTop = offsetTop + 30;
              };
              this.cacheOptions = JSON.parse(JSON.stringify(this.options));
              this.getDivideOffsetTop = true;
            }
          })
        } else {
          this.clearSearch();
        }
      },
      getLabel(value) {
        let label = '';
        let list = this.cacheOptions || this.options;
        list.forEach(item => {
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
      clickHead(event) {
        let path = event.path;
        let target;
        path.forEach(item => {
          if (item.nodeName == 'SPAN') {
            target = item;
            return;
          }
        });
        // let target = event.currentTarget;
        let dataOffsetTop = target.getAttribute('data-offsettop');
        let offsetTop = dataOffsetTop - 30;
        let wrap = this.$refs.optionsWarp;
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
            if ((instance > 0 && (wrap.scrollTop >= offsetTop || wrap.scrollTop >= (this.scrollHeight - 310))) || 
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
        console.log(this.timer)
      },
      clickOption(event) {
        // 当页面被翻译时，会自动插入font标签，这是event.target获取的是插入的font标签
        // 可以遍历path拿到最近的非font标签
        let path = event.path;
        let target;
        path.forEach(item => {
          if (item.nodeName == 'LI') {
            target = item;
            return;
          }
        });
        if (!target) return;
        let value = target.getAttribute('data-value');
        if (value) {
          this.curValue = value;
          this.$emit('change', this.curValue);
          this.hideOptios();
        };
      },
      scrollOptions(event) {
        if (this.searchValue) return;
        let target = event.currentTarget;
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
      clearSearch() {
        this.searchValue = '';
        this.options = JSON.parse(JSON.stringify(this.cacheOptions));
      },
      hideOptios() {
        if (this.visible) {
          this.visible = false;
          this.clearSearch();
        }
      },
      search() {
        if (!this.searchValue) {
          this.clearSearch();
          return;
        };
        let result = [];
        this.options.forEach(item => {
          let array = [];
          item.list.forEach(option => {
            if (option.label.indexOf(this.searchValue) > -1) {
              if (!array[0]) {
                array[0] = {
                  divide: item.divide,
                  list: [],
                }
              };
              array[0].list.push(option);
            }
          });
          result = result.concat(array);
        });
        console.log(result)
        this.options = result;
      },
      clear() {
        let wrap = this.$refs.optionsWarp;
        wrap.scrollTop = 0;
        this.curValue = '';
        this.$emit('change', this.curValue);
        this.hideOptios();
      },
    },
    watch: {
      value(newValue, oldValue) {
        if (newValue != oldValue) {
          this.curValue = newValue;
        }
      },
      list: {
        immediate: true,
        handler(newValue) {
          newValue.forEach((item, index) => {
            item.select = (index == 0);
            item.offsetTop = 0;
          });
          console.log(newValue)
          this.options = JSON.parse(JSON.stringify(newValue));
          this.getDivideOffsetTop = false;
          this.visible = false;
        },
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
  transition: 0.2s;
  transform-origin: top center;
  overflow: hidden;
  &.show {
    // height: 383px;
    opacity: 1;
    transform: scaley(1);
  }
  &.hide {
    //  height: 0;
    transform: scaley(0);
     opacity: 0;
  }
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
  &.no-data {
    height: 150px;
    padding-top: 50px;
    text-align: center;
  }
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