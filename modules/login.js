import{HTTP} from "../utils/request.js"

class loginModules extends HTTP {
  // 登录/注册
  register(data){
    const registerInfo = this.request({
      url:"/token",
      Authorization:"Basic MTIzNDo1Njc4",
      data
    })
    return registerInfo
  };
  // 获取用户信息
  getUserInfo(){
   const UserInfo = this.request({
     url: "/MyUser/GetUserInfo",
     method:"GET"
   })
    return UserInfo
  };
  // 02.RefreshToken刷新Token
  RefreshToken() {
    const InStockFlows = this.request({
      url: "/token",
      method: "GET",
      Authorization: "Basic MTIzNDo1Njc4",
      data:{
        "grant_type":"refresh_token",
        "refresh_token":"ca7b0c5fc29f435e8a08530471f88d9d"
      }
    })
    return InStockFlows
  };

  // 05.获取流转列表(入库)
  getInStockFlows(){
    const InStockFlows = this.request({
      url: "/Site/GetInStockFlows",
      method: "GET",
    })
    return InStockFlows
  };
  // 获取出库06.	GetOutStockFlows 获取出库流转列表
  getOutStockFlows(){
    const outStockFlows = this.request({
      url:"/Site/GetOutStockFlows",
      method:"GET",
    })
    return outStockFlows
  }

// 创建出入库
  createTran(data){
    const createTran = this.request({
      url:"/Track/CreateTran",
      data,
      type:"application/json"
    })
    return createTran
  }
  //  获取出库DN单相关数据 ,
  getOutDn(deliveryNumber, type ="出库"){
    const outDn = this.request({
      url:"/Track/GetStockOutTran",
      data:{
        "DeliveryNumber":deliveryNumber,
        "TransType": type
      }
    })
    return outDn
  }

  // 初始入库
  initPackage(data){
    const initData = this.request({
      url:"/Track/Initial",
      data,
      type: "application/json"
    })
    return initData
  }

  // 获取城市已经对应的仓库
  getCity(){
    const City = this.request({
      url:"/Site/GetSites",
      method: "GET",
    })
    return City
  }
  
  // 出入库效验
  validation(data){
    const val = this.request({
      url:"/Track/Validation",
      data,
      tips:true,
      type: "application/json"
    })

    return val
  }
  // /获取出入库记录
  getRecode(data){
    const recode = this.request({
      url: "/Track/GetTransite",
      type: "application/json",
      data
    })
    return recode
  }
  //获取库存数量
  getStockQty(data){
    const StockQty = this.request({
      url:"/Track/GetStockQty",
      data,
      type: "application/json"
    })
    return StockQty
  }
  // 盘点
  getCheck(data){
    const check = this.request({
      url:"/Track/StockTaking",
      type: "application/json",
      data
    })
    return check
  }
  // 获取历史订单详情

  getDetail(data){
    const detail = this.request({
      url:"/Track/GetTransiteDetail",
      type: "application/json",
      data
    })
    return detail
  }
  // 个人中心修改密码
  changePassword(data){
    const password = this.request({
      url: "/MyUser/ChangePassword",
      type: "application/json",
      data
    })
    return password
  }
  
  // 结束盘点
  endCheck(){
    const endC = this.request({
      url:"/Track/EndOfStock",
      type: "application/json",
      method: "GET",
      tips:true
    })
    return endC
  }
  // 在途
  GetTransitReport(StartSite,EndSite) {
    const GetTransitReportList = this.request({
      url: "/Report/GetTransitReport",
      method: "post",
      data:{
        StartSite: StartSite,
        EndSite: EndSite
      },
    })
    return GetTransitReportList
  }
  // 在库
  GetStockReport(SiteId) {
    const GetStockReportList = this.request({
      url: "/Report/GetStockReport",
      method: "post",
      data: {
        SiteId: SiteId
      },
    })
    return GetStockReportList
  }
  

}


export {
  loginModules
}