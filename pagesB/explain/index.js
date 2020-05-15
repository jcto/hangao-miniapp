import { config } from "./../../utils/config"
import { loginModules } from "../../modules/login.js";
let LoginModules = new loginModules();
let app = getApp()
Page({
  data: {
    imgList: [],
    imgKeys:[],
    fontMaxFlag: false,
    fontMax: "您还可以输入150个字",
    note:"",
    valTips: "",
    isShow: false,
    btnForbidden:false
  },
  // 上传图片预览
  uploadImg() {
    const that = this;
    if (this.data.upImgDone) {
      return
    }
    wx.chooseImage({
      count: 9,
      success: function (res) { 
        let tempFilePaths = res.tempFilePaths;
        that.upImg(tempFilePaths)     
      },
      fail: function (err) {
        console.log(err.errMsg)
        wx.showToast({
          title: err.errMsg,
          icon: "none"
        })
      }
    })
  },

  // 上传图片到服务器
  upImg(fileArray){
    let that = this;
    this._tipsUpImging()
    for(let index =0 ; index < fileArray.length;index++){
      wx.uploadFile({
        url: config.baseUrl + '/FileUpload/FromDataUpload', 
        filePath: fileArray[index],
        name: 'file',
         header:{
           Authorization:`Bearer ${wx.getStorageSync("token")}`
         },
        success(res) {
          let data = res.data
          let code = res.statusCode.toString();
          // 请求成功
          if (code.startsWith("2")) {
            let imgPath = fileArray[index];
            data = JSON.parse(data);
            let imgKeys = data.ImageUrls[0];
            let imgItem = {
              path: imgPath,
              key: imgKeys
            }
            let imgList = that.data.imgList.concat(imgItem);
            that.setData({
              imgList
            })   
            that._tipsUpImgDone()        
          }
        }
      })
    } 
  },

  _tipsUpImging() {
    wx.showLoading({
      title: '图片上传中……',
    })
    this.data.upImgDone = true;
  },
  _tipsUpImgDone() {
    wx.hideLoading()
    
    this.data.upImgDone = false;
  },
// 获取服务器返回图片keys
  getImgKeys(){
    let imgList = this.data.imgList;
    // let imgKeys = this.data.imgKeys;
    let keys = [];
    let that = this;
    imgList.forEach(item=>{
      keys.push(item.key);
      that.setData({
        imgKeys: keys
      })
    })
  },

  formSubmit: function (e) {
    if (this.data.btnForbidden) return
    console.log("按钮被点击")
    wx.showLoading({
      title: '信息提交中',
    })
    this.data.btnForbidden = true
    this.getImgKeys()
    if (this.data.imgKeys.length <= 0) {
      this.data.isShow = true
      wx.hideLoading()
      this.setData({
        isShow: true,
        valTips: "最少上传一张图片"
      })
      this.data.btnForbidden = false
      return
    }
    this.valDn()

  },
  ok() {
    this.setData({
      isShow: false
    });
    if (this.data.formInfoTrue) {
      wx.reLaunch({
        url: '../../pages/index/index',
      })
    }
  },
  // 校验
  valDn(){
    // tkList格式化  
    let outTankList = wx.getStorageSync("outTankList") ;
    let TranDetails = [];
    outTankList.forEach(item => {
      let trankItem = {
        "F_Id": "",
        "F_PackageId": "",
        "F_CodeNo": item,
        "F_PackageStatus": "",
        "F_TransId": ""
      }
      TranDetails.push(trankItem)
    })
    let DNInfo = wx.getStorageSync("OUTINFO")



    let tank = {
      "F_Id": "无需使用",
      "F_PackageQty": DNInfo.total,
      "F_DeliveryNumber": DNInfo.TKNUMBER,
      "F_InStockDate": "",
      "F_OpDate": "",
      "F_StartSite": wx.getStorageSync("outstartID"),
      "F_PackageStatus": "s",
      "F_OutStockDate": app.initTime(),
      "F_SysDate": "",
      "F_EndSite": wx.getStorageSync("outendID"),
      "F_OpUser": "",
      "F_SysUser": "",
      "F_TransType": "出库",
      "F_Attachment": "",
      "Attachments": this.data.imgKeys,
      "F_Memo": this.data.note,
      "TranDetails": TranDetails
    };
    LoginModules.validation(tank).then(res => {
      console.log("校验被调用出库",res)
      wx.hideLoading()
      this.data.btnForbidden = false
      if (res.StatusCode === "Error") {
        console.log(res)
        this.setData({
          valTips: res.Message,
          isShow: true

        })
      } else if (res.StatusCode === "Warn") {
        let that = this;
        wx.showModal({
          title: '温馨提示',
          content: res.Message,
          success(mod) {
            if (mod.confirm) {

              that.create(tank)
            } else if (mod.cancel) {
              console.log('用户点击取消')
            }
          }
        })

      }
      else {
        
        this.create(tank)
      }

    })
  },

  // 出库提交
  create(tank) {
    console.log(tank, "出库提交数据")

    LoginModules.createTran(tank).then(res => {
      wx.hideLoading()
      this.data.btnForbidden = false
     
      wx.removeStorageSync('outendID')
      wx.removeStorageSync('outstartID')
      wx.removeStorageSync('outTankList')
      this.setData({
        isShow: true,
        valTips: "数据提交成功",
        formInfoTrue: true

      })
   
     
    })
  },
  //提示框封装
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

  // 备注信息以及字数监听
  inputNote(e){
    let val = e.detail.value;
    let index = e.detail.value.length;
    let len = 150 - index;
    this.setData({
      note: val,
      fontMax: `您还可以输入${len}个字`
    })

   
},
  goBack() {
    wx.navigateBack({
    })
  },

  // 删除图片
  deleteImg(e) {
    // console.log(e)
    let index = e.currentTarget.dataset.key;
    if (e.target.id == "cuo") {
      this.showToast({
        msg: "是否删除"
      }).then(res => {
        this._removeList(index)
      })
    }
  },
  // 删除图片
  _removeList(index) {
    this.data.imgList.splice(index, 1)
    let imgPath = this.data.imgList;
    this.setData({
      imgList: imgPath
    })
  },
  
  // 字数提示框
  showTips() {
    this.setData({
      fontMaxFlag: true
    })
  },
  hideTips() {
    console.log(this.data.note)
    this.setData({
      fontMaxFlag: false
    })
  },
  onLoad:function(){
   
  }
 
})