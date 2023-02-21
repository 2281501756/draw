import { PropsWithChildren } from 'react'
import styles from './index.module.css'

type Props = {
  title: string
  color: string
  img: string
  model?: boolean
  style?: {}
  onclick?: () => void
}

const Botton = ({ title, color, img, model, style, onclick }: PropsWithChildren<Props>) => {
  let buttonClass = styles.button
  if (model) buttonClass += ` ${styles.model}`
  return (
    <button className={buttonClass} style={{ backgroundColor: color, ...style }} onClick={onclick}>
      <img src={import.meta.env.VITE_IMG + img} alt="图片" />
      <strong>{title}</strong>
    </button>
  )
}

export default Botton
