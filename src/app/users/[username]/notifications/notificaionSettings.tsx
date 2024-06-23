'use client'

import { NotificationChannel, NotificationMethod, NotificationMethods, allMethodsOff } from "@/server/notifications/Types"
import { NotificationBranch } from "./Types"
import { Subscription } from "@/server/notifications/subscription/Types"
import { useState } from "react"
import SubscriptionItem from "./subscriptionItem"
import { v4 as uuid } from 'uuid'
import { booleanOperationOnMethods, newAllMethodsOff } from "@/server/notifications/notificationMethodOperations"

function generateChannelTree(channels: NotificationChannel[], subscriptions: Subscription[]): NotificationBranch {
    const rootChannel = channels.find(c => c.special === 'ROOT')
    if (!rootChannel) {
        throw Error('Ingen ROOT varslings kanal')
    }

    function extendChannel(channel: NotificationChannel): NotificationBranch {
        return {
            ...channel,
            children: [],
            subscription: subscriptions.find(s => s.channelId === channel.id)
        }
    }


    const channelTree = extendChannel(rootChannel)

    function searchTree(currentBranch: NotificationBranch) {
        for (let i = 0; i < channels.length; i++) {
            if (channels[i].parentId === currentBranch.id && channels[i].special !== 'ROOT') {
                const obj = extendChannel(channels[i])
                currentBranch.children.push(obj)
                searchTree(obj)
            }
        }
    }

    searchTree(channelTree)

    return channelTree
}

function findBranchInTree(branch: NotificationBranch, branchId: number): NotificationBranch | null {
    if (branch.id === branchId) {
        return branch
    }

    for (let i = 0; i < branch.children.length; i++) {
        const child = findBranchInTree(branch.children[i], branchId)
        if (child) {
            return child
        }
    }

    return null
}

function changeMethodsInBranch(branch: NotificationBranch, newMethods: NotificationMethod): NotificationBranch {
    if (!branch.subscription) {
        branch.subscription = {
            new: true,
            methods: newAllMethodsOff(),
        }
    }

    const changedMethod = booleanOperationOnMethods(
        branch.subscription.methods,
        newMethods,
        'XOR'
    )

    const changedMethodArr = Object
        .entries(changedMethod)
        .filter(([key, value]) => value)
        .map(([key, value]) => key) as NotificationMethods[]

    console.log(branch.name)
    console.log(branch.subscription.methods)
    console.log(newMethods)

    console.log(changedMethodArr)

    function recursiveChange(subBranch: NotificationBranch) {
        for (let method of changedMethodArr) {
            if (!subBranch.availableMethods[method]) {
                continue
            }

            if (newMethods[method] && !subBranch.subscription) {
                subBranch.subscription = {
                    new: true,
                    methods: allMethodsOff,
                }
            }

            if (subBranch.subscription) {
                subBranch.subscription.methods[method] = newMethods[method]
            }
        }

        subBranch.children.forEach(recursiveChange)
    }

    recursiveChange(branch)

    return branch
}

export default function NotificationSettings({
    channels,
    subscriptions,
}: {
    channels: NotificationChannel[],
    subscriptions: Subscription[],
}) {

    const [ channelTree, setChannelTree ] = useState(
        generateChannelTree(channels, subscriptions)
    )

    function handleChange(branchId: number, method: NotificationMethod) {
        const branch = findBranchInTree(channelTree, branchId)
        if (!branch) return

        changeMethodsInBranch(branch, method)

        setChannelTree(channelTree)
    }

    return <tbody>
        <SubscriptionItem
            key={uuid()}
            branch={channelTree}
            onChange={handleChange}
        />
    </tbody>
}