export default function validateAddOrg(values) {
    let errors = {};

    if (!values.name.trim()) {
        errors.name = 'Name required';
    }
    return errors

}