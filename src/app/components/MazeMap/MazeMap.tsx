'use client'

import style from './MazeMap.module.scss'

type PropTypes = {
    height: string
    campusId?: number,
    zLevel?: number,
    center?: {
        x: number,
        y: number,
    },
    zoom?: number,
    sharePoi?: number,
}

export default function MazeMap({
    height,
    campusId = 1, // gløs <3
    zLevel = -1,
    center = {
        x: 10.402228,
        y: 63.418368,
    },
    zoom = 18,
    sharePoi = 83, // lophtet <3
}: PropTypes) {
    return <div className={style.MazeMapWrapper} style={{ height }}>
        <iframe 
            src={
                `https://use.mazemap.com/embed.html#v=1&` +
                `campusid=${campusId}&`+
                `zlevel=${zLevel}&` +
                `center=${center.x},${center.y}&` +
                `zoom=${zoom}&` +
                `sharepoitype=poi&` +
                `sharepoi=${sharePoi}&` +
                `utm_medium=iframe`
            
            }
            className={style.MazeMap}
        />
    </div>
}