
const roleMap= {
    // 管理员 客户 承运商 工厂
    // 入库
    Inbound: ['管理员', '承运商', '工厂'],
    // 出库
    Outbound: ['管理员', '承运商', '工厂'],
    // 初始入库
    Initial: ['管理员', '承运商', '工厂'],
    // 货物盘点
    Count: ['管理员', '承运商', '工厂'],
    // 跟踪报表
    Tracking: ['管理员'],
    // 历史运单
    History: ['管理员', '承运商', '工厂'],
    // 扫码桶重
    ScanQR: ['管理员', '客户', '工厂']
}
export default roleMap

export function checkRole(name,role) {
    return (roleMap[name] || []).indexOf(role) > -1
}