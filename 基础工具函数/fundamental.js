import { table } from './example.js';

// 去除数组的空项或false项
// 另外还可以用array.filter(Boolean); 筛选出数组的真值成员。在数组成员不为false可用此方法删除空项。
function deleteEmpty(array) {
  var returnArray = array;
  for (var i = 0; i < returnArray.length; i++) {
      if (!returnArray[i]) {
          returnArray.splice(i, 1);
          i = i - 1; // 删除数组项后，数组项长度会变短，这里减一则防止下一数组项背跳过
      }
  };
  return returnArray;
};

// 用新的数组项，覆盖对应的目标数组项，source的数组项要和update数组项对等，才能一一覆盖
function updateArray(source, update) {
  // 深拷贝
  var source = JSON.parse(JSON.stringify(source));
  // 先循环待更新的数据源，然后循环目标数据源，一一配对。
  update.forEach(function (item) {
      for (var i = 0; i < source.length; i++) {
          // 如果预设的表格里的项和当前表格里的项相同，则改变为被选中状态
          if (source[i].key == item.key) {
            source[i] = item;
          };
      }
  });
  return source;
};

// 数组去重
/*
* 给传入数组排序，排序后相同值相邻，
* 然后遍历时,新数组只加入不与前一值重复的值。
* 会打乱原来数组的顺序
* */
function uniq(array){
  array.sort(); // 此处传入处理函数，给引用类型的值排序
  var temp=[array[0]];
  for(var i = 1; i < array.length; i++){
      if( array[i] !== temp[temp.length-1]){
          temp.push(array[i]);
      }
  }
  return temp;
}

/**
 * table的列传行，以便循环
 * @param {} source : 引入的table.json,输出值如下
 */
function columnToRow (source) {
  var that = this;
  // 最外层的包裹数组
  var arrayOuter = [];
  // 目标类型的总数量
  var arrayLength = source[0].target.length;
  // 以目标类型的总数量为长度创造二维数组，每一个数组项即当前目标类型的所有人员的完成情况
  for (var i = 0; i < arrayLength; i++) {
      var arrayInner = {
          targetName: '', // 当前目标类型的名称
          targetList: [] // 当前目标类型的所有人员数据构成的数组
      };
      // 将每一个人员的当前目标类型的数据推入数组
      source.forEach(function (item) {
          arrayInner.targetName = item.target[i].name;
          // 加入销售人员id
          item.target[i]['marketerID'] = item.marketerID;
          arrayInner.targetList.push(item.target[i]);
      })
      // 推入最外层数组
      arrayOuter.push(arrayInner);
  }
  return arrayOuter;
}

