import { ReactNode } from 'react';
import { TemplateItem } from '@/axios/interface';
import { EventType, PaginationProps } from '@/interface';

export type TemplateType = 0 | 1 | 2 | 3;
export type TemplateStatus = 1 | 2 | 3 | 4;
export type OrderType = 1 | 2;

// 模板配置-列表的props值
export interface TemplateTableProps {
    selectedKeys: number[];
    setSelectedKeys: Function;
    list: TemplateItem[];
}

// 模板配置-搜索参数
export interface TemplateSearchParams extends PaginationProps {
    id: number;
    name: string;
    type: TemplateType;
    status: TemplateStatus;
    order: OrderType;
    buSceneId: number;
    buSceneName: string;
}

export interface OperaProps {
    content?: ReactNode;
    eventType: EventType;
    successContent?: ReactNode;
    idList?: number[];
}
