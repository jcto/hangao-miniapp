import {
  loginModules
} from "../../modules/login.js";
let LoginModules = new loginModules();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navItem: 0, //控制导航栏高亮
    tips: "数据加载中",
    allHistry: [], //所有记录,
    startPlaceTips: "请选择",
    endtPlaceTips: "请选择",
    nowPlaceTips: "请选择",
    showPopupFlag: false, //双向栏显示隐藏
    endPopupFlag: false,
    nowPopupFlag: false, //当前站点
    OverTimeQty: 0, //超期tank数
    TransitQty: 0, //在途tank数
    EmptyQty: 0, //空桶数
    FullQty: 0, //满桶数
    TotalQty: 0, //合计数
    scrollTop: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let SiteId = '';
    let StartSite = '';
    let EndSite = '';

    this.GetTransitReport(StartSite, EndSite);
    this.GetStockReport(SiteId);

    // this.getRecode();
    this.getCityAndStroage()
  },
  goPrev() {
    wx.reLaunch({
      url: '../index/index',
    })
  },
  toDetail(e) {
    wx.showLoading({
      title: '加载中',
      mask: true,

    })
    let detail = JSON.stringify(e.currentTarget.dataset.detail);

    wx.navigateTo({
      url: `./../waybill/index?item=${detail}`,
    })
  },
  // 点击导航高亮
  chosenNavItem(evnet) {
    let key = parseInt(evnet.currentTarget.dataset.key);
    this.setData({
      navItem: key,
      scrollTop: 0
    })
    console.log(wx.pageScrollTo)
  },
  //  请求以及格式化数据
  getCityAndStroage() {
    LoginModules.getCity().then(res => {
      this.data.CityAndStorage = res
      let city = this.classify(res);
      city.unshift({ City: "全部", allData: [{ SiteId: "", SiteName: "全部", SiteType:"null"}]})
      console.log(city)
      let cityStore = {}
      let AllDataArray = []
      let itemArray = [];
      for (let i = 0; i < city.length; i++) {
        itemArray[i] = []
        for (let k = 0; k < city[i].allData.length; k++) {
          itemArray[i].push(city[i].allData[k].SiteName)
        }
        cityStore[city[i].City] = itemArray[i]
      }
      let columns = [{
          values: Object.keys(cityStore),
          className: 'column1'
        },
        {
          values: cityStore['全部'],
          className: 'column2',
          defaultIndex: 0
        }
      ]
      this.setData({
        columns,
        cityStore,
        storeageIsOk: true,
      })
    })
  },

  //在途
  GetTransitReport(StartSite, EndSite) {
    LoginModules.GetTransitReport(StartSite, EndSite).then(res => {
      let outList = [];
      this.setData({
        outList: res.Sites,
        tips: '',
        TransitQty: res.TransitQty,
        OverTimeQty: res.OverTimeQty
      })
      wx.hideLoading()
    }, reject => {
      if (reject.statusCode == 404) {
        this.setData({
          tips: "未找到数据"
        })
      }
      wx.hideLoading()
    })
  },
  //在库
  GetStockReport(SiteId) {
    LoginModules.GetStockReport(SiteId).then(res => {
      let inList = [];
      console.log(res)
      this.setData({
        inList: res.Sites,
        tips: '',
        TotalQty: res.TotalQty,
        EmptyQty: res.EmptyQty,
        FullQty: res.FullQty
      })
      wx.hideLoading()
    }, reject => {
      if (reject.statusCode == 404) {
        this.setData({
          tips: "未找到数据"
        })
      }
      wx.hideLoading()
    })
  },
  // 起始地仓库唤醒
  showStorage() {
    this.setData({
      showPopupFlag: true
    })
  },
  showendStorage() {
    this.setData({
      endPopupFlag: true
    })
  },
  showNowplace() {
    this.setData({
      nowPopupFlag: true
    })
  },
  // 目的地确定下拉框
  onendConfirm(event) {
    const {
      picker,
      value,
      index
    } = event.detail;
    this.setData({
      endPopupFlag: false,
      endtPlaceTips: value
    })
    this.getStrageID(value, "inendID")
  },
  onConfirm(event) {
    const {
      picker,
      value,
      index
    } = event.detail;
    this.setData({
      showPopupFlag: false,
      startPlaceTips: value
    })
    this.getStrageID(value, "instartID")
  },
  onNowConfirm(event) {
    const {
      picker,
      value,
      index
    } = event.detail;
    this.setData({
      nowPopupFlag: false,
      nowPlaceTips: value
    })
    this.getStrageID(value, "inNowID")
  },
  onCancel(event) {
    this.setData({
      showPopupFlag: false,
      endPopupFlag: false,
      nowPopupFlag: false
    })

  },
  onClose() {
    this.setData({
      showPopupFlag: false,
      endPopupFlag: false,
      nowPopupFlag: false
    })
  },
  // 城市数据未请求完成
  _cityDataNoDone() {
    if (!this.data.cityData) {
      return false
    }
    return true
  },
  // 获取仓库id值
  getStrageID(value, setStorageNAme, warehouseTrue = false) {
    let allStorgae = this.data.CityAndStorage;
    if (!warehouseTrue) {

      allStorgae.forEach(item => {
        if (item.SiteName === value[1] && item.City === value[0]) {
          wx.setStorageSync(setStorageNAme, item.SiteId);
          
        }
      })
    } else {
      allStorgae.forEach(item => {
        if (item.SiteName === value) {
          wx.setStorageSync(setStorageNAme, item.SiteId);
        }
      })
    }
    let NowSiteId = wx.getStorageSync('inNowID') || '';
    let inendID = wx.getStorageSync('inendID') || '';
    let instartID = wx.getStorageSync('instartID') || '';
    if (setStorageNAme === 'inNowID') {
      if (value[0]==="全部"){
        NowSiteId = ""
      }
      this.GetStockReport(NowSiteId);
    }
    if (setStorageNAme === 'inendID') {
      if (value[0] === "全部") {
        inendID = ""
      }
      this.GetTransitReport(instartID, inendID)
    }
    if (setStorageNAme === 'instartID') {
      if (value[0] === "全部") {
        instartID = ""
      }
      this.GetTransitReport(instartID, inendID)
    }

  },
  // searchInList() {
  //   let NowSiteId = wx.getStorageSync('inNowID');
  //   this.GetStockReport(NowSiteId);
  // },
  // searchOutList() {
  //   let inendID = wx.getStorageSync('inendID');
  //   let instartID = wx.getStorageSync('instartID');
  //   this.GetTransitReport(instartID, inendID)
  // },
  // 格式化城市数组
  classify(arr) {
    let c = [];
    let d = {};
    arr.forEach(element => {
      if (!d[element.City]) {
        c.push({
          City: element.City,
          allData: [element]
        });
        d[element.City] = element;

      } else {
        c.forEach(ele => {
          if (ele.City == element.City) {
            ele.allData.push(element);
          }
        });
      }

    });

    return c;
  },
  onChange(event) {
    const {
      picker,
      value,
      index
    } = event.detail;
    picker.setColumnValues(1, this.data.cityStore[value[0]]);
  },


})