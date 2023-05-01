import { UserType } from '@/axios/interface';

interface ListItem {
    user: UserType;
}

export const getEmpStr = (list: ListItem[], num = 3) => {
    const userStr = (user: UserType) =>
        user.userId && user.userName ? `${user.userName} | ${user.userId}` : `${user.userName || user.userId || ''}`;
    const empStr = list
        .slice(0, num)
        .map(item => (item.user ? userStr(item.user) : ''))
        .join('、');
    return list.length > num ? `${empStr}等${list.length}人` : empStr;
};
