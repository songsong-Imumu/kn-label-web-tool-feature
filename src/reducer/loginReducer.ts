// 用户
interface Action {
  type: 'QUERY_AUTH_MENUS';
  payload?: {
    [index: string]: any;
  };
}

function loginReducer(state: any, action: Action) {
  switch (action.type) {
    case 'QUERY_AUTH_MENUS':
      return {
        ...state,
        fetch: false,
        user: action.payload && action.payload.user,
        menus: action.payload && action.payload.menus
      };
    default:
      return state;
  }
}

export default loginReducer;
