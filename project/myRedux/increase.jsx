import { useCount } from './contextProvider';

const Increase = () => {
  const { dispatch } = useCount();
  const handleIncrease = () => {
    dispatch({ type: 'increase' });
  };
  return <button onClick={handleIncrease}>+1</button>;
};

export default Increase;
