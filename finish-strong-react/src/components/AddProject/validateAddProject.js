export default function validateAddProject(values) {
    let errors = {};

    if (!values.name.trim()) {
        errors.name = 'Name required';
    }

    if (!values.description) {
        errors.description = 'Description required';
    }

    if (!values.deadline) {
        errors.deadline = "Deadline is required";
    }

    return errors

}