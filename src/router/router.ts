import Loadable from 'react-loadable';
import MyLoadingComponent from '@/components/common/u-loading';

const load = (loader: any) =>
  Loadable({
    loader: loader,
    loading: MyLoadingComponent
  });

export const urlObj = {
  HighSearch: {
    name: '智能检索',
    link: '/app/high/search',
    component: load(() => import('@/view/use-page/search/index')),
    auth: [1, 2, 3]
  },

  HighFault: {
    name: '故障查询',
    link: '/app/high/fault',
    component: load(() => import('@/view/use-page/fault/index')),
    auth: [1, 2, 3]
  },

  HighExpert: {
    name: '智能检索',
    link: '/app/high/expert',
    component: load(() => import('@/view/use-page/expert/index')),
    auth: [1, 2, 3]
  },

  mng: {
    name: '管理',
    link: '/app/graph/mng/:type',
    component: load(() => import('@/view/dic-page')),
    auth: [1, 2]
  },

  Text: {
    name: '语料',
    link: '/app/graph/text/:type',
    component: load(() => import('@/view/text-page')),
    auth: [1, 2]
  },

  Tool: {
    name: '实体抽取',
    link: '/app/graph/tool/:type',
    component: load(() => import('@/view/tool-page')),
    auth: [1, 2]
  },

  OriginData: {
    name: '原始数据',
    link: '/app/data/origin',
    component: load(() => import('@/view/data-page/origin-data')),
    auth: [1, 2]
  },

  TextData: {
    name: '文本数据',
    link: '/app/data/text',
    component: load(() => import('@/view/data-page/text-data')),
    auth: [1, 2]
  },
  EntityData: {
    name: '实体数据',
    link: '/app/data/entity',
    component: load(() => import('@/view/data-page/entity-data')),
    auth: [1, 2]
  },
  TripleData: {
    name: '关系数据',
    link: '/app/data/triple',
    component: load(() => import('@/view/data-page/triple-data')),
    auth: [1, 2]
  },
  DeviceData: {
    name: '设备树数据',
    link: '/app/data/device',
    component: load(() => import('@/view/data-page/device-data')),
    auth: [1, 2]
  },

  DeviceTree: {
    name: '设备树数据',
    link: '/app/device/tree',
    component: load(() => import('@/view/data-page/device-tree')),
    auth: [1, 2]
  },

  GraphPage: {
    name: '图谱',
    link: '/app/graph/page',
    component: load(() => import('@/view/use-page/graph-page')),
    auth: [1, 2]
  },

  GraphRelation: {
    name: '关系图谱',
    link: '/app/graph/relation',
    component: load(() => import('@/view/data-page/add-tree-data')),
    auth: [1, 2]
  },

  Login: {
    name: '登录',
    link: '/caslogin',
    component: load(() => import('@/view/cas-login')),
    auth: [1, 2, 3]
  },

  Auth: {
    name: '权限管理',
    link: '/app/auth',
    component: load(() => import('@/view/auth')),
    auth: [1, 2]
  }
};

const {
  mng,
  Text,
  Tool,
  Login,
  OriginData,
  TextData,
  EntityData,
  TripleData,
  DeviceData,
  GraphPage,
  HighSearch,
  HighFault,
  HighExpert,
  DeviceTree,
  GraphRelation,
  Auth
} = urlObj;

export const routes = [
  mng,
  Text,
  Tool,
  OriginData,
  TextData,
  EntityData,
  TripleData,
  DeviceData,
  GraphPage,
  HighSearch,
  HighFault,
  HighExpert,
  DeviceTree,
  GraphRelation,
  Login,
  Auth
];
