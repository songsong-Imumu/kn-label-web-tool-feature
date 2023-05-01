import React, { ComponentType } from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import E403 from '@/view/exception/E403';
import E405 from '@/view/exception/E405';
import E404 from '@/view/exception/not-found';
import { routes } from './router';

const CRouter = (props: any) => {
  /**
   * @author zhangz
   * @param Com 组件名
   * @param path url 路径
   * @param auth 是否需要鉴权
   * @return 开发者，在页面上 通过props.btns 可取到所有的操作按钮的权限code array,形如['create','edit','del','common-btn']。
   */
  const requireAuth = (Com: ComponentType<any>, auth: number[], breadcrumbName) => {
    // TODO: 优化403 逻辑
    // const roleType = localStorage.getItem('roleType');

    // if (!auth?.includes(Number(roleType || 1))) {
    //   return <Redirect to="/403" />;
    // }

    return <Com {...props} breadcrumbName={breadcrumbName} />;
  };

  const child = (r: any, path) => {
    if (r.children) {
      return (
        <Switch>
          {r.children.map((c, i) => {
            const routePath = `${path}${c.link || c.key}`;
            return <Route key={routePath} path={routePath} render={() => child(c, routePath)} />;
          })}
          <Route key={path} path={path} render={() => requireAuth(r.component, r.auth, r.name)} />
          <Redirect to={path} />
        </Switch>
      );
    } else {
      return requireAuth(r.component, r.auth, r.name);
    }
  };

  return (
    <Switch>
      <Route path="/" exact render={() => <Redirect to="/app/high/search" />} />
      {routes.map((r: any) => {
        return (
          <Route
            key={r.link || r.key}
            path={r.link || r.key}
            render={() => {
              return child(r, r.link);
            }}
          />
        );
      })}
      <Route path="/403" component={E403} />
      <Route path="/405" component={E405} />
      <Route component={E404} />
    </Switch>
  );
};
export default withRouter(CRouter);
