import { useState } from "react";
import { notification } from "antd";

interface IValues {
  name: string;
  email: string;
  message: string;
}

const initialValues: IValues = {
  name: "",
  email: "",
  message: "",
};

export const useForm = (validate: { (values: IValues): IValues }) => {
  const [formState, setFormState] = useState<{
    values: IValues;
    errors: IValues;
  }>({
    values: { ...initialValues },
    errors: { ...initialValues },
  });

  const handleSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Form Gönderildi, Mevcut Değerler:", formState.values);
    const values = formState.values;
    const errors = validate(values);
    setFormState((prevState) => ({ ...prevState, errors }));

    const url = "http://localhost:9090/v1/dev/contact/save"; 

    try {
      if (Object.values(errors).every((error) => error === "")) {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          notification["error"]({
            message: "Error",
            description:
              "There was an error sending your message, please try again later.",
          });
        } else {
          event.target.reset();
          setFormState(() => ({
            values: { ...initialValues },
            errors: { ...initialValues },
          }));

          notification["success"]({
            message: "Success",
            description: "Your message has been sent!",
          });
        }
      }
    } catch (error) {
      notification["error"]({
        message: "Error",
        description: "Failed to submit form. Please try again later.",
      });
    }
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
  
    setFormState((prevState) => ({
      ...prevState,
      values: {
        ...prevState.values,
        [name]: value,
      },
    }));
  };
  

  return {
    handleChange,
    handleSubmit,
    values: formState.values,
    errors: formState.errors,
  };
};
