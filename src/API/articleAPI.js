import request from '@/uilit/request.js'

// 登录功能的API接口
// eslint-disable-next-line space-before-function-paren
export const loginAPI = function (username, password) {
  return request.post('/login', {
    params: {
      _username: username,
      _password: password
    }

  })
}
