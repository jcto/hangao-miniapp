const app = getApp();
import { loginModules } from "../../modules/login.js";
import { filterSite } from "../../modules/filterSite.js";
let LoginModules = new loginModules();
let startColumnsData;
let endPickData;
let endColumnsData;
Page({
  /**
   * 页面的初始数据
   */

  data: {
    navTitle: "",

    DocQty: "暂无",
    OutStockDate: "暂无",
    PackageQty: "暂无",

    DnNum: "", //dn号
    StartSite: "",
    dnTips: "",
    Tipsflag: false, //dn号提示语显示隐藏
    tkDn: "",
    total: 0, //桶数,
    totalflag: false,
    totalTips: "",

    addDnStartPlace: "",

    startPlaceTips: "点击选择仓库",
    endtPlaceTips: "点击选择仓库",

    showPopupFlag: false, //双向栏显示隐藏
    CityAndStorage: [],
    endPopupFlag: false,
  },

  onChange(event) {
    const { picker, value, index } = event.detail;
    picker.setColumnValues(1, startColumnsData[value[0]]);
    this.updateEndPickData()
  },

  goPrev() {
    wx.reLaunch({
      url: "./../../pages/index/index",
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCityAndStroage();

    //  获取始发地和目的地联动数据

    LoginModules.getInCity().then((res) => {
      this.initPickData(res);
    });
  },

  // todo

  goBack() {
    this.goPrev();
  },

  inputEnd() {
    //  && this.data.DnNum !== "000000"
    if (this.data.Tipsflag) {
      this.getStockInTran();
      wx.setStorageSync("inNumber", this.data.DnNum);
    }
  },
  changeDnNum(e) {
    this.checkDN(e.detail);
    // console.log(e.detail)
    this.data.DnNum = e.detail;
  },
  changeTotal(e) {
    console.log(e.detail, "inTotal"), (this.data.total = e.detail);
    this.checkTotal(e.detail);
  },

  totalInputEnd() {
    wx.setStorageSync("inTotal", this.data.total);
  },
  // 效验桶数
  checkTotal(total) {
    // console.log(Number(total))
    let barrelage = parseInt(total);
    if (isNaN(Number(total))) {
      this.setData({
        totalTips: "数量只能为数字",
        totalflag: false,
        total: barrelage,
      });
    } else if (parseInt(total) === 0) {
      this.setData({
        totalTips: "数量不能为零",
        totalflag: false,
        total: barrelage,
      });
    } else if (!total) {
      this.setData({
        totalTips: "数量不能为空",
        totalflag: false,
        total: barrelage,
      });
    } else {
      this.setData({
        totalTips: "",
        totalflag: true,
        total: barrelage,
      });
    }
  },

  // 增加起始站点和目的站点效验
  _checkDestination() {
    let instartID = wx.getStorageSync("instartID");
    let inendID = wx.getStorageSync("inendID");
    console.log(instartID, inendID, "_checkDestination");
    if (instartID == "" || inendID == "") {
      if (instartID == "") {
        wx.showToast({
          title: "起始站点不存在",
          icon: "none",
        });
      } else {
        wx.showToast({
          title: "目的站点不存在",
          icon: "none",
        });
      }
      return false;
    } else if (instartID === inendID) {
      wx.showToast({
        title: "起始站点和目的站点不能一致",
        icon: "none",
      });
      return false;
    } else {
      return true;
    }
  },

  // 单号效验
  checkDN(DN) {
    // console.log(DN, "DN")
    let arr1 = "";
    if (DN.length >= 3) {
      arr1 = DN.slice(0, 2);
      arr1 = parseInt(arr1);
    }

    let DNLIst = DN.split("");

    let DNLISTNAN = false;
    DNLIst.forEach((item) => {
      if (isNaN(Number(item))) {
        DNLISTNAN = true;
      }
    });

    if (!DN) {
      this.setData({
        dnTips: "DN号不能为空",
        Tipsflag: false,
      });
    } else if (DNLISTNAN) {
      this.setData({
        dnTips: "DN单号只能是数字",
        Tipsflag: false,
      });
    } else if (DN.length !== 10) {
      this.setData({
        dnTips: "DN单号必须为10位",
        Tipsflag: false,
      });
    } else if (
      arr1 !== 99 &&
      arr1 !== 88 &&
      arr1 !== 77 &&
      arr1 !== 66 &&
      arr1 !== 55 &&
      arr1 !== 44 &&
      arr1 !== 33 &&
      arr1 !== 22 &&
      arr1 !== 11
    ) {
      this.setData({
        dnTips: "DN单号必须为99-11开头",
        Tipsflag: false,
      });
    } else {
      this.setData({
        dnTips: "",
        Tipsflag: true,
      });
    }
  },
  // 扫码
  scan() {
    wx.scanCode({
      success: (res) => {
        this.setData({
          DnNum: res.result,
        });
        this.checkDN(res.result);

        if (this.data.Tipsflag) {
          this.getStockInTran();

          wx.setStorageSync("inNumber", this.data.DnNum);
        }
      },
      fail: (res) => {
        // console.log(res);
      },
    });
  },
  getStockInTran() {
    let dn = this.data.DnNum;
    LoginModules.getOutDn(dn, "入库")
      .then((res) => {
        this.setData({
          DocQty: res.DocQty,
          OutStockDate: res.OutStockDate,
          PackageQty: res.PackageQty,
          StartSite: res.StartSite,
          DnInfoFlag: true,
        });
        this.getStrageID(res.StartSite, "instartID", true);
      })
      .catch((err) => {
        this.setData({
          DocQty: "暂无",
          OutStockDate: "暂无",
          PackageQty: "暂无",
          StartSite: "",
          DnInfoFlag: false,
        });
      });
  },

  next() {
    // 为空判断
    if (!this.data.totalflag || !this.data.Tipsflag) {
      this.checkDN(this.data.DnNum);
      this.checkTotal(this.data.total);
      return;
    }
    // 检测起始地目的地
    let checkDestination = this._checkDestination();
    if (!checkDestination) return;
    // 防止dn单号未缓存
    let storagesDn = wx.getStorageSync("inNumber");
    if (!storagesDn) {
      wx.setStorageSync("inNumber", this.data.DnNum);
    }
    wx.navigateTo({
      url: "../storageList/index",
    });
  },

  //  请求以及格式化数据
  getCityAndStroage() {
    LoginModules.getCity().then((res) => {
      this.data.CityAndStorage = res;
      let city = this.classify(res);
      let cityStore = {};
      let AllDataArray = [];
      let itemArray = [];
      for (let i = 0; i < city.length; i++) {
        itemArray[i] = [];
        for (let k = 0; k < city[i].allData.length; k++) {
          itemArray[i].push(city[i].allData[k].SiteName);
          console.log(city[i].allData[k].SiteName);
        }
        cityStore[city[i].City] = itemArray[i];
      }
      // let columns = [
      //   {
      //     values: Object.keys(cityStore),
      //     className: "column1",
      //   },
      //   {
      //     values: cityStore["成都"],
      //     className: "column2",
      //     defaultIndex: 0,
      //   },
      // ];
      this.setData({
        cityStore,
        storeageIsOk: true,
      });
    });
  },

  // 起始地仓库唤醒
  showStorage() {
    this.setData({
      showPopupFlag: true,
    });
  },
  showendStorage() {
    this.setData({
      endPopupFlag: true,
    });
  },
  // 目的地确定下拉框
  onendConfirm(event) {
    const { picker, value, index } = event.detail;
    this.setData({
      endPopupFlag: false,
      endtPlaceTips: value,
    });

    console.log(`当前值：${value}, 当前索引：${index}`);
    this.getStrageID(value, "inendID");
  },
  onConfirm(event) {
    const { picker, value, index } = event.detail;
    this.setData({
      showPopupFlag: false,
      startPlaceTips: value,
    });

    this.getStrageID(value, "instartID");
    this.updateEndPickData()
  },

  // 获取仓库id值
  getStrageID(value, setStorageNAme, warehouseTrue = false) {
    let allStorgae = this.data.CityAndStorage;
    if (!warehouseTrue) {
      allStorgae.forEach((item) => {
        if (item.SiteName === value[1] && item.City === value[0]) {
          wx.setStorageSync(setStorageNAme, item.SiteId);
        }
      });
    } else {
      allStorgae.forEach((item) => {
        if (item.SiteName === value) {
          wx.setStorageSync(setStorageNAme, item.SiteId);
        }
      });
    }
  },

  onCancel(event) {
    this.updateEndPickData()
    this.setData({
      showPopupFlag: false,
      endPopupFlag: false,
    });

  },

  onClose() {
    this.setData({
      showPopupFlag: false,
      endPopupFlag: false,
    });
  },

  // 格式化城市数组
  classify(arr) {
    let c = [];
    let d = {};
    arr.forEach((element) => {
      if (!d[element.City]) {
        c.push({
          City: element.City,
          allData: [element],
        });
        d[element.City] = element;
      } else {
        c.forEach((ele) => {
          if (ele.City == element.City) {
            ele.allData.push(element);
          }
        });
      }
    });

    return c;
  },
// chn 初始化起始地选择
  initPickData(res) {
    const siteMap = filterSite(res);
    const startSite=siteMap.startSite;
    const citys=Object.keys(siteMap.startSite)
    startColumnsData=startSite
    endPickData=siteMap.endSite

    const columns = [
      {
        values: citys,
        className: "column1",
      },
      {
        values:citys[0]?startSite[citys[0]]:[],
        className: "column2",
        defaultIndex: 0,
      },
    ];
    this.setData({
      columns
    })
  },
  // 更新目的地 依据起始地选择进行联动更新
  updateEndPickData(){
    debugger;
    let startPlaceTips=this.data.startPlaceTips[1];
    // const endSite=endPickData[]
    if(startPlaceTips==='点击选择仓库'){
      return
    }

    endColumnsData= endPickData[startPlaceTips]
    const citys=Object.keys(endColumnsData)

    const endColumns=[
      {
        values: citys,
        className: "column1",
      },
      {
        values:citys[0]?endColumnsData[citys[0]]:[],
        className: "column2",
        defaultIndex: 0,
      },
    ];
    this.setData({
      endColumns
    })
  },
  onendChange(event){
    const { picker, value, index } = event.detail;
    picker.setColumnValues(1, endColumnsData[value[0]]);
  }
});
