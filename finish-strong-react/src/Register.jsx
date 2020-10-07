import React, { useEffect, useState } from "react";
import { Button, Form, Grid } from "semantic-ui-react";

function RegisterForm(props) {
  const [state, setState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    verifyPassword: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  return (
    <Grid centered>
      <Form size="large">
        <Form.Group>
          <Form.Input
            id="firstName"
            label="First Name"
            placeholder="John"
            type="name"
            required
            value={state.firstName}
            onChange={handleChange}
          />
          <Form.Input
            id="lastName"
            label="Last Name"
            placeholder="Smith"
            type="name"
            required
            value={state.lastName}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Input
            id="email"
            label="Email"
            placeholder="SmithJohn12@gmail.com"
            width={16}
            required
            value={state.email}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Input
            id="password"
            label="Password"
            placeholder="Password"
            type="password"
            required
            value={state.password}
            onChange={handleChange}
          />
          <Form.Input
            id="verifyPassword"
            label="Re-Type Password"
            placeholder="Password"
            type="password"
            required
            value={state.verifyPassword}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Field>
          <Button
            onClick={async () => {
              const user = {
                email: state.email,
                password: state.password,
                firstName: state.firstName,
                lastName: state.lastName,
              };
              const response = await fetch("/add_user", {
                //sends user data to api server for storage.
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
              });
              if (response.ok) {
              }
            }}
          >
            Submit
          </Button>
        </Form.Field>
      </Form>
    </Grid>
  );
}

export default RegisterForm;
