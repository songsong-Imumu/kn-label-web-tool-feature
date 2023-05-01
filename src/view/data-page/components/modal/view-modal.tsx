import React, { useState } from 'react';
import { Button, Input } from 'antd';
import Modal from '@/components/common/u-modal';
import IconSet from '@/components/icon';
import { getFileById, getFileContent } from '@/axios';
import { debounce } from '@/utils/tools';

const tagStyle = {
  background: '#F1F1F1',
  color: '#333',
  padding: '2px 6px',
  borderRadius: '4px'
};

export default function ViewModal(props) {
  const { id, type } = props;
  const [content, setContent] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [list, setList] = useState([]);

  const beforeShow = () => {
    if (type === 'txt') {
      return getFileById(id).then(res => {
        setContent(res.content);
      });
    }

    return getFileContent({ id, type }).then(res => {
      setList(res);
    });
  };

  return (
    <Modal
      footer={null}
      width={800}
      title="查看详情"
      beforeShow={beforeShow}
      render={onCancel => {
        return (
          <>
            <div style={{ maxHeight: '480px', overflowY: 'scroll', whiteSpace: 'pre-wrap' }}>
              {type === 'txt' && content}
              {type === 'entity' && list.map(item => <p key={item.id} dangerouslySetInnerHTML={{ __html: item.textMark }} />)}
              {type === 'relation' && (
                <div>
                  <Input.Search placeholder="查询" onChange={v => debounce(setSearchValue(v.target.value), 300)} style={{ marginBottom: '6px' }} />
                  {list
                    .filter(item => item?.textMark?.includes(searchValue))
                    .map(item => (
                      <div key={item.id} style={{ background: '#F5f5f5', padding: '12px', marginBottom: '6px' }}>
                        <p dangerouslySetInnerHTML={{ __html: item.textMark }} />
                        <code>
                          {item?.textTags?.map(i => (
                            <div style={{ marginBottom: '12px', lineHeight: '24px' }}>
                              <span style={tagStyle}>{i.headEntity}</span> -
                              <span style={{ margin: '12px', textDecoration: 'underline' }}>{i.relation}</span>-{' '}
                              <span style={tagStyle}>{i.tailEntity}</span>
                            </div>
                          ))}
                        </code>
                      </div>
                    ))}
                </div>
              )}
              {type === 'equipment' &&
                list.map(item => (
                  <p key={item.code}>
                    滨海电厂- 类型: {item.type} ； 设备编码：{item.equipmentTypeCode}； 资产编码：{item.code}
                  </p>
                ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: 12 }}>
              <Button type="primary" onClick={() => onCancel()}>
                我知道了
              </Button>
            </div>
          </>
        );
      }}
      triggerDom={
        <a>
          <IconSet type="icon-yulan-dakai" /> 查看
        </a>
      }
    />
  );
}
