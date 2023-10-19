import { useRouter } from 'next/router'
import React from 'react'

export default function index() {
    const router = useRouter()
    router.push('/dashboard')
}
