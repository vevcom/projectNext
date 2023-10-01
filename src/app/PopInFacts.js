"use client"

import styles from './PopInFacts.module.scss'
import { useState, useEffect, useRef } from 'react'

function PopInFacts() {
    const facts = ["1500 medlemmer", "stiftet 1919", "En av de eldste linjeforeningene ved ntnu"]
    const intervalDuration = 3000;
    const [currentFact, setCurrentFact] = useState(0)
    const [intervalRef, setIntervalRef] = useState()
    const element = useRef()
    const lightning = useRef()
    useEffect(() => {
        setIntervalRef(
            setInterval(() => {
                element.current.style.transform = "scale(0)"
                setTimeout(() => {
                    element.current.style.transform = "scale(1)"
                    setCurrentFact(current => current >= facts.length - 1 ? 0 : ++current)
                }
                , 500)  
            }, intervalDuration)
        )
        return () => clearInterval(intervalRef)
    }, [element])
    return (
        <div ref={element} className={styles.PopInFacts}>
            <canvas ref={lightning} className={styles.lightning} />
            <div className={styles.text}>{facts[currentFact]}</div>
        </div>
    )
}

export default PopInFacts