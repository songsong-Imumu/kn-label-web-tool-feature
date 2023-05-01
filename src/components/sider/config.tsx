import { MenuItemType } from './interface';

const MENU_MAP: MenuItemType[] = [
  {
    id: 7,
    name: '高级应用',
    link: '/app/high',
    icon: 'icon-shiti',
    auth: [1, 2, 3],
    children: [
      {
        id: 70,
        parentId: 7,
        name: '智能检索',
        link: '/app/high/search',
        auth: [1, 2, 3]
      },
      {
        id: 71,
        auth: [1, 2, 3],
        parentId: 7,
        name: '故障查询',
        link: '/app/high/fault'
      },
      {
        id: 72,
        auth: [1, 2, 3],
        parentId: 7,
        name: '专家知识入库',
        link: '/app/high/expert'
      }
    ]
  },

  {
    id: 6,
    name: '图谱构建',
    auth: [1, 2],
    link: '/app/graph',
    icon: 'icon-shujuzidian',
    children: [
      {
        id: 60,
        auth: [1, 2],
        parentId: 6,
        name: '实体抽取',
        link: '/app/graph/mng',
        children: [
          {
            id: 600,
            auth: [1, 2],
            parentId: 60,
            name: '实体字典',
            link: '/app/graph/mng/dic'
          },
          {
            id: 601,
            auth: [1, 2],
            parentId: 60,
            name: '实体语料',
            link: '/app/graph/text/dic'
          },
          {
            id: 602,
            auth: [1, 2],
            parentId: 60,
            name: '实体发现',
            link: '/app/graph/tool/dic'
          }
        ]
      },
      {
        id: 61,
        auth: [1, 2],
        name: '关系抽取',
        parentId: 6,
        link: '/app/graph/text',
        children: [
          {
            id: 610,
            auth: [1, 2],
            name: '关系字典',
            parentId: 61,
            link: '/app/graph/mng/rel'
          },
          {
            id: 611,
            auth: [1, 2],
            parentId: 61,
            name: '关系语料',
            link: '/app/graph/text/rel'
          },
          {
            id: 612,
            auth: [1, 2],
            parentId: 61,
            name: '关系发现',
            link: '/app/graph/tool/rel'
          }
        ]
      },
      {
        id: 63,
        auth: [1, 2],
        name: '设备树',
        parentId: 6,
        link: '/app/device',
        children: [
          {
            id: 631,
            auth: [1, 2],
            name: '构建',
            parentId: 63,
            link: '/app/graph/relation?type=EQUIPMENT'
          },
          {
            id: 630,
            auth: [1, 2],
            name: '预览',
            parentId: 63,
            link: '/app/device/tree'
          }
        ]
      },
      {
        id: 64,
        auth: [1, 2],
        name: '图谱',
        parentId: 6,
        link: '/app/graph',
        children: [
          {
            id: 641,
            auth: [1, 2],
            name: '构建',
            parentId: 64,
            link: '/app/graph/relation?type=RELATION_CORPUS'
          },
          {
            id: 640,
            auth: [1, 2],
            name: '预览',
            parentId: 64,
            link: '/app/graph/page'
          }
        ]
      }
    ]
  },
  {
    id: 5,
    auth: [1, 2],
    name: '文件管理',
    link: '/app/data',
    // icon: 'icon-shiti',
    icon: 'icon-yuliao',
    children: [
      {
        id: 50,
        auth: [1, 2],
        parentId: 5,
        name: '原始数据',
        link: '/app/data/origin'
      },
      {
        id: 51,
        auth: [1, 2],
        parentId: 5,
        name: '文本数据',
        link: '/app/data/text'
      },
      {
        id: 52,
        auth: [1, 2],
        parentId: 5,
        name: '实体数据',
        link: '/app/data/entity'
      },
      {
        id: 53,
        auth: [1, 2],
        parentId: 5,
        name: '关系数据',
        link: '/app/data/triple'
      },
      {
        id: 54,
        auth: [1, 2],
        parentId: 5,
        name: '设备树数据',
        link: '/app/data/device'
      }
    ]
  },
  {
    id: 8,
    auth: [1, 2],
    name: '权限管理',
    link: '/app/auth',
    icon: 'icon-shiti'
  }
];

export default MENU_MAP;
