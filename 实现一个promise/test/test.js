var promisesAplusTests = require("promises-aplus-tests");
var adapter = require("../dist/MPromise.min.js");

// 测试promise
promisesAplusTests(adapter, function (err) {
  console.log(err)
    // All done; output is in the console. Or check `err` for number of failures.
});