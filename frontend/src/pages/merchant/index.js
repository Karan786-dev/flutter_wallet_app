import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import Navbar from '@/components/navbar'
import Circle_bg from '@/components/Circle_bg'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import axios from 'axios'
import styles from '@/styles/merchant_dash.module.css'
import Link from 'next/link'


export const index = (props) => {
    const router = useRouter()
    const [UData, setUData] = useState(null)
    const [guidToken, setguidToken] = useState('')
    const reloadData = () => {
        axios
            .post(`${process.env.NEXT_PUBLIC_API}/layout/merchant/home`, {}, {
                headers: {
                    "auth-token": localStorage.getItem("merchant-wallet-auth-token")
                }
            })
            .then((result) => {
                setUData(result.data.data)
            })
            .catch((error) => {
                console.log(error)
                toast.warn(error.message||error.response.data.message)
                router.push('/login')
            })
    }
    const generateNewToken = () => {
        axios.post(`${process.env.NEXT_PUBLIC_API}/layout/merchant/generateNewToken`, {}, {
            headers: {
                "auth-token": localStorage.getItem("merchant-wallet-auth-token")
            }
        })
            .then((result) => {
                setguidToken(result.data.token)
                toast.success(result.data.message)
            })
            .catch((error) => {
                console.log(error)
                toast.warn(error.message||error.response.data.message)
            })
    }

    const getToken = () => {
        axios.post(`${process.env.NEXT_PUBLIC_API}/layout/merchant/getToken`, {}, {
            headers: {
                "auth-token": localStorage.getItem("merchant-wallet-auth-token")
            }
        })
            .then((result) => {
                toast.success(result.data.message)
                setguidToken(result.data.token)
            })
            .catch((error) => {
                console.log(error)
                toast.warn(error.message||error.response.data.message)
            })
    }
    useEffect(() => {
        reloadData()
    }, [])
    return UData && (
        <div>
            <Navbar />
            <div className={styles.container}>
                <center>
                    <div className={styles.first_container}>
                        <center className='h-100'>
                            <div className={styles.first_section}>
                                <div className={styles.balance_container}>
                                    <div className={`card ${styles.card}`}>
                                        Funds<br /> Available <br /> {UData.balance || 0}&#8377;
                                        
                                    </div>
                                </div>
                                <div className={styles.payout_container}>
                                    <div className={`card ${styles.card}`}>
                                        Total<br /> Payout <br /> {UData.total_payout || 0}&#8377;
                                    </div>
                                </div>
                            </div>

                        </center>
                    </div>
                    <div className={styles.second_container}>
                        <center>
                            <div className={styles.token_container}>
                                <h4>Payment Token</h4>
                                <p>A Secret token of your merchant account for payment APIs</p>
                                <div className={styles.input_container}>
                                    {guidToken ? <input value={guidToken} /> : <button type='button' className='my-2 btn  btn-primary ' onClick={() => getToken()}>Get Token</button>}
                                    <br />
                                    <button className='my-2 btn  btn-primary ' type='button' onClick={() => generateNewToken()}>Generate Token</button>
                                </div>
                            </div>
                        </center>
                    </div>
                    <div className={styles.third_container}>
                        <center>
                            <div className={styles.api_container}>
                                <h5>Check Balance</h5>
                                <input value={`${process.env.NEXT_PUBLIC_API}/merchant/api/check_balance?guid={guid}`} />
                                <h5>Payout</h5>
                                <input value={`${process.env.NEXT_PUBLIC_API}/merchant/api/pay?guid={guid}&mobile={wallet_number}&comment={comment}&amount={amount}`} />
                            </div>
                        </center>
                    </div>
                </center>
            </div>
            <Circle_bg />
        </div>
    )
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(index)