import { TemplateItem } from '@/axios/api/message/interface';
import { PaginationProps } from '@/interface';

export interface TemplateTableProps {
    selectedKeys: number[];
    setSelectedKeys: Function;
    setSelectedCodes: Function;
    list: TemplateItem[];
    loading: boolean;
    getList: Function;
    pagination: PaginationProps;
}
