"use client"

import styles from './PopInFacts.module.scss'
import { useState, useEffect, useRef } from 'react'

function PopInFacts() {
    const facts = ["1500 medlemmer", "stiftet 1919", "En av de eldste linjeforeningene ved ntnu"]
    const intervalDuration = 3000;
    const [currentFact, setCurrentFact] = useState(0)
    const [intervalRef, setIntervalRef] = useState()
    const element = useRef()
    const text = useRef()
    const lightning = useRef()
    useEffect(() => {
        setIntervalRef(
            setInterval(() => {
                flash()
                setTimeout(() => {
                    makeLightning()
                    text.current.style.transform = "scale(0)"
                    setTimeout(() => {
                        text.current.style.transform = "scale(1)"
                        setCurrentFact(current => current >= facts.length - 1 ? 0 : ++current)
                    }
                    , 300)  
                })
            }, intervalDuration)
        )
        return () => clearInterval(intervalRef)
    }, [element])

    const makeLightning = () => {

    }
    const flash = () => {
        element.current.classList.add(styles.yellow)
        setTimeout(() => element.current.classList.remove(styles.yellow), 100)
    }

    return (
        <div ref={element} className={styles.PopInFacts}>
            <canvas ref={lightning} className={styles.lightning} />
            <div ref={text} className={styles.text}>{facts[currentFact]}</div>
        </div>
    )
}

export default PopInFacts