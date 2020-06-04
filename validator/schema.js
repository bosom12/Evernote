/**
 * @desc SCHEMA VALIDATOR
 */
export default {
  signupForm: {
    formType: 'signUp',
    username: { field: 'username', required: true },
    email: { field: 'email', required: true, isEmail: true },
    password: {
      field: 'password',
      required: true,
      minLength: 8,
      maxLength: 16,
    },
  },
  loginForm: {
    formType: 'login',
    email: { field: 'email', required: true, isEmail: true },
    password: {
      field: 'password',
      required: true,
      minLength: 8,
      maxLength: 16,
    },
  },
  todoForm: {
    formType: 'createTodo',
    title: { field: 'title', required: true },
    description: { field: 'description', required: true },
    dueDate: { field: 'dueDate', required: true },
  },
  forgetForm: {
    formType: 'forgetPassword',
    email: { field: 'email', required: true },
  },
  resetForm: {
    formType: 'resetPassword',
    password: { field: 'password', required: true },
  },

};
