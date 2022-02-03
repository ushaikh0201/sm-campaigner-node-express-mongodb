import axios from "axios";

let instance = axios.create({
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
});

export default instance;
