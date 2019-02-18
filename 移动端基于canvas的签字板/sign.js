/**
 *  canvasEl: canvas的dom节点
 *  width: canvas的初始化宽
 *  height: canvas的初始化高
 */
class Sign {
  constructor (canvasEl, width, height) {
    this.canvasDom = canvasEl;
    this.canvas = this.canvasDom.getContext('2d');
    this.canvasXY = this.canvasDom.getBoundingClientRect(); // 获取画布相对于页面左上角的坐标位置
    this.canvasDom.width = width;
    this.canvasDom.height = height;
    this.init();
  }

  init () {
    let that = this;
    this.canvas.scale(1, 1); // 还原画板大小
    this.signStart = this.signStart.bind(this); // 将事件函数内部this重新绑定到本Sign类的this上
    this.signMove = this.signMove.bind(this);
    this.signEnd = this.signEnd.bind(this);
    this.canvasDom.addEventListener('touchstart', that.signStart);
    this.canvasDom.addEventListener('touchEnd', that.signEnd);
  }

  signStart (event) {
    let that = this;
    this.canvas.beginPath();
    this.canvas.strokeStyle = '#000';
    this.canvas.moveTo(
      event.targetTouches[0].clientX - this.canvasXY.left, // 鼠标坐标减去canvas左上角坐标位置，得到鼠标在canvas画板内部的坐标数值
      event.targetTouches[0].clientY - this.canvasXY.top
    );
    this.canvasDom.addEventListener('touchmove', that.signMove);
  }

  signMove (event) {
    this.canvas.lineTo(
      event.targetTouches[0].clientX - this.canvasXY.left,
      event.targetTouches[0].clientY - this.canvasXY.top
    );
    this.canvas.stroke();
  }

  signEnd () {
    var that = this;
    this.canvasDom.removeEventListener('touchstart', that.signStart);
    this.canvasDom.removeEventListener('touchmove', that.signMove);
    this.canvasDom.removeEventListener('touchEnd', that.signEnd);
  }

  // 将canvas保存为base64位码的图片
  save () {
    return this.canvasDom.toDataURL();
  }

  // 还原画板
  clear () {
    let width = this.canvasDom.offsetWidth + 1000;
    let height = this.canvasDom.offsetHeight + 1000;
    this.canvas.clearRect(0, 0, width, height);
  }
}

export default Sign;
