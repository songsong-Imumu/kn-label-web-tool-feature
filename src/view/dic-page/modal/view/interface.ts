export type TemplateType = 0 | 1 | 2 | 3;
export type TemplateStatus = 1 | 2 | 3 | 4;
export type OrderType = 1 | 2;

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
