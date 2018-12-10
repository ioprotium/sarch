import Vue from 'vue';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.VUE_APP_ROOT_API, // get from .env files
  timeout: 15000
});

Vue.mixin({
  computed: {
    $http() {
      return axiosInstance;
    }
  }
});
