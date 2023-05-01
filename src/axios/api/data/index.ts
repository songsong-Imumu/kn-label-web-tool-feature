import { get, put, post, del } from '../../http';

// 后端登录接口
export const casLogin = (data: any) => post({ url: '/login', data }); // 登录接口
export const casLogout = (data?: any) => post({ url: '/logout', data }); // 退出登录
export const getUserInfo = (data?: any) => get({ url: '/userInfo', data }); // 获取用户信息
export const getUserList = (data?: any) => get({ url: '/user/', data }); // 获取用户列表
export const putUser = (data?: any) => put({ url: '/user/', data }); // 修改用户角色

// 数据
export const getFileData = (data: any) => get({ url: '/fileInfo/', data }); // 获取文件接口
export const getFileById = (data: any) => get({ url: '/fileInfo/' + data }); // 获取文件详情
export const getFileContent = (data: any) => get({ url: '/fileInfo/' + data.type + '/' + data.id }); // 获取文件详情
export const delFile = (data: any) => del({ url: '/fileInfo/' + data }); // 删除文件
export const addFromFile = (data: any) => post({ url: '/text/addFromFile/' + data }); // 添加文件到文本数据
export const fileUpload = (data: any) => post({ url: '/fileInfo/add', data }); // 文件上传
export const tripleAdd = (data: any) => post({ url: '/triple/add', data }); // 导入三元组
export const equipmentAdd = (data: any) => post({ url: '/equipment/add', data }); // 导入设备树
export const updateFileName = (data: any) => put({ url: '/fileInfo/updateName', data }); // 文件更新
export const updateFileContent = (data: any) => put({ url: '/fileInfo/updateContent', data }); // 文件内容更新
export const manualImport = (data: any) => post({ url: '/fileInfo/manualImport', data }); // 人工导入

export const getTripleTreeData = (data: any) => get({ url: '/triple/tree', data }); // 树
export const getTripleSearchData = (data: any) => get({ url: '/triple/search', data }); // 故障搜索

// 设备树
export const getEquipmentTreeData = (data: any) => get({ url: '/equipment/tree', data }); // 获取设备树结构
export const getEquipmentSubTreeData = (data: any) => get({ url: '/equipment/subTree', data }); // 获取子树
export const getEquipmentSubData = (data: any) => get({ url: '/equipment/sub', data }); // 级联使用 pid
export const getEquipmentAutoComplete = (data: any) => get({ url: '/equipment/autoComplete?keyword=' + data }); // 获取设备搜索自动补齐
export const postEquipmentAdd = (data: any) => post({ url: '/equipment/tree/add', data }); // 添加树节点
export const delEquipmentById = (data: any) => del({ url: '/equipment/tree/delete/' + data }); // 删除子树
export const exportEquipmentByparentId = (parentId: any) => get({ url: '/equipment/export/' + parentId }); // 删除子树
export const getRegulationById = (id: any) => get({ url: '/regulation/' + id }); // 获取规程详情
export const getRegulationPath = (id: any) => get({ url: '/regulation/path/' + id }); // 获取规程路径
export const getEquipmentPath = (id: any) => get({ url: '/equipment/path/' + id }); // 获取设备路径
export const postRegulation = (data: any) => post({ url: '/regulation/add', data }); // 专家入库
export const addToTree = (fileId: any) => post({ url: '/triple/addToTree/' + fileId }); // 添加到图谱
export const markTree = (fileId: any) => post({ url: '/equipment/markTree/' + fileId }); // 添加到设备树
export const deleteTree = () => del({ url: '/equipment/deleteTree' }); // 删除构建图谱 + 设备树
