import { PropsWithChildren } from 'react'
import styles from './index.module.css'

type Props = {
  title: string
  color: string
  img: string
  model?: boolean
  onclick?: () => void
}

const Botton = ({ title, color, img, model, onclick }: PropsWithChildren<Props>) => {
  let buttonClass = styles.button
  if (model) buttonClass += ` ${styles.model}`
  return (
    <button className={buttonClass} style={{ backgroundColor: color }} onClick={onclick}>
      <img src={img} alt="图片" />
      <strong>{title}</strong>
    </button>
  )
}

export default Botton
