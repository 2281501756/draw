import styles from './index.module.css'
import classnames from 'classnames'

type Props = {
  color: string
  active?: boolean
  onclick: (color: string) => void
}

const ColorBox = ({ color, active, onclick }: Props) => {
  return (
    <div
      className={classnames(styles.box, { [styles.active]: active })}
      style={{ backgroundColor: color }}
      onClick={() => {
        onclick(color)
      }}
    ></div>
  )
}

export default ColorBox
