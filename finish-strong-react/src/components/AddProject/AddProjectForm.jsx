import React, { useState, useEffect } from "react";
import { Button, Form, FormField, Grid } from "semantic-ui-react";
import addProjectSuccess from "./AddProjectSuccess";
import validateAddProject from "./validateAddProject";
import SemanticDatepicker from "react-semantic-ui-datepickers";

const AddProjectForm = (props) => {
  const [values, setValues] = useState({
    name: "",
    description: "",
    deadline: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  async function sendProject(project) {
    const response = await fetch("/add_project", {
      //sends project data to api server for storage.
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(project),
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
    setErrors(validateAddProject(values));
    setIsSubmitting(true);
  };

  useEffect(() => {
    if (Object.keys(errors).length === 0 && isSubmitting) {
      validateAddProject(values);
      sendProject(values);
    }
  }, [errors, values, isSubmitting]);

  if (!isSubmitted) {
    return (
      //input sizes change when errors occur. needs changed TODO
      //may need to fix if else statement
      //SemanticDatePicker handle change isnt setting properly. Needs fixed.
      <div className="form-content-right">
        <Grid centered>
          <Form size="large">
            <Form.Input
              id="name"
              label="Project Name"
              placeholder="Finish-Strong"
              type="name"
              error={errors.name}
              value={values.name}
              onChange={handleChange}
            />

            <Form.TextArea
              id="description"
              label="Description"
              placeholder="Build a task tracking application..."
              width={16}
              error={errors.description}
              value={values.description}
              onChange={handleChange}
            />
              <SemanticDatepicker
                id="deadline"
                label="Deadline"
                onChange={handleChange}
                error={errors.deadline}
                value={values.deadline}
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
    return <addProjectSuccess />;
  }
};
export default AddProjectForm;
