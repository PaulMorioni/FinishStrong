import React, { useState, useEffect } from "react";
import { Button, Form, FormField, Grid } from "semantic-ui-react";
import AddOrgSuccess from "./AddOrgSuccess";
import validateAddOrg from "./validateAddOrg";

const AddOrgForm = (props) => {
  const [values, setValues] = useState({
    name: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  async function sendOrganization(organization) {
    const response = await fetch("/add_organization", {
      //sends organization data to api server for storage.
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(organization),
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
    setErrors(validateAddOrg(values));
    setIsSubmitting(true);
  };

  useEffect(() => {
    if (Object.keys(errors).length === 0 && isSubmitting) {
      validateAddOrg(values);
      sendOrganization(values);
    }
  }, [errors, values, isSubmitting]);

  if (!isSubmitted) {
    return (
      //input sizes change when errors occur. needs changed TODO
      //may need to fix if else statement
      <div>
        <Grid centered>
          <Form size="large">
            <Form.Input
              id="name"
              label="Organization Name"
              placeholder="Finish Strong"
              type="name"
              error={errors.name}
              value={values.name}
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
    return <AddOrgSuccess />;
  }
}; 
export default AddOrgForm;
