import React, { useEffect, useState, useCallback, useRef, useContext } from 'react';
import { Button, Card, message, Tag, Alert, Progress } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { GlobalContext } from '@/context';
import IconSet from '@/components/icon';
import useFetch from '@/hooks/common/useFetch';
import DicTable from '@/view/dic-page';
import Relation from './relation';
import {
  getTextLabelCount,
  getTextLabelPreOne,
  getTextLabelNextOne,
  getTextLabelResult,
  getRelationsTextLabelResult,
  postTextLabel,
  postRelationCheckTextLabel,
  delTextLabel,
  getTextLabel, // 获取当前打标详情
  getHistoryRates
} from '@/axios';
import './index.less';

/**
 *
 * @returns 打标页面
 */
export default function HandleTag(props) {
  const { textType } = props;
  const { refreshState } = useContext(GlobalContext);
  const [userText, setUserText] = useState<string>('');
  const [entityKey, setEntityKey] = useState(0);
  const [userKey, setUserKey] = useState<string>('');
  const [textLabeOne, setTextLableOne] = useState();
  const [selectEntity, setSelectEntity] = useState({});
  const keycodeRef = useRef<string>();
  const { data: historyRateData = [] } = useFetch(getHistoryRates, { textType }); // 轮次
  const { data: textLabelCount, dispatch: dispatchGetTextLabelCount } = useFetch(getTextLabelCount, null, false);
  const { dispatch: dispatchPreone, isLoading: preLoading } = useFetch(getTextLabelPreOne, null, false);
  const { dispatch: dispatchGetTextLabel } = useFetch(getTextLabel, null, false);
  const { dispatch: dispatchNextone, isLoading: nextLoading } = useFetch(getTextLabelNextOne, null, false);
  const { data: textLabelResult, dispatch: dispatchGetTextLabelResult } = useFetch(getTextLabelResult, null, false); // 获取实体打标结果
  const { data: relationsTextLabelResult, dispatch: dispatchPostRelationsTextLabelResult } = useFetch(getRelationsTextLabelResult, null, false); // 获取关系打标结果
  const { dispatch: dispatchPostTextLabel } = useFetch(postTextLabel, null, false);
  const { dispatch: dispatchPostRelationCheckTextLabel } = useFetch(postRelationCheckTextLabel, null, false);
  const { dispatch: dispatchDelLabel } = useFetch(delTextLabel, null, false);

  // 取一条新数据进行打标
  const getOne = type => {
    setUserText('');
    setUserKey('');
    refreshState();
    type === 'NEXT' &&
      dispatchNextone({
        id: textLabeOne?.id,
        textType
      }).then(res => {
        setTextLableOne(res);
        dispatchGetTextLabelCount({ textType }); // 重新获取数量
      });

    type === 'PRE' &&
      dispatchPreone({
        id: textLabeOne?.id,
        textType
      }).then(res => {
        setTextLableOne(res);
        dispatchGetTextLabelCount({ textType }); // 重新获取数量
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  // 校对接口
  const check = () => {
    if (textType == 1) {
      dispatchPostRelationCheckTextLabel({ textType, id: textLabeOne.id }).then(res => {
        message.success('校对通过');
        getOne('NEXT');
      });
    } else {
      dispatchPostTextLabel({ textDataId: textLabeOne.id, textType }).then(res => {
        message.success('校对通过');
        getOne('NEXT');
      });
    }
  };

  // 关系打标
  const handleReationsLabel = (headEntityId, tailEntityId) => {
    // 获取当前预料的详情
    setSelectEntity({
      headEntityId,
      tailEntityId
    });
  };

  const handleClose = id => {
    dispatchDelLabel({ id, textType }).then(res => {
      message.success('删除成功');
      // 获取最新打标数据
      dispatchGetTextLabel({ id: textLabeOne.id, textType }).then(res => {
        setTextLableOne(res);
      });
    });
  };

  const handleUserKeyPress = useCallback(event => {
    const { key, keyCode, ctrlKey, altKey, shiftKey } = event;
    if (keyCode === 32 || (keyCode >= 65 && keyCode <= 90)) {
      let active = ctrlKey ? 'ctrl + ' : '';
      active = (altKey ? 'alt + ' : '') + active;
      active = (shiftKey ? 'shift + ' : '') + active;
      active = active + key;

      let activeCode = ctrlKey ? '018' : '';
      activeCode = (altKey ? '019' : '') + activeCode;
      activeCode = (shiftKey ? '017' : '') + activeCode;

      keycodeRef.current = activeCode + '0' + keyCode;
      setUserKey(active);
    }
  }, []);

  const getSelectString = useCallback(
    event => {
      function getSelectedNode() {
        if (document.selection) return document.selection.createRange().parentElement();
        else {
          var selection = window.getSelection();
          if (selection.rangeCount > 0) return selection.getRangeAt(0).startContainer.parentNode;
        }
      }
      var selectText = window?.getSelection()?.toString();
      if (selectText && textType == 0 && 'u-handle-area-content' === getSelectedNode().className) {
        setUserText(selectText);
      }
    },
    [textType]
  );

  const formatData = (data = []) => {
    if (!data.length) return <>暂无数据</>;
    const groupByCategory = data.reduce((group, product) => {
      const { dictName } = product;
      group[dictName] = group[dictName] ?? [];
      group[dictName].push(product);
      return group;
    }, {});
    return Object.keys(groupByCategory).map(item => {
      return (
        <div className="list">
          <span className="title">{item} :</span>
          {groupByCategory[item].map(items => {
            const close = id => {
              dispatchDelLabel({ id, textType }).then(res => {
                message.success('删除成功');
                // 获取最新打标数据
                dispatchGetTextLabel({ id: textLabeOne.id, textType }).then(res => {
                  setTextLableOne(res);
                });
              });
            };
            return (
              <Tag key={items.id} color={items.color} closable onClose={() => close(items.id)}>
                {items.label}
              </Tag>
            );
          })}
        </div>
      );
    });
  };

  // 渲染消息栏
  const renderMessage = data => {
    let percent = 0;
    if (data?.sumCount) {
      percent = ((data?.alreadyCount / data?.sumCount) * 100).toFixed(1);
    }

    return (
      <>
        当前是第{(historyRateData?.length || 0) + 1}轮: (待打标：{data?.needCount || 0}个；已打标：{data?.alreadyCount || 0}个；总量：
        {data?.sumCount || 0}个 ;)
        <div style={{ display: 'flex', marginTop: 8 }}>
          <span style={{ width: 106 }}>整体完成进度：</span>
          <Progress style={{ flex: 1 }} percent={percent} size="small" />
        </div>
      </>
    );
  };

  useEffect(() => {
    getOne('NEXT'); // 取一条新数据
    window.addEventListener('keyup', handleUserKeyPress);
    window.addEventListener('mouseup', getSelectString);
    return () => {
      window.removeEventListener('keyup', handleUserKeyPress);
      window.removeEventListener('mouseup', getSelectString);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (textLabeOne && textType == 0) {
      dispatchGetTextLabelResult({ id: textLabeOne.id }); // 获取实体打标结果
    }

    if (textLabeOne && textType == 1) {
      dispatchPostRelationsTextLabelResult({ id: textLabeOne.id, textType }); // 获取关系打标结果
      setEntityKey(Math.random());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textLabeOne, textType]);

  // 实体打标
  useEffect(() => {
    if (userText && userKey) {
      dispatchPostTextLabel({ label: userText, keyCode: keycodeRef.current, textDataId: textLabeOne.id, textType }).then(res => {
        message.success('实体打标成功！');
        dispatchGetTextLabel({ id: textLabeOne.id, textType }).then(res => {
          setTextLableOne(res);
        });
        setUserText('');
        setUserKey('');
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userKey, userText]);

  // 关系打标
  useEffect(() => {
    if (selectEntity?.headEntityId && userKey) {
      dispatchPostTextLabel({ keyCode: keycodeRef.current, textDataId: textLabeOne.id, textType, ...selectEntity }).then(res => {
        message.success('关系打标成功！');
        setSelectEntity(null);
        setUserKey('');
        dispatchGetTextLabel({ id: textLabeOne.id, textType }).then(res => {
          setTextLableOne(res);
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userKey, selectEntity]);

  useEffect(() => {
    if (textLabelCount?.needCount == 0) {
      refreshState(); // 打标完成
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textLabelCount]);

  return (
    <div className="u-handle">
      <section className="header">
        <Alert message={renderMessage(textLabelCount)} type="success" />
      </section>

      {textLabelCount?.needCount == 0 ? (
        <div className="u-finish">
          <IconSet type="icon-success" style={{ fontSize: 28 }} />
          <span className="text">打标完成</span>
        </div>
      ) : (
        <>
          <DicTable read type="tag" />
          <section className="u-handle-area">
            <Card
              title={<strong>{textType == 1 ? '关系' : '实体'}打标工作区</strong>}
              extra={
                !!textLabelCount?.needCount && (
                  <>
                    <Button loading={preLoading} onClick={() => getOne('PRE')} type="primary">
                      上一条
                    </Button>

                    <Button loading={nextLoading} onClick={() => getOne('NEXT')} type="primary">
                      下一条
                    </Button>

                    <Button title="该条数据不需要打标" onClick={check} type="primary">
                      校对
                    </Button>
                  </>
                )
              }
            >
              <div className="u-handle-area-content" dangerouslySetInnerHTML={{ __html: textLabeOne?.textMark }} />

              {textType == 1 && textLabeOne?.entitys?.length > 1 && (
                <Relation
                  key={entityKey}
                  entitys={textLabeOne?.entitys}
                  relations={textLabeOne?.relations}
                  handleReationsLabel={handleReationsLabel}
                />
              )}
            </Card>
          </section>
          <section className="u-handle-view">
            <Card title={<strong>{textType == 1 ? '关系' : '实体'}打标结果</strong>}>
              {textType == 0 && <div className="u-handle-view-content">{formatData(textLabelResult?.content)}</div>}
              {textType == 1 && (
                <div>
                  {relationsTextLabelResult?.content?.map(item => {
                    return (
                      <div className="u-desc" style={{ color: item.color }}>
                        <span className="title">头实体: </span>
                        {item.headEntity}； <span className="title">尾实体: </span>
                        {item.tailEntity}；<span className="title">关系: </span> {item.dictName}
                        <span
                          style={{ marginLeft: '12px' }}
                          title="删除"
                          onClick={() => {
                            handleClose(item.id);
                          }}
                        >
                          <DeleteOutlined />
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </section>
        </>
      )}
    </div>
  );
}
