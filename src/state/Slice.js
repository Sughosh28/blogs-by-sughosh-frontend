import { createSlice } from "@reduxjs/toolkit";

const isLoggedIn = !!localStorage.getItem("authToken");

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loggedIn: isLoggedIn,
    token: isLoggedIn ? localStorage.getItem("authToken") : null,
    registration: {
      status: "idle",
      error: null,
      step: 1,
      formData: {
        fullName: "",
        username: "",
        password: "",
        rePassword:"",
        email: "",
        role: "",
        bio: "",
        github: "",
        instagram: "",
        linkedin: "",
        twitter: "",
      },
    },

    isDarkMode: localStorage.getItem("isDarkMode") === "true" || false,
    createPost: {
      status: "idle",
      error: null,
      step: 1,
      postData: {
        title: "",
        content: "",
        authorName: "",
        imageUrl: "",
        picture_content: "",
        picture_name: "",
        imageType: "",
        status: "",
        createdAt: "",
        updatedAt: ""
      }
    }
  },
  reducers: {
    login: (state, action) => {
      state.loggedIn = true;
      state.token = action.payload.token;
      localStorage.setItem("authToken", action.payload.token);
    },
    logout: (state) => {
      state.loggedIn = false;
      state.token = null;
      localStorage.removeItem("authToken");
    },
    registerRequest: (state) => {
      state.registration.status = "pending";
      state.registration.error = null;
    },
    registerSuccess: (state) => {
      state.registration.status = "success";
      state.registration.error = null;
    },
    registerFailure: (state, action) => {
      state.registration.status = "error";
      state.registration.error = action.payload.error;
    },
    resetRegistration: (state) => {
      state.registration.status = "idle";
      state.registration.step = 1;
      state.registration.error = null;
      state.registration.formData = {
        fullName: "",
        username: "",
        password: "",
        email: "",
        role: "",
        bio: "",
        github: "",
        instagram: "",
        linkedin: "",
        twitter: "",
      };
    },
    updateFormData: (state, action) => {
      state.registration.formData = {
        ...state.registration.formData,
        ...action.payload
      }
    },
    resetFormData: (state) => {
      state.registration.formData = {
        fullName: "",
        username: "",
        password: "",
        email: "",
        bio: "",
        github: "",
        linkedin: "",
      };
    },
    nextStep: (state) => {
      state.registration.step += 1;
    },
    prevStep: (state) => {
      if (state.registration.step > 1) {
        state.registration.step -= 1;
      }
    },
    toggleTheme: (state) => {
      state.isDarkMode = !state.isDarkMode
      localStorage.setItem("isDarkMode", state.isDarkMode);

    },
    createPostRequest: (state) => {
      state.createPost.status = "pending";
      state.createPost.error = null;
    },
    createPostSuccess: (state) => {
      state.createPost.status = "success";
      state.createPost.error = null;
    },
    createPostFailure: (state, action) => {
      state.createPost.status = "error";
      state.createPost.error = action.payload.error;
    },
    resetCreatePost: (state) => {
      state.createPost.status = "idle";
      state.createPost.step = 1;
      state.createPost.error = null;
      state.createPost.postData = {
        title: "",
        content: "",
        authorName: "",
        imageUrl: "",
        picture_content: " ",
        picture_name: "",
        imageType: "",
        status: "",
        createdAt: "",
        updatedAt: ""
      };
    },
    updatePostData: (state, action) => {
      state.createPost.postData = {
        ...state.createPost.postData,
        ...action.payload
      }
    },
    resetPostData: (state) => {
      state.createPost.postData = {
        title: "",
        content: "",
        authorName: "",
        picture_content: ""
      };
    },
    postsNextStep: (state) => {
      state.createPost.step += 1;
    },
    postsPrevStep: (state) => {
      if (state.createPost.step > 1) {
        state.createPost.step -= 1;
      }
    },
  }
});

export const {
  login,
  logout,
  registerRequest,
  registerSuccess,
  registerFailure,
  resetRegistration,
  updateFormData,
  nextStep,
  prevStep,
  resetFormData,
  toggleTheme,
  createPostRequest,
  createPostFailure,
  createPostSuccess,
  resetCreatePost,
  resetPostData,
  updatePostData,
  postsNextStep,
  postsPrevStep } = authSlice.actions;
export default authSlice.reducer;
