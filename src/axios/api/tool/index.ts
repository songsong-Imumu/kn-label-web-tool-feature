import { get, put, post, del } from '../../http';

// 获取状态
export const getToolState = (data: any) => get({ url: '/textCluster/status', data }); // 聚类并向量化

// 工具管理
export const setClusterAndVector = (data: any) => post({ url: '/textCluster/clusterAndVector?textType=' + data.textType, data }); // 聚类并向量化
export const getPreSample = (data: any) => get({ url: '/textCluster/preSample', data }); // 聚类并向量化
export const getModelSample = (data: any) => get({ url: '/textCluster/modelSample', data }); // 聚类并向量化
export const getSampleData = (data: any) => get({ url: '/textData/sampleData', data });
export const postTrainModel = (data: any) => post({ url: '/textCluster/trainModel?textType=' + data.textType, data });
export const getCurrentRate = (data: any) => get({ url: '/textCluster/rate', data });
export const getHistoryRates = (data: any) => get({ url: '/textCluster/rates', data });
export const postModelMark = (data: any) => post({ url: '/textCluster/modelMark?textType=' + data.textType, data });

// 打标
export const getTextLabelCount = (data: any) => get({ url: '/textLabel/count', data });
export const getTextLabelOne = (data: any) => get({ url: '/textLabel/takeOne', data });
export const getTextLabel = (data: any) => get({ url: '/textData/' + data.id + '?textType=' + data.textType });
export const getTextLabelNextOne = (data: any) => get({ url: '/textLabel/takeNextOne', data });
export const getTextLabelPreOne = (data: any) => get({ url: '/textLabel/takePreOne', data });
export const getTextLabelResult = (data: any) => get({ url: '/textLabel/textData/' + data.id, data }); // 实体打标结果
export const postTextLabel = (data: any) => post({ url: '/textLabel/?textType=' + data.textType, data }); // 实体打标
export const postRelationCheckTextLabel = (data: any) => post({ url: `/textLabel/check/${data.id}?textType=` + data.textType }); // 矫正接口
export const getRelationsTextLabelResult = (data: any) => get({ url: `/textLabel/relation/${data.id}?textType=` + data.textType }); // 关系打标结果
export const delTextLabel = (data: any) => del({ url: '/textLabel/' + data.id + '?textType=' + data.textType });

// 视图
export const getScatter = (data: any) => get({ url: '/textCluster/scatter', data });
export const getWordCloudByClusterId = (data: any) => get({ url: '/textCluster/wordCloud/' + data.clusterId, data });

// 标签管理
export const getLabelList = (data: any) => get({ url: '/label/all', data });
export const updateLabel = (data: any) => put({ url: '/label', data });
export const postLabel = (data: any) => post({ url: '/label/add', data }); // 增加label

export const resetCurrent = data => post({ url: '/textCluster/resetTask?textType=' + data });
export const resetAll = data => post({ url: '/textCluster/resetProject?textType=' + data });
