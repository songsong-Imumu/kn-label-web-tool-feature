import { useState, useEffect } from 'react';
import { useRequest } from 'ahooks';
import { getUserInfo, getUserMenus } from '@/axios';

// 获取用户权限信息
function useAuthInfo() {
    const [user, setUser] = useState(null);
    const [menus, setMenus] = useState(null);
    const { data: userInfo = {} } = useRequest(getUserInfo, {
        defaultParams: { systems: 12 }
    });
    const { data: menusInfo = [] } = useRequest(getUserMenus);
    useEffect(() => {
        if (userInfo?.name) {
            setUser(userInfo);
        }
    }, [userInfo]);

    useEffect(() => {
        if (menusInfo.length) {
            setMenus(menusInfo);
        }
    }, [menusInfo]);

    return { user, menus };
}
export default useAuthInfo;
