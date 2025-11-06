import { useState } from "react";

const useForm = (initValue) => {
  const [values, setValues] = useState(initValue);

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const resetForm = () => {
    setValues(initValue);
  };

  return [values, handleChange, resetForm];
};

export default useForm;
