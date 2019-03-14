(function () {
  

  //管网维护
  function autoScroll(obj, type) {
      if (type == "0") {
          $(obj).find("ul").stop().animate({
              marginTop: "-120px"
          }, 2000, function () {
              $(this).css({ marginTop: "0px" }).find("li:first").appendTo(this);
          })
      } else if (type == "1") {
          $(obj).find("ul:first").stop().animate({
              marginTop: "-148px"
          }, 2000, function () {
              $(this).css({ marginTop: "0px" }).find("li:first").appendTo(this);
          })
      } else if (type == "2") {
          $(obj).find("ul:first").stop().animate({
              marginTop: "-63px"
          }, 2000, function () {
              $(this).css({ marginTop: "0px" }).find("li:first").appendTo(this);
          })
      } else if (type == "3") {
          $(obj).find("ul:first").stop().animate({
              marginTop: "-185px"
          }, 2000, function () {
              $(this).css({ marginTop: "0px" }).find("li:first").appendTo(this);
          })
      } else if (type == "4") {
          $(obj).find("ul:first").stop().animate({
              marginTop: "-35px"
          }, 2000, function () {
              $(this).css({ marginTop: "0px" }).find("li:first").appendTo(this);
          })
      } else if (type == "5") {
        $(obj).find("ul:first").stop().animate({
            marginTop: "-62px"
        }, 2000, function () {
            $(this).css({ marginTop: "0px" }).find("li:first").appendTo(this);
        })
    }
  }

  var init = function (did, type, timer) {
     // var timer = 5000;//计时器间隔时间
      var handId = null;//计时器id

      var Start = function () {
        if (!handId) {
            handId = setInterval(function () {
                autoScroll(did, type);
                // if (type == "0") {
                //     autoScroll(did, type);
                // } else {
                //     autoScroll(did, type);
                // }
            }, timer);
        }
          
      }

      var Stop = function () {
          clearInterval(handId);
          handId = null;
      }

      $(did).mouseover(function () {
          Stop();
      });

      $(did).mouseout(function () {
          Start();
      });

      setTimeout(Start(), 0);
  }
  init('.zngcItems', "0",5000);
  init(".gzsb", "1",5000);
  init('.zngcItems1', "2", 5000);
  init('.point_action', "3", 5000);
  init('.zzz_m', "4", 2000);
})(window);