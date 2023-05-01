import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import projectConfig from './projectConfig';
import { casLogin } from '@/axios';
import { getParams } from '@/utils/tools';

export default function CasLogin() {
  const history = useHistory();
  const params = getParams();

  /**
   * @description 未登录，则跳转到企业登录页，进行sso 登录
   * casLoginServer: 企业sso 登录地址
   * casServiceId: 项目的域名 https://xxx.com/casLogin
   */
  const redirectToCas = () => {
    // https://sso.zhenergy.com.cn/cas/login?service=https://xxx.com/casLogin
    window.open(`${projectConfig.casLoginServer}?service=${projectConfig.casServiceId}`, '_self');
  };

  /**
   * @description 登录
   * 登录成功，前端跳转到首页
   * 后端将token 写入cookie 中，方便后续取用
   */
  const login = () => {
    let _params = {
      service: projectConfig.casServiceId,
      ticket: params.ticket // queryString ticket
    };
    // params
    casLogin(_params)
      .then((data: any) => {
        // setToken(data.data.tokenData);
        // 建议后端写cookie，如果不写，则需要前端写，然后通过 axios header 的形式传递
        // localStorage.setItem('tokenData', data.data.tokenData); 后端写cookie
        localStorage.setItem('trueName', data.trueName); // 用户名
        localStorage.setItem('roleType', data.roleType); // 角色
        history.push('/app/data/origin');
      })
      .catch(e => {});
  };

  useEffect(() => {
    if (params.ticket == null) {
      redirectToCas();
    } else {
      login();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  return <div>cas-login 登录中</div>;
}
