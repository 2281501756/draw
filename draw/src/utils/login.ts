import axios from 'axios'

const login = async () => {
  let AcWingOS = window.AcWingOS
  if (!AcWingOS) {
    return
  }
  let apply_code = await axios.get(import.meta.env.VITE_SERVER_URL + '/acapp/apply/code')
  if (apply_code.data.result !== 'success') return
  let { appid, redirect_uri, scope, state } = apply_code.data.code
  AcWingOS.api.oauth2.authorize(appid, redirect_uri, scope, state, (res: any) => {
    window.user = res
  })
  window.AcWingOS.api.window.resize(
    (1100 * 100) / window.innerWidth,
    (650 * 100 * 18) / window.innerHeight / 17
  )
}

login()
