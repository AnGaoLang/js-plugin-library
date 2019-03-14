// 无缝轮播
var CarouselFigure = (function () {
  /**
   * @param {*String} id 外层包裹元素的id
   * @param {*Number} step 单个轮播成员的宽
   */
  /** 有效的html格式
   * <div id="carsouelOne">
      <span class="prev"></span>
        <div class="carousel_container">
          <ul class="scroll_main" style="transform:translateX(-580px)">
            <li></li>
          </ul>
        </div>
      <span class="next"></span>
    </div>
   * 
   * 
   */
  function _CarouselFigure (id, step) {
    var container = document.getElementById(id); // 最外层包裹层
    var prev = container.getElementsByClassName('prev')[0]; // 左
    var next = container.getElementsByClassName('next')[0]; // 右
    this.main = container.getElementsByClassName('scroll_main')[0]; // 轮播主体，即上面的ul
    this.timmer; // 多久轮播一次
    this.distance = -1 * step; // 轮播一次的距离
    this.total = this.main.children.length; // 轮播项的总数，若实际是4，前后加一实现无缝轮播
    this.index = 1; // 当前轮播项的索引

    var that = this;
    that.start();
    // 鼠标悬停停止轮播
    container.addEventListener('mouseleave', function () {that.start()});
    container.addEventListener('mouseenter', function () {that.stop()});
    // 轮播图左右切换
    prev.addEventListener('click', function () {that.scrollAnimate(-1)});
    next.addEventListener('click', function () {that.scrollAnimate(1)});
  }

  _CarouselFigure.prototype = {
    // 构造函数
    constructor: _CarouselFigure,
    /** 
     * @param {当前轮播项的索引} num
     */
    scrollAnimate: function (num) {
      var that = this;
      if (this.index <= 0 || this.index >= this.total - 1) {return};
      this.index = this.index + num;
      // 轮播滚动到index为0或最大时，自动跳到最大或0
      if (this.index === 0) {
        setTimeout(function () {
          that.index = that.total-2
          that.main.style = "transform:translateX(" + (that.index * that.distance) + "px)";
        }, 500)
      }else if (this.index === this.total-1) {
        setTimeout(function () {
          that.index = 1
          that.main.style = "transform:translateX(-580px)";
        }, 500)
      }
      this.main.style = "transform:translateX(" + (this.index * this.distance) + "px);transition:0.5s;;"; 
    },
    // 轮播开始函数
    start: function () {
      var that = this;
      this.timmer = setInterval(function () {
        that.scrollAnimate(1);
      }, 5000)
    },
    // 轮播停止也是结束函数
    stop: function () {
      clearInterval(this.timmer);
      this.timmer = null;
    }
  }

  return _CarouselFigure;
})()


// 动态创建iframe
var createIframe = function (dom, src) {
  var iframe = document.createElement("iframe");
	
	//设置iframe的样式
	iframe.width = '100%';
  iframe.height = '100%';
  iframe.border = 'none';
  iframe.allowtransparency = 'true';
	
	iframe.src = src;
	//把iframe载入到dom以下
  dom.appendChild(iframe);
}
