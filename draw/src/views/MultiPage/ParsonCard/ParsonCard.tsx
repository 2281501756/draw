import styles from './index.module.css'
import { user } from '../types/index'
import { Badge } from 'antd'

type Props = {
  user: user
  status?: string
}

const ParsonCard = ({ user, status }: Props) => {
  return (
    <div className={styles.base}>
      <div
        className={styles.img}
        style={{
          background: `url(${user.photo}) no-repeat center/cover`,
        }}
      ></div>
      <div>
        <div className={styles.name}>{user.name} </div>
        <div className={styles.winNumber}>{user.winNumber + '分'}</div>
        <div>
          {status === 'draw' && <Badge status="success" text="正在绘画" />}
          {status === 'answer' && <Badge status="warning" text="正在选题" />}
        </div>
      </div>
    </div>
  )
}

export default ParsonCard
