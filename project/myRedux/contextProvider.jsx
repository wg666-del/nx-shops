import { useReducer, useContext, createContext } from 'react';

const initCount = 0;

const CountContext = createContext();

const ContextProvider = (props) => {
  const reducer = (state, action) => {
    switch (action.type) {
      case 'increase':
        return { count: state.count + 1 };
      case 'decrease':
        return { count: state.count - 1 };
      case 'reset':
        return init(initCount);
      default:
        throw Error('error .');
    }
  };

  // 惰性初始化
  const init = (count) => ({ count });

  const [state, dispatch] = useReducer(reducer, 0, init);
  return (
    <CountContext.Provider value={{ state, dispatch }}>
      {props.children}
    </CountContext.Provider>
  );
};

const useCount = () => useContext(CountContext);

export { useCount };
export default ContextProvider;
