import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AcappService {
  private ALL_STATE: string[] = [];

  constructor() {}

  get_state() {
    let res = '';
    for (let i = 0; i < 8; i++) {
      res += Math.floor(Math.random() * 10);
    }
    return res;
  }
  HAS_STATE(state: string): boolean {
    let index = this.ALL_STATE.indexOf(state);
    if (index < 0) {
      return false;
    }
    this.ALL_STATE.splice(index, 1);
    return true;
  }

  apply_code() {
    const state = this.get_state();
    this.ALL_STATE.push(state);
    const code = {
      appid: '3924',
      redirect_uri: encodeURI(
        'https://app464.acapp.acwing.com.cn/draw/acapp/receive/code',
      ),
      scope: 'userinfo',
      state: state,
    };
    return {
      result: 'success',
      code,
    };
  }

  async receive_code(query: any) {
    if (query.errcode) {
      return {
        result: 'error',
        errcode: query.errcode,
        errmsg: query.errmsg,
      };
    }
    let { code, state } = query;
    if (!this.HAS_STATE(state + '')) {
      console.log('没有 state');
      return {
        result: 'error',
      };
    }
    // 请求token
    let access_token_req = await axios.get(
      'https://www.acwing.com/third_party/api/oauth2/access_token/',
      {
        params: {
          appid: '3924',
          secret: '40d4d0861ad9450f9867777834a281ee',
          code: code,
        },
      },
    );
    let { access_token, refresh_token, openid } = access_token_req.data;
    //获取用户信息
    let user_data = await (
      await axios.get(
        'https://www.acwing.com/third_party/api/meta/identity/getinfo/',
        {
          params: {
            access_token: access_token,
            openid: openid,
          },
        },
      )
    ).data;

    if (user_data.errcode) {
      return {
        result: 'error',
      };
    }
    let { username, photo } = user_data;
    return {
      username: username,
      photo: photo,
      access_token: access_token,
      refresh_token: refresh_token,
      openid: openid,
    };
  }
}
