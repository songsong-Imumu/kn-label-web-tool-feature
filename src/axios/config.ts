// 当前的接口联调环境
export const isLocal = process.env.NODE_ENV === 'development'; // 本地开发环境
export const isDev = false; // 连接开发环境 设为true
export const isMock = false; // 使用本地数据时,设为true 联调为false
export const isTest = true; // 使用nginx联调, 设为false; 使用proxy联调 连接test环境 设为true
export const rootURL = isLocal ? (isMock ? '/mock' : isTest ? '/mock/test' : isDev ? '/mock/dev' : '') : '';

export const ServerCode = {
  SUCCESS: 0,
  CONTINUE: 400,
  NO_LOGIN: 401, // 未登录状态嘛码
  WRONG_REQUEST: 402,
  FORBIDDEN: 403,
  WRONG_URL: 404,
  // NO_LOGIN: 401, // 未登录状态嘛码
  TIME_OUT: 408,
  WRONG_REQUEST_MODAL: 410,
  AUTO_SAVE_ERROR_CODE: 411, // 自动暂存code
  PROCESS_ERROR: 412, // 任务进度错误
  WRONG_SERVER: 500,
  WRONG_REALIZE: 501,
  WRONG_GATEWAY: 502,
  BAD_SERVER: 503,
  GATEWAY_TIME_OUT: 504,
  WRONG_VERSION: 505
};

export const SubCode = {
  OPERATION_FAILED: 410001,
  TASK_HAS_EXPIRED_OR_SUBMITTED: 400001
};

export const ServerCodeMap = {
  [ServerCode.SUCCESS]: '成功',
  [ServerCode.CONTINUE]: '继续', // 传递指定“继续参数”即可成功
  // [ServerCode.WRONG_PARAM]: '参数格式出错',
  [ServerCode.WRONG_REQUEST]: '请求出错',
  [ServerCode.FORBIDDEN]: '拒绝访问',
  [ServerCode.WRONG_URL]: '请求地址出错',
  [ServerCode.NO_LOGIN]: '未登录',
  [ServerCode.TIME_OUT]: '请求超时',
  [ServerCode.WRONG_SERVER]: '服务器内部错误',
  [ServerCode.WRONG_REALIZE]: '服务未实现',
  [ServerCode.WRONG_GATEWAY]: '网关错误',
  [ServerCode.BAD_SERVER]: '服务不可用',
  [ServerCode.GATEWAY_TIME_OUT]: '网关超时',
  [ServerCode.WRONG_VERSION]: 'HTTP版本不受支持'
};

export const RedirectMap = {
  [ServerCode.FORBIDDEN]: '/403'
};
