loadMore () {
    let that = this;
    window.onscroll = function () {
        let timer = null;
        if (timer) return;
        timer = setTimeout(() => {
            let scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
            let totalHeight = document.body.scrollHeight;
            let viewHeight = document.documentElement.clientHeight;
            if (((scrollTop + viewHeight) >= (totalHeight - 1)) && that.loadStatus === 1 && !that.isLoad) {
                that.isLoad = true;
                let data = {
                workOrderSubmitId: that.workOrderSubmitId,
                eduAappWorkOrderType: that.search.currentType === '全部' ? '' : that.search.currentType,
                pageSize: that.pageSize,
                pageIndex: ++that.pageIndex
            };
            getRepairList(data).then(res => {
            if (res && res.myWorkOders.dataList[0]) {
                console.log(res.myWorkOders.dataList[0]);
                that.repairList = that.repairList.concat(res.myWorkOders.dataList);
                that.isLoad = false;
            } else {
                that.loadStatus = 2;
                that.isLoad = false;
            }
        });
        }
        clearTimeout(timer);
        timer = null;
    }, 200)
    }
}
beforeDestroy () {
    window.onscroll = null;
}