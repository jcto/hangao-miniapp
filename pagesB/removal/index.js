// pagesB/removal/index.js
let app = getApp();
Page({
  data: {
    show: true,
    transitionModel: "",
    list: [],
   

    total:0,//桶数
    isShow:false
  },
  // 删除
  onClose(e) {
    let index = e.currentTarget.dataset.index;
    console.log(e)
    if (e.target.id == "close") {
      this.showToast({
        msg: "是否删除"
      }).then(res => {
        
        this._removeList(index)
        wx.setStorageSync("outTankList", this.data.list)
      })
    }
  },
  // tkCheck
  tkCheck(result) {
    let list = this.data.list;
    if (result.length === 8) {

      list.unshift(result);

      let newList = [...new Set(list)]

      this.setData({
        list: newList,


      })
      wx.setStorageSync("outTankList", this.data.list)
    } else {
      wx.showToast({
        title: 'Tank编号为八位,请扫码Tank二维码',
        icon: "none"
      })
    }
  },
  // 提示框
  showToast(params) {
    return new Promise((resole, reject) => {
      this._showToast(params, resole, reject)
    })
  },
  _showToast(params, resole, reject) {
    wx.showModal({
      title: params.title || "提示",
      content: params.msg,
      success(res) {
        if (res.confirm) {
          resole(res)
        }
      }
    })
  },
  _removeList(index) {
    this.data.list.splice(index, 1)
    let tkDN = this.data.list;
    this.setData({
      list: tkDN
    })
  },
  // 扫码
  scan() {
    let that = this;
    let list = this.data.list;
    wx.scanCode({
      success: (res) => {
       
        let result = res.result;
       
        that.tkCheck(result)
      },
      fail: (res) => {
        console.log(res);
      }

    })
  },
  TKInputEnd(e) {
    let inputTK = e.detail.value;
    if (inputTK) {
      this.tkCheck(inputTK)
    }


  },
  // 上一页
  goBack() {
    wx.setStorageSync("outTankList", this.data.list)
    wx.navigateBack({})
  },
  
 
// 下一页
  next(){
    if (this.data.total != this.data.list.length){
      this.setData({
        isShow:true
      });
      return
    }
    // 储存tk列表的值
    wx.setStorageSync("outTankList", this.data.list)
   
    wx.navigateTo({
      url: '../explain/index',
    })
  },
  onShow:function(){
    let DNINFO = wx.getStorageSync("OUTINFO");
    let list = wx.getStorageSync("outTankList");
    
    console.log(list)
    if(!list){
      list = []
    };
    if (this.data.list !== list) {
    
      this.setData({
        total: tNum,
        DN: DNINFO.TKNUMBER,
        list
      })
    }
    console.log(DNINFO)
    let tNum = DNINFO.total;
    console.log(tNum)
    this.setData({
      total: tNum,
      DN: DNINFO.TKNUMBER,
     
    })
  }
})