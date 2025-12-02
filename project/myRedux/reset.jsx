import { useCount } from './contextProvider';

const Reset = () => {
  const { dispatch } = useCount();
  const handleReset = () => {
    dispatch({ type: 'reset' });
  };
  return <button onClick={handleReset}>reset</button>;
};

export default Reset;
