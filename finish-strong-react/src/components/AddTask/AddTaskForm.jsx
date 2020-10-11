import React, { useState, useEffect } from "react";
import { Button, Form, FormField, Grid, Rating } from "semantic-ui-react";
import AddTaskSuccess from "./AddTaskSuccess";
import validateAddTask from "./validateAddTask";
import SemanticDatepicker from "react-semantic-ui-datepickers";

//Needs to send values properly and needs to take Project ID out of session.

const AddProjectForm = (props) => {
  const [values, setValues] = useState({
    name: "",
    description: "",
    eta: "",
    deadline: "",
    difficulty: 0,

  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  async function sendTask(task) {
    const response = await fetch("/add_task", {
      //sends project data to api server for storage.
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
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
    setErrors(validateAddTask(values));
    setIsSubmitting(true);
  };

  useEffect(() => {
    if (Object.keys(errors).length === 0 && isSubmitting) {
      validateAddTask(values);
      sendTask(values);
    }
  }, [errors, values, isSubmitting]);

  if (!isSubmitted) {
    return (
      //input sizes change when errors occur. needs changed TODO
      //may need to fix if else statement
      //SemanticDatePicker handle change isnt setting properly. Needs fixed.
      <div>
        <Grid centered>
          <Form size="large">
            <Form.Input
              id="name"
              label="Task Name"
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
                id="eta"
                label="Estimated Date of Completion"
                onChange={handleChange}
                error={errors.deadline}
                value={values.deadline}
              />
              <SemanticDatepicker
                id="deadline"
                label="Deadline"
                onChange={handleChange}
                error={errors.deadline}
                value={values.deadline}
              />
            <Form.Field>
                <Rating
                id="difficulty"
                icon="star"
                defaultRating={0}
                maxRating={10}
                />
            </Form.Field>
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
    return <AddTaskSuccess />;
  }
};
export default AddProjectForm;
