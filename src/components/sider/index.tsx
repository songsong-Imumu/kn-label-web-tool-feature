import React, { useEffect, useState } from 'react';
import { Layout } from 'antd';
import { useLocation } from 'react-router-dom';
import MENU_MAP from './config';
import Menu from './menu';
import { MenuItemType, SiderProps } from './interface';
import './index.less';

const { Sider } = Layout;

const SiderCustom = (props: SiderProps) => {
  const [selectKeys, setSelectKeys] = useState<string[]>([]);
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [firstHide, setFirstHide] = useState<boolean>(false);
  const [expandKeys, setExpandKeys] = useState<string[]>([]);
  const { pathname } = useLocation();
  const roleType = localStorage.getItem('roleType');

  const treeToArray = tree => {
    let res = [];
    for (const item of tree) {
      const { children, ...i } = item;
      if (children && children.length) {
        res = res.concat(treeToArray(children));
      }
      res.push(i);
    }
    return res;
  };
  const findCurrentMenu: (url: string, data: MenuItemType[]) => MenuItemType | undefined = (url, data) => {
    // const menuMap = data.slice();
    // data.forEach(item => {
    //   if (item.children && item.children.length) {
    //     Array.prototype.push.apply(menuMap, item.children);
    //   }
    // });
    // const pathSnippets = pathname.split('/').filter(i => i);
    // debugger;
    // let keyUrl = '';
    // menuMap.forEach(item => {
    //   for (let i = pathSnippets.length; i > 0; i--) {
    //     if (item.link === `/${pathSnippets.slice(0, i).join('/')}`) {
    //       if (item.link.length > keyUrl.length) {
    //         keyUrl = item.link;
    //       }
    //     }
    //   }
    // });
    return treeToArray(data).find(item => item.link === url);
  };

  // 根据当前的路由确定选中节点和展开节点
  const currentStatus = () => {
    let currentPathName = pathname;
    const currentMenuItem = findCurrentMenu(currentPathName, MENU_MAP);
    if (currentMenuItem) {
      setSelectKeys([`${currentMenuItem.id}`]);
      // currentMenuItem.parentId && setExpandKeys([`${currentMenuItem.parentId}`]);
    }
  };
  const handleCollapse = (coll, type) => {
    setCollapsed(!collapsed);
    setFirstHide(!collapsed);
    props.setCollapsed(!collapsed);
    coll && setExpandKeys([]);
  };

  const changeOpenKeys = (tempOpenKeys: string[]) => {
    setFirstHide(false);
    setExpandKeys(tempOpenKeys);
  };
  useEffect(() => {
    currentStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);
  return (
    <Sider collapsible collapsedWidth={60} collapsed={collapsed} onCollapse={handleCollapse} theme="light" width={176} className="g-sider">
      <Menu
        menuList={MENU_MAP}
        roleType={Number(roleType || 1)}
        defaultOpenKeys={expandKeys}
        openKeys={expandKeys}
        selectedKeys={selectKeys}
        defaultSelectedKeys={selectKeys}
        firstHide={firstHide}
        setFirstHide={(params: any) => setFirstHide(params)}
        changeOpenKeys={changeOpenKeys}
      />
    </Sider>
  );
};

export default SiderCustom;
