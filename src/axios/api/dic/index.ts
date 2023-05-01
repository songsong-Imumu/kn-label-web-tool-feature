import { get, put, post, del } from '../../http';

// 字典接口
export const getDicAll = (data: any) => get({ url: '/dict/', data }); // 获取字典列表
export const getActiveDic = (data: any) => get({ url: '/dict/marking', data }); // 获取正在标注的字典
export const postDic = (data: any) => post({ url: '/dict/', data }); // 插入字典词条
export const updateDic = (data: any) => put({ url: '/dict/', data }); // 更新字典
export const delDic = (data: any) => del({ url: '/dict/' + data.id, data }); // 删除字典

// 字典数据
export const getDicByKey = (data: any) => get({ url: '/dictData/dict/' + data.dictId, data }); // 查询单条字典信息
export const postDictData = (data: any) => post({ url: '/dictData/', data }); // 插入字典数据
export const putDictData = (data: any) => put({ url: '/dictData/', data }); // 插入字典数据
export const delDictData = (data: any) => del({ url: '/dictData/' + data.id, data }); // 删除字典数据
