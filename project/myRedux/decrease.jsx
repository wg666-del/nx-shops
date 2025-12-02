import { useCount } from './contextProvider';

const Decrease = () => {
  const { dispatch } = useCount();
  const handleDecrease = () => {
    dispatch({ type: 'decrease' });
  };
  return <button onClick={handleDecrease}>-1</button>;
};

export default Decrease;
