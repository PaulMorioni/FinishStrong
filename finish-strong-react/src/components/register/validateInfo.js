export default function validateInfo(values) {
    let errors = {};

    if (!values.firstName.trim()) {
        errors.firstName = 'First Name required';
    }

    if (!values.lastName.trim()) {
        errors.lastName = 'First Name required';
    }

    if (!values.email) {
        errors.email = 'Email required';
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
        errors.email = 'Email address is invalid';
    }
    if (!values.password) {
        errors.password = 'Password is required';
    } else if (values.password.length < 6) {
        errors.password = 'Password needs to be 6 characters or more';
    }

    if (!values.verifyPassword) {
        errors.verifyPassword = 'Password is required';
    } else if (values.password !== values.verifyPassword) {
        errors.verifyPassword = 'Passwords do not match';
    }
    return errors;
}