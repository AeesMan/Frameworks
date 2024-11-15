import { useForm } from "react-hook-form";
import "./App.css";


function App() {

  const {
    register,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm({
    mode: "onSubmit",
  });

  const onSubmit = (data) => {
    console.log(JSON.stringify(data));
    reset();
  };


  return (
    <div className="App">
      <h1>React Hook Form for IPZ</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
      <label>

          FirstName:
          <input {...register("firstName", {
            required: "Поле обов'язкове для заповнення!", 
            minLength: {value: 5, message: 'Мінімум 5 символів!'}})} />
        </label>
        <div style={{ height: 40 }}>
          {errors?.firstName && (<p> {errors?.firstName?.message || "Error!"} </p>
        )}
        </div>
        <label>

          Last Name:
          <input {...register("lastName", {
            required: "Поле обов'язкове для заповнення!", 
            minLength: {value: 5, message: 'Мінімум 5 символів!'},
            maxLength: {value: 25, message: 'Максимум 25 символів!'}
            })} />
        </label>
        <div style={{ height: 40 }}>
          {errors?.lastName && (<p> {errors?.lastName?.message || "Error!"} </p>
        )}
        </div>

        <input type="submit" />
      </form>
    </div>
  );
}

export default App;
