var table = [
  {
      "year": 2019,
      "month": 3,
      "target": [
          {
              "storeID": "STR00000041",
              "marketerID": null,
              "month": "2019-03",
              "name": "客户月销售额",
              "current": 0,
              "target": null,
              "total": 0,
              "ruleCode": "ST001",
              "isCanSetTarget": 1,
              "type": 1,
              "createTime": "2019-03-22 16:12:43",
              "unit": "元"
          },
          {
              "storeID": "STR00000041",
              "marketerID": null,
              "month": "2019-03",
              "name": "客户桌数",
              "current": 0,
              "target": null,
              "total": 0,
              "ruleCode": "ST002",
              "isCanSetTarget": 1,
              "type": 1,
              "createTime": "2019-03-22 16:12:43",
              "unit": "桌"
          }
      ]
  },
  {
      "year": 2019,
      "month": 2,
      "target": [
          {
              "storeID": "STR00000041",
              "marketerID": null,
              "month": "2019-02",
              "name": "客户月销售额",
              "current": 0,
              "target": null,
              "total": 0,
              "ruleCode": "ST001",
              "isCanSetTarget": 1,
              "type": 1,
              "createTime": "2019-03-22 14:52:31",
              "unit": "元"
          },
          {
              "storeID": "STR00000041",
              "marketerID": null,
              "month": "2019-02",
              "name": "客户桌数",
              "current": 0,
              "target": null,
              "total": 0,
              "ruleCode": "ST002",
              "isCanSetTarget": 1,
              "type": 1,
              "createTime": "2019-03-22 14:52:31",
              "unit": "桌"
          }
      ]
  },
  {
      "year": 2019,
      "month": 1,
      "target": [
          {
              "storeID": "STR00000041",
              "marketerID": null,
              "month": "2019-01",
              "name": "客户月销售额",
              "current": 0,
              "target": null,
              "total": 0,
              "ruleCode": "ST001",
              "isCanSetTarget": 1,
              "type": 1,
              "createTime": "2019-03-22 14:52:36",
              "unit": "元"
          },
          {
              "storeID": "STR00000041",
              "marketerID": null,
              "month": "2019-01",
              "name": "客户桌数",
              "current": 0,
              "target": null,
              "total": 0,
              "ruleCode": "ST002",
              "isCanSetTarget": 1,
              "type": 1,
              "createTime": "2019-03-22 14:52:36",
              "unit": "桌"
          }
      ]
  }
]

// columnToRow(table)的输出值
var output = [
  {
      "targetName": "客户月销售额",
      "targetList": [
          {
              "storeID": "STR00000041",
              "month": "2019-03",
              "name": "客户月销售额",
              "current": 0,
              "target": null,
              "total": 0,
              "ruleCode": "ST001",
              "isCanSetTarget": 1,
              "type": 1,
              "createTime": "2019-03-22 16:12:43",
              "unit": "元"
          },
          {
              "storeID": "STR00000041",
              "month": "2019-02",
              "name": "客户月销售额",
              "current": 0,
              "target": null,
              "total": 0,
              "ruleCode": "ST001",
              "isCanSetTarget": 1,
              "type": 1,
              "createTime": "2019-03-22 14:52:31",
              "unit": "元"
          },
          {
              "storeID": "STR00000041",
              "month": "2019-01",
              "name": "客户月销售额",
              "current": 0,
              "target": null,
              "total": 0,
              "ruleCode": "ST001",
              "isCanSetTarget": 1,
              "type": 1,
              "createTime": "2019-03-22 14:52:36",
              "unit": "元"
          }
      ]
  },
  {
      "targetName": "客户桌数",
      "targetList": [
          {
              "storeID": "STR00000041",
              "month": "2019-03",
              "name": "客户桌数",
              "current": 0,
              "target": null,
              "total": 0,
              "ruleCode": "ST002",
              "isCanSetTarget": 1,
              "type": 1,
              "createTime": "2019-03-22 16:12:43",
              "unit": "桌"
          },
          {
              "storeID": "STR00000041",
              "month": "2019-02",
              "name": "客户桌数",
              "current": 0,
              "target": null,
              "total": 0,
              "ruleCode": "ST002",
              "isCanSetTarget": 1,
              "type": 1,
              "createTime": "2019-03-22 14:52:31",
              "unit": "桌"
          },
          {
              "storeID": "STR00000041",
              "month": "2019-01",
              "name": "客户桌数",
              "current": 0,
              "target": null,
              "total": 0,
              "ruleCode": "ST002",
              "isCanSetTarget": 1,
              "type": 1,
              "createTime": "2019-03-22 14:52:36",
              "unit": "桌"
          }
      ]
  }
];

export { table }
