import styles from './index.module.less'
import { Stage, Layer, Line, Rect } from 'react-konva'
import { useRef, useState } from 'react'
import ColorBox from './ColorBox/ColorBox'
import { config } from './colorBox.config'
import { Slider, Button, Modal } from 'antd'
import { useDownload } from '../../hooks/useDownload'
type LineType = {
  stroke: string
  points: number[]
  strokeWidth: number
  x: number
  y: number
  did: number
}

const GameCanvas = () => {
  const [data, setData] = useState<LineType[]>([])
  const [isEnter, setIsEnter] = useState(false)
  const [drawColor, setDrawColor] = useState('#020000')
  const [drawStroke, setDrawStroke] = useState(3)
  const stageRef = useRef<any>(null)
  const handleMouseDown = (e: any) => {
    setIsEnter(true)
    console.log(e.evt)
    let newLine: LineType = {
      did: Date.now(),
      x: e.evt.layerX,
      y: e.evt.layerY,
      points: [],
      stroke: drawColor,
      strokeWidth: drawStroke,
    }
    setData([...data, newLine])
  }
  const handleMouseMove = (e: any) => {
    if (isEnter) {
      let t = [...data]
      t[t.length - 1].points = [
        ...t[t.length - 1].points,
        e.evt.layerX - t[t.length - 1].x,
        e.evt.layerY - t[t.length - 1].y,
      ]
      setData(t)
    }
  }
  const handleMouseUp = (e: any) => {
    setIsEnter(false)
    console.log('起来了')
  }
  const checkSave = () => {
    const uri = stageRef.current.toDataURL()
    useDownload(uri)
  }

  const checkColor = (color: string) => {
    setDrawColor(color)
  }
  const checkStroke = (n: number) => {
    setDrawStroke(n)
  }
  const checkRemake = () => {
    setData([])
  }
  const [showModal, setShowModal] = useState(false)
  return (
    <div className={styles.box}>
      <div className={styles.colorToolkit}>
        <div className={styles.color}>
          {config.map((i) => (
            <ColorBox
              key={i.id}
              color={i.color}
              onclick={checkColor}
              active={drawColor === i.color}
            ></ColorBox>
          ))}
        </div>
        <div className={styles.box2}>
          <div className={styles.size}>
            <div className={styles.big}></div>
            <Slider
              style={{ height: 100, display: 'inline-block' }}
              vertical
              min={1}
              max={20}
              defaultValue={3}
              onChange={checkStroke}
            />
            <div className={styles.small}></div>
          </div>
          <div className={styles.buttonBox}>
            <Button type="primary" danger size="small" onClick={checkRemake}>
              重置
            </Button>
            <Button
              type="primary"
              style={{ backgroundColor: '#3271ae' }}
              size="small"
              onClick={() => setShowModal(true)}
            >
              下载
            </Button>
            <Button type="primary" style={{ backgroundColor: '#a6559d' }} size="small">
              上传
            </Button>
          </div>
        </div>
      </div>
      <Stage
        width={780}
        height={470}
        ref={stageRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Layer>
          <Rect x={0} y={0} width={780} height={470} fill="#fff" cornerRadius={15}></Rect>
          {data.map((i) => (
            <Line key={i.did} {...i}></Line>
          ))}
        </Layer>
      </Stage>
      <Modal
        title="下载提示"
        open={showModal}
        onOk={checkSave}
        okText="下载"
        cancelText="取消"
        onCancel={() => {
          setShowModal(false)
        }}
      >
        <p>你确定要下载到本地吗？</p>
      </Modal>
    </div>
  )
}

export default GameCanvas
