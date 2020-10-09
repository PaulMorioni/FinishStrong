import React, { useState, useEffect } from "react";
import { Button, Form, Grid } from "semantic-ui-react";
import LoginSuccess from "./LoginSuccess";
import validateLogin from "./validateLogin";

const LoginForm = (props) => {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  async function loginUser(user) {
    const response = await fetch("/login_user", {
      //sends user data to api server for login request.
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    //Needs to handle login, TODO needs to properly handle login.
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
    setErrors(validateLogin(values));
    setIsSubmitting(true);
  };

  useEffect(() => {
    if (Object.keys(errors).length === 0 && isSubmitting) {
      validateLogin(values);
      loginUser(values);
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
                id="email"
                label="Email"
                placeholder="SmithJohn12@gmail.com"
                width={16}
                error={errors.email}
                value={values.email}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Input
              id="password"
              label="Password"
              placeholder="Password"
              type="password"
              error={errors.password}
              value={values.password}
              onChange={handleChange}
            />
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
    return <LoginSuccess />;
  }
};
export default LoginForm;
