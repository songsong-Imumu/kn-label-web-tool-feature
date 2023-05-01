import React from 'react';
import { Drawer, DrawerProps } from 'antd';
import { useControllableValue } from 'ahooks';

interface Props extends DrawerProps {
  trigger: React.ReactElement; // 触发器元素  打开抽屉
  children: React.ReactElement;
  beforeShow?: () => Promise<any>;
}

const UDrawer = (props: Props) => {
  const { trigger, callback, children, beforeShow, ...rest } = props;
  const [visible, setVisible] = useControllableValue(props, { valuePropName: 'visible' });
  const onClick = async () => {
    if (typeof beforeShow === 'function') {
      setVisible((await beforeShow()) ?? true);
      return;
    }
    setVisible(true);
  };
  const onClose = () => {
    callback && callback();
    setVisible(false);
  };
  return (
    <>
      <span className="u-modal-trigger" onClick={() => onClick()}>
        {trigger}
      </span>

      <Drawer visible={visible} zIndex={999} onClose={onClose} {...rest}>
        {children}
      </Drawer>
    </>
  );
};

export default UDrawer;
