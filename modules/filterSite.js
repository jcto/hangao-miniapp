// const obj = {
//   startSite: {
//     上海: ["上海-神龙", "上海-大庆"],
//     北京: ["北京-国安", "北京-神威"],
//   },
//   endSite: {
//     "上海-神龙": { 北京: ["北京-国安"] },
//   },
// };
function inArray(arr,val){
    return arr.includes(val)
}
export function filterSite(res) {
  const rst = {
    //   里面是城市名及地点
    startSite: {},
    // 里面是起始地联动对应的目的地
    endSite: {},
  };
  for (let i = 0; i < res.length; i++) {
    const startSiteName = res[i]["StartSiteName"];
    const endSiteName = res[i]["EndSiteName"];
    const city = startSiteName.split("-")[0];
    const endCity = endSiteName.split("-")[0];

    if (!rst.startSite[city]) {
      rst.startSite[city] = [startSiteName];
    } else {
        if(!inArray(rst.startSite[city],startSiteName)){
            rst.startSite[city].push(startSiteName);
        }
    }

    if (!rst.endSite[startSiteName]) {
      rst.endSite[startSiteName] = {};

      rst.endSite[startSiteName][endCity] = [endSiteName];
    } else {
      if (!rst.endSite[startSiteName][endCity]) {
        rst.endSite[startSiteName][endCity] = [endSiteName];
      } else {
          if(!inArray(rst.endSite[startSiteName][endCity],endSiteName)){
            rst.endSite[startSiteName][endCity].push(endSiteName);
          }
      }
    }
  }
  return rst;
}

export function getColumns(siteObj) {
  const siteNameStrArr = Object.keys(siteObj);
  for (let i = 0; i < siteNameStrArr.length; i++) {}
}

export function mapSite(res) {
  const startSiteMap = filterSite(res);
  const startSiteNameArr = Object.keys(startSiteMap);
}
