import React from 'react';
import { getUserStr } from '@/utils/getFormatStr';
// import TableColumnSearch from './search';
import TableColumnCascader from './cascader-select';
import PeopleDrawer from '../pro-drawer/people-drawer';

// 级联组件根据value获取对应名称
export const getCascaderName = (list, value, fieldName: { label: string; value: string | number } = { label: 'label', value: 'value' }): [] => {
    if (!Array.isArray(list) || !list?.length || !Array.isArray(value) || !value?.length) return [];
    let arr: any = [],
        acc = 0;
    function traverse(targetArr: any) {
        if ((Array.isArray(targetArr) || targetArr?.length) && typeof value[acc] !== 'undefined') {
            const current = targetArr.find(item => item[fieldName.value] === value[acc]);
            arr.push(current[fieldName.label]);
            acc += 1;
            traverse(current.children);
        }
    }
    traverse(list);
    return arr;
};

export const commonColumns = ({ positionTypeFilter = {}, fullPathFilter = {} }) => [
    {
        title: '姓名',
        dataIndex: 'userName',
        key: 'userName',
        width: 100,
        fixed: 'left',
        // ...TableColumnSearch(),
        // filtersConditionName: value => getUserStr(value[0] || {}),
        render: (text, record) => (
            <PeopleDrawer info={record}>
                <div style={{ color: '#1774E6', cursor: 'pointer' }}>{getUserStr(record)}</div>
            </PeopleDrawer>
        )
    },
    {
        title: '职类',
        width: 100,
        dataIndex: 'positionTypeName',
        key: 'positionTypeCode',
        ...TableColumnCascader({
            opts: {
                fieldNames: { value: 'code', label: 'name' }
            },
            ...positionTypeFilter
        }),
        filtersConditionName: value => getCascaderName(positionTypeFilter?.list || [], value, { value: 'code', label: 'name' }).join('-')
    },
    {
        title: '岗位',
        width: 80,
        dataIndex: 'positionName',
        key: 'positionName'
    },
    {
        title: '所属部门',
        width: 150,
        dataIndex: 'fullPathName',
        key: 'deptIdList',
        ...TableColumnCascader({
            opts: {
                fieldNames: { value: 'id', label: 'deptName' }
            },
            ...fullPathFilter
        }),
        filtersConditionName: value => getCascaderName(fullPathFilter?.list || [], value, { value: 'id', label: 'deptName' }).join('-')
    }
];

// 获取选择当前层级及其所有子集的id
export const getAllChildId = (valueList, allList, idFieldName: string) => {
    if (!Array.isArray(valueList) || !valueList?.length) return [];
    let arr: Record<string, any> = [],
        hierarchy = 0;
    (function findFunc(remainList) {
        if (hierarchy < valueList.length) {
            const curInfo: Record<string, any> = remainList.find(item => item[idFieldName] === valueList[hierarchy]);
            if (!curInfo) return;
            // valueList末级不存在children则选择了最后一层，只返回最后一层的id
            hierarchy += 1;
            if (curInfo.children) {
                hierarchy === valueList.length && arr.push(curInfo[idFieldName]);
                findFunc(curInfo.children);
            } else {
                arr.push(curInfo[idFieldName]);
            }
        } else {
            remainList.map(item => {
                arr.push(item[idFieldName]);
                item.children && findFunc(item.children);
            });
        }
    })(allList);
    return arr;
};

export const getCommonFilter = (filters, deptTreeList) => {
    const { positionTypeCode, deptIdList } = filters || {};

    return {
        positionTypeCode: positionTypeCode ? positionTypeCode.slice().pop() : undefined, // 职类级联只取选择的当前层级
        cppDeptIdList: deptIdList ? getAllChildId(deptIdList, deptTreeList, 'id') : undefined
    };
};
