import axios from "axios";

class ApiHelper {
  constructor() {
    this.baseUrl = "http://localhost:5000/api";
    this.api = axios.create({
      baseURL: this.baseUrl,
      timeout: 10000,
    });

    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.token = `${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
    this.api.interceptors.response.use.bind(this)
    this.api.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        const status = error.response?.status;
        const url = error.config?.url || "";
        const isAuthApi =
          url.includes("/user/login") || url.includes("/user/register");

        if (status === 401 && !isAuthApi) {
          localStorage.removeItem("token");
          if(this.setAuth){
            this.setAuth(null)
          }
        }
        // Server responded with error
        if (error.response && error.response.data) {
          const message =
            error.response.data.message ||
            error.response.data.error ||
            "Server Error";

          error.message = message;
        } else {
          error.message = "Network error. Please try again.";
        }

        return Promise.reject(error);
      }
    );
  }

  login(data) {
    return this.api.post("/user/login", data);
  }
  register(data) {
    return this.api.post("/user/register", data);
  }
  listUser() {
    return this.api.get("/user/listUser");
  }
  updateUser(data){
    return this.api.put("/user/update", data)
  }
  deleteUser(id){
    return this.api.delete(`/user/delete/${id}`)
  }
}

const apiHelper = new ApiHelper();
export default apiHelper;
