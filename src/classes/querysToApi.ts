import axios, { AxiosRequestConfig } from 'axios';

class QuerysToAPI {
  private user = {
    username: 'Lucasc12',
    password: 'Salmeron1-',
  };

  private token : string = '';

  private baseURL : string = '';

  private config : AxiosRequestConfig = {
    headers: {
      authorization: '',
    },
  };

  private session : boolean = false;

  async login() {
    await axios.post('https://api.mangadex.org/auth/login', this.user).then((res) => this.token = `${res.data.token.session}`).catch((err) => console.log(err.response.data));
    if (this.config.headers !== undefined) {
      this.config.headers.authorization = `bearer ${this.token}`;
      return true;
    } return false;
  }

  async checkSession() {
    await axios.get('https://api.mangadex.org/auth/check', this.config).then((res) => { if (res.data.isAuthenticated) { this.session = true; } });
  }

  async URL() {
    if (this.session) {
      await axios.get('https://api.mangadex.org/at-home/server/ca2c5daa-d7b9-4ff7-9af5-b24966c18a4f', this.config).then((res) => this.baseURL = res.data.baseUrl);
    }
    console.log('no estas logeado');
  }

  async getIMAGE() {
    if (this.session) {
      await axios.get(`${this.baseURL}/data/901a558099f665e664a29ac63c713c71/s3-526efa4d0c5a92f84e112bf243b83af8cc79b7644e7ee68d62942553ef463a70.jpg`, this.config).then((res) => console.log(res));
      await axios.get(`${this.baseURL}/data/901a558099f665e664a29ac63c713c71/s5-d87c52f24cc6e3ec00eeb1b6b30c81ffcbdf1e9d67daf4545a788c27eb9b4ccf.jpg`, this.config).then((res) => console.log(res));
    }
    console.log('no estas logueado');
  }
}

export const querysToapi = new QuerysToAPI();
