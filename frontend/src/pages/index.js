import { useRouter } from 'next/router'
import React from 'react'
import dashboard from './dashboard'
import Dashboard from './dashboard'

export default function index() {
    const router = useRouter()
    return (
        <><Dashboard /></>
    )
};