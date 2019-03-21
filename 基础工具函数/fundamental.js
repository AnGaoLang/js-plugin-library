// 去除数组的空项或false项
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

