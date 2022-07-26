import { makeAutoObservable } from "mobx"
import { http, setToken, getToken, clearToken } from '@/utils/index'
class LoginStore {
  token = getToken || ''
  constructor() {
    makeAutoObservable(this)
  }
  setToken = async ({ mobile, code }) => {
    //发请求
    const res = await http.post('http://geek.itheima.net/v1_0/authorizations', {
      mobile,
      code
    })
    //存token
    this.token = res.data.token

    setToken(this.token)
  }

  logout = () => {
    this.token = ''
    clearToken()
  }
}

export default LoginStore