import styles from './index.module.less'
import Button from '../../../components/Button/Button'
import { useState } from 'react'
import { message } from 'antd'
import request from '../../../utils/request'

type Props = {
  cancelFun: () => void
}

const NewRoom = ({ cancelFun }: Props) => {
  const [messageApi, contextHolder] = message.useMessage()
  const [form, setForm] = useState({
    name: '',
    num: '',
  })
  const handleCreate = () => {
    if (form.name.length < 3 || form.name.length > 10) {
      messageApi.open({
        type: 'warning',
        content: '名字长度应在3到10之间',
      })
      return
    }
    if (
      parseInt(form.num).toString() === 'NAN' ||
      parseInt(form.num) < 2 ||
      parseInt(form.num) > 12
    ) {
      messageApi.open({
        type: 'warning',
        content: '人数应在2到16之间',
      })
      return
    }
    request
      .post('/room', {
        name: form.name,
        size: form.num,
      })
      .then((res: any) => {
        if (res.message === 'error')
          messageApi.open({
            type: 'warning',
            content: res.data,
          })
        cancelFun()
      })
  }
  return (
    <>
      {contextHolder}
      <div className={styles.createGame}>
        <div className={styles.title} style={{ justifyContent: 'center', transform: 'scale(0.9)' }}>
          <div className={styles.iconBack}>设置</div>
        </div>
        <div>
          <div className={styles.form}>
            <span>房间名:</span>
            <input
              type="text"
              onChange={(e) => {
                setForm({ ...form, name: e.target.value })
              }}
            />
          </div>
          <div className={styles.form}>
            <span>房间人数:</span>
            <input
              type="text"
              onChange={(e) => {
                setForm({ ...form, num: e.target.value })
              }}
            />
          </div>
          <div className={styles.buttonBox}>
            <Button
              title="创建房间"
              color="#ffcb00"
              img="/svg/ic_config.svg"
              onclick={handleCreate}
            ></Button>
            <Button title="取消" color="#ff4d4f" img="/svg/cancel.svg" onclick={cancelFun}></Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default NewRoom
