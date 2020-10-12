export default function validateAddOrg(values) {
    let errors = {};

    if (!values.name.trim()) {
        errors.name = 'Name required';
    }

    if (!values.description) {
        errors.description = 'Description required';
    }

    return errors

}