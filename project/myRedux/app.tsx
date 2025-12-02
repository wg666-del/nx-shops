import ContextProvider, { useCount } from './contextProvider';
import Increase from './increase';
import Decrease from './decrease';
import Reset from './reset';

const App = () => {
  const { state } = useCount();
  return (
    <ContextProvider>
      <div>当前计数：{state.count}</div>
      <Increase />
      <Decrease />
      <Reset />
    </ContextProvider>
  );
};

export default App;
