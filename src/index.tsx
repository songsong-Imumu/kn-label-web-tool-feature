import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import App from './App';
import '@/assets/css/index.less';
import E405 from './view/exception/E405';
import casLogin from './view/cas-login';

const Page = props => (
  <Router basename="/kg">
    <Switch>
      <Route path="/405" component={E405} />
      <Route path="/casLogin" component={casLogin} />
      <Route path="/" render={e => App(e, props)} />
    </Switch>
  </Router>
);

function render(props) {
  const { container } = props;
  ReactDOM.render(<Page {...props?.initData} />, container ? container.querySelector('#root') : document.querySelector('#root'));
}

if (!window.__POWERED_BY_QIANKUN__) {
  render({});
}

export async function bootstrap() {
  console.log('[react16] react app bootstraped');
}

export async function mount(props) {
  console.log('[react16] props from main framework', props);
  render(props);
}

export async function unmount(props) {
  const { container } = props;
  ReactDOM.unmountComponentAtNode(container ? container.querySelector('#root') : document.querySelector('#root'));
}
