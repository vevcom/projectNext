'use client'
import ProfilePicture from '@/components/User/ProfilePicture'
import styles from '@/app/navnquiz/[groupId]/page.module.scss'
import { confetti } from '@/components/UI/Confetti'
import React, { useState, useEffect } from 'react'
import type { UserFiltered } from '@/services/users/types'
import type { Image } from '@prisma/client'

type PropTypes = {
    users:UserFiltered[], //liste av brukere
    profileImages: Image[] //liste profilbilder
}
//bruker ikke nå, viser en alert med brukerens navn
// function f(name: string) {
//     alert(`Hei ${name}`)
// }

//let om vi vil endre den på et tidspunkt - bruker kun å sette boks radius til fargen den har.
const clicked = true
const borderColour = { '--border-colour': 'blue' } as React.CSSProperties
// if (clicked) {
//     borderColour = { '--border-colour': 'orange' } as React.CSSProperties
// }

export default function Knapper({ users, profileImages }: PropTypes) {
//navneknapp
    //type = string eller null (ikke valgt enda), initial condition = null. ikke valgt.

    //const [stateVariable, setStateFunction] = useState(initialValue)
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null) //number/null -> typen til useState

    //profilbilde - samme oppsett som knappene.
    const [selectedProfileId, setSelectedProfileId] = useState<number | null>(null)

    const [score, setScore] = useState(0) //setter en score

    const [isCorrect, setIsCorrect] = useState<boolean| null>(null) //border

    useEffect(() => {
        //runs on the first render
        if (selectedUserId !== null && selectedProfileId !== null) { //om 1 av dem er null - ingenting skal returneres
            if (selectedUserId === selectedProfileId) {
                setScore(prev => prev + 1)
                //state - grønn
                setIsCorrect(true) //setter isCorrect true - match
                confetti()
            } else {
                if (score > 0) { //unngå minuspoeng
                    setScore(prev => prev - 1)
                }
                setIsCorrect(false) // ikke match
            }
            //vente litt, så resette
            const timer = setTimeout(() => {
                setSelectedUserId(null) //for å resette, sjekk om like og når ferdig - sett de tilbake til null
                setSelectedProfileId(null)
                setIsCorrect(null)
            }, 300)
        }
    }, [selectedUserId, selectedProfileId]) //any time dependency value changes

    function getUserButtonClass(userId: number) {
        if (selectedUserId !== userId) {
            return styles.boksNavnDefault
        }

        if (isCorrect === true) {
            return styles.correct
        }

        if (isCorrect === false) {
            return styles.wrong
        }

        return styles.boksNavnClicked
    }

    function getUserProfileClass(userId: number) {
        if (selectedProfileId !== userId) {
            return styles.profilepictureclass
        }

        if (isCorrect === true) {
            return styles.correct2
        }

        if (isCorrect === false) {
            return styles.wrong2
        }

        return styles.profilepictureclass2
    }


    return (
        <div className={styles.container}>
            <p>Score: {score}</p>

            <div>
                {users.map(user => (
                    <button
                        key={user.id}
                        className={
                            //selectedUserId === user.id//om knapp valgt, styles.boksNavn2 else->styles.boksNavn
                            getUserButtonClass(user.id)

                        }
                        //syntaks: () tom parameterliste => her kommer funksjons kroppen, setSelectedUserId(user.id) fun kjør
                        //onClick={() => setSelectedUserId(user.id)}
                        onClick={() => {
                            setSelectedUserId(prev => {
                                if (prev === user.id) {
                                    return null
                                }
                                return user.id
                            }
                            )
                            //checkMatch(selectedUserId, user.id)
                        }}
                    >
                        {user.firstname} {user.lastname}
                    </button>
                ))}
            </div>

            <div>
                {users.map((user, i) => (
                    <button
                        key={user.id}
                        className={
                            styles.boksBilde
                        }
                        //onClick={() => setSelectedProfileId(user.id)}
                        onClick={() => {
                            setSelectedProfileId(prev => {
                                if (prev === user.id) { //knapp allerede valgt - setter user.id til null - ingen knapp valgt
                                    return null
                                }
                                return user.id //vi setter knappen som skal velges
                            }
                            )
                            //checkMatch(selectedProfileId, user.id)
                        }}
                    >
                        <ProfilePicture
                            className={
                                getUserProfileClass(user.id)
                            }
                            width={100}
                            profileImage={profileImages[i]}
                        />
                    </button>
                ))}
            </div>

        </div>
    )
}

//function Poeng({selectedUserId,selectedProfileId}) {
//}

