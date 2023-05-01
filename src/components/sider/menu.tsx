import React, { useState, useEffect } from 'react';
import { Menu } from 'antd';
import { NavLink } from 'react-router-dom';
import MyIcon from '@/components/icon';
import { MenuType, MenuItemType } from '@/components/sider/interface';

import './index.less';

const { SubMenu } = Menu;
const defaultProps = {
  width: 200,
  theme: 'light',
  menuList: []
};
const MenuComponent = (props: MenuType) => {
  const { theme, menuList, roleType } = Object.assign({}, defaultProps, props);
  const [selectedKeys, setSelectedKeys] = useState<string[]>(props.defaultSelectedKeys);
  const getMenuEle = (menu: Array<MenuItemType>) =>
    menu
      .filter(item => item.auth?.includes(roleType))
      .map((item: MenuItemType) =>
        item.children && item.children.length ? (
          <SubMenu
            key={item.id}
            title={
              <>
                {item.icon && <MyIcon type={item.icon} />}
                <span>{item.name}</span>
              </>
            }
          >
            {getMenuEle(item.children)}
          </SubMenu>
        ) : (
          <Menu.Item key={item.id}>
            <NavLink to={item.link || ''}>
              <>
                {item.icon && <MyIcon type={item.icon} />}
                <span>{item.name}</span>
              </>
            </NavLink>
          </Menu.Item>
        )
      );
  const changeSelect = (item: any) => {
    setSelectedKeys([item.key]);
  };
  const changeOpenKeys = (tempOpenKeys: string[]) => {
    props.changeOpenKeys(tempOpenKeys);
  };

  useEffect(() => {
    setSelectedKeys(props.selectedKeys);
  }, [props.selectedKeys]);

  return (
    <Menu
      className="m-menu"
      theme={theme}
      mode="inline"
      openKeys={props.openKeys}
      selectedKeys={selectedKeys}
      defaultOpenKeys={props.defaultOpenKeys}
      defaultSelectedKeys={props.defaultSelectedKeys}
      onSelect={changeSelect}
      onOpenChange={changeOpenKeys}
    >
      {getMenuEle(menuList)}
    </Menu>
  );
};

export default React.memo(MenuComponent);
