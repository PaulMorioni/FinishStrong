import React, { useState, useEffect } from "react";
import { Button, Form, Grid } from "semantic-ui-react";
import RegisterSuccess from "./RegisterSuccess";
import validateInfo from "./validateInfo";

const RegisterForm = (props) => {
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    verifyPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  async function sendUser(user) {
    const response = await fetch("/add_user", {
      //sends user data to api server for storage.
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    if (response.ok) {
      setIsSubmitted(true);
    }
  }

  const handleChange = (e) => {
    const { id, value } = e.target;
    setValues({
      ...values,
      [id]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors(validateInfo(values));
    setIsSubmitting(true);
  };

  useEffect(() => {
    if (Object.keys(errors).length === 0 && isSubmitting) {
      validateInfo(values);
      sendUser(values);
    }
  }, [errors, values, isSubmitting]);

  if (!isSubmitted) {
    return (
      //input sizes change when errors occur. needs changed TODO
      //may need to fix if else statement
      <div className="form-content-right">
        <Grid centered>
          <Form size="large">
            <Form.Group>
              <Form.Input
                id="firstName"
                label="First Name"
                placeholder="John"
                type="name"
                error={errors.firstName}
                value={values.firstName}
                onChange={handleChange}
              />
              <Form.Input
                id="lastName"
                label="Last Name"
                placeholder="Smith"
                type="name"
                error={errors.lastName}
                value={values.lastName}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Input
                id="email"
                label="Email"
                placeholder="SmithJohn12@gmail.com"
                width={16}
                error={errors.email}
                value={values.email}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Input
                id="password"
                label="Password"
                placeholder="Password"
                type="password"
                error={errors.password}
                value={values.password}
                onChange={handleChange}
              />
              <Form.Input
                id="verifyPassword"
                label="Re-Type Password"
                placeholder="Password"
                type="password"
                error={errors.verifyPassword}
                value={values.verifyPassword}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Field>
              <Button disabled={isSubmitted} onClick={handleSubmit}>
                Submit
              </Button>
            </Form.Field>
          </Form>
        </Grid>
      </div>
    );
  } else {
    return <RegisterSuccess />;
  }
};
export default RegisterForm;
