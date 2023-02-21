import styles from './index.module.less'
import { UserOutlined } from '@ant-design/icons'
import { IRoom } from '../types/room.type'
import classNames from 'classnames'

type Props = IRoom & {
  active: boolean
  onclick: () => void
}

const RoomItem = ({ image, roomName, current_person_num, size, active, onclick }: Props) => {
  return (
    <div className={classNames(styles.item, { [styles.active]: active })} onClick={onclick}>
      <div>
        <div
          className={styles.img}
          style={{
            background: `url(${import.meta.env.VITE_SERVER_URL + image}) no-repeat center/cover`,
          }}
        />
      </div>
      <div className={styles.name}>
        <h4>{roomName}</h4>
      </div>
      <div>
        <UserOutlined style={{ color: '#0a5efb', fontSize: 20 }} />{' '}
        {current_person_num + '/' + size}
      </div>
    </div>
  )
}

export default RoomItem
