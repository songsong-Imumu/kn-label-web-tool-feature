import React, { useState } from 'react';
import Modal from './modify-user';

const Modal2 = props => {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <span role="button" onClick={() => setVisible(true)}>
        {props.children || '修改角色'}
      </span>
      {visible && <Modal {...props} onCancel={() => setVisible(false)} />}
    </>
  );
};

export default React.memo(Modal2);
