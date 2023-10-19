import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Navbar from '@/components/navbar';
import Circle_bg from '@/components/Circle_bg';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import styles from '@/styles/dashboard.module.css'
import Image from 'next/image';

export const Dashboard = (props) => {
    const router = useRouter()
    const [UData, setUData] = useState(null)
    const [user_id, set_user_id] = useState()
    const [transactions, set_transactions] = useState([])
    const reloadData = () => {
        axios.post(`${process.env.NEXT_PUBLIC_API}/layout/user/home`, {}, {
            headers: {
                "auth-token": localStorage.getItem("wallet-auth-token")
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
    const loadTransactions = () => {
        axios.post(`${process.env.NEXT_PUBLIC_API}/layout/user/getTransactions`, {}, {
            headers: {
                "auth-token": localStorage.getItem("wallet-auth-token")
            }
        })
            .then((result) => {
                console.log(result.data.data.transactions)
                set_transactions(result.data.data.transactions)
                set_user_id(result.data.data._id)
            })
            .catch((error) => {
                console.log(error)
                toast.warn(error.message||error.response.data.message)
                router.push('/login')
            })
    }
    useEffect(() => {
        reloadData()
        loadTransactions()
    }, [])
    const cardStyle = {
        padding: '10px',
        paddingTop: '15px',
    };

    const hidedivStyle = {
        fontSize: '14px',
    };

    const showdivStyle = {
        display: 'none',
    };

    const balanceStyle = {
        fontWeight: '700',
    };

    const refreshBalanceStyle = {
        border: 'none',
    };

    const offcanvasBodyStyle = {
        height: 'auto',
        borderTopLeftRadius: '21px',
        borderTopRightRadius: '21px',
    };

    return UData && (
        <div>
            <Navbar />
            <div className="context justify-content-center" style={cardStyle}>

                <div className="card shadow-lg">
                    <div className="card-body">
                        <h5 style={{ fontWeight: 700 }} className="card-title mb-0">
                            {UData?.name}
                        </h5>
                        <div id="hidediv" style={hidedivStyle}>
                            <span id="num">{UData?.phone.substring(0, 3) + 'xxx' + UData?.phone.substring(6)}</span>
                            <button className="btn p-0 px-1" id="show">
                                <i className="fad fa-eye"></i>
                            </button>
                        </div>
                        <div id="showdiv" style={showdivStyle}>
                            <span id="num">{UData.phone}</span>
                            <button className="btn p-0 px-1" id="hide">
                                <i className="fad fa-eye-slash"></i>
                            </button>
                        </div>
                        <div className="d-flex">
                            <h5 id="balance" style={balanceStyle} className="card-title mt-2">
                                ₹{UData.balance || 0}
                            </h5>
                            <button
                                id="refreshBalance"
                                style={refreshBalanceStyle}
                                onClick={reloadData}
                                className="btn py-0 px-1"
                            >
                                <i className="fad fa-sync"></i>
                            </button>
                        </div>
                        <button
                            data-bs-toggle="offcanvas"
                            data-bs-target="#offcanvasBottom"
                            aria-controls="offcanvasBottom"
                            className="btn btn-primary btn-sm"
                        >
                            <i className="fad fa-university"></i> Withdraw Now
                        </button>
                        {/* offcanvas start */}
                        <div
                            style={offcanvasBodyStyle}
                            className="offcanvas offcanvas-bottom"
                            tabIndex="-1"
                            id="offcanvasBottom"
                            aria-labelledby="offcanvasBottomLabel"
                        >
                            <center>
                                <div
                                    data-bs-dismiss="offcanvas"
                                    aria-label="Close"
                                    style={{
                                        height: '4px',
                                        width: '37px',
                                        background: '#d6d6d6',
                                        borderRadius: '10px',
                                        marginTop: '10px',
                                    }}
                                ></div>
                            </center>
                            <div className="offcanvas-header py-0 pt-2">
                                <h6
                                    style={{ fontWeight: 500 }}
                                    className="offcanvas-title fwi"
                                    id="offcanvasBottomLabel"
                                >
                                    <img
                                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrfKQgzFREsB2qfk8WLRqP3EA1sAlgKlCYfA&amp;usqp=CAU"
                                        style={{
                                            height: '30px',
                                            width: '30px',
                                            border: '1px solid #d6d6d6',
                                            padding: '3px',
                                            borderRadius: '50%',
                                        }}
                                        alt=""
                                    />{' '}
                                    Withdraw Money
                                </h6>
                                <hr />
                                <button
                                    style={{ border: 'none' }}
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="offcanvas"
                                    aria-label="Close"
                                ></button>
                            </div>
                            <div className="offcanvas-body small">
                                <div className="mb-3">
                                    <input
                                        style={{ fontWeight: 500 }}
                                        type="number"
                                        className="fwi form-control"
                                        id="paytm"
                                        placeholder="Paytm Number"
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                        style={{ fontWeight: 500 }}
                                        type="number"
                                        className="fwi form-control"
                                        id="amount"
                                        placeholder="Enter Amount"
                                    />
                                </div>
                                <div className="text-end">
                                    <button
                                        id="withdraw"
                                        style={{ fontWeight: 700 }}
                                        className="btn fw mb-3 w-100 btn-warning"
                                    >
                                        <i className="fad fa-university"></i> Withdraw to Paytm
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* offcanvas end */}
                        <img
                            src="/images/rupees.png"
                            style={{
                                height: '200px',
                                width: '200px',
                                position: 'absolute',
                                bottom: '0px',
                                right: '-50px',
                                opacity: '0.6',
                            }}
                            alt=""
                        />
                    </div>
                </div>
                <div className="card cards mt-3">
                    <div className="card-header">
                        <i className="fad fa-clipboard-list"></i> Transactions History
                    </div>
                    <div
                        style={{ maxHeight: '35vh' }}
                        id="historys"
                        className="card-body overflow-scroll p-0"
                    >
                        <center>
                            {!(transactions.length) ? <div><img
                                className="mt-3 mb-2"
                                src="/images/cloud.png"
                                height="80px"
                                alt=""
                            />
                                <h4>No Transactions</h4></div> :
                                <div>
                                    {transactions.map((tData, index) => {
                                        return <div key={index} className={`${styles.transaction_container} ${(tData.user_id == user_id && tData.type == "payout") ? styles['received'] : styles['withdraw']}`}>
                                            <div>
                                                <img src={(tData.user_id == user_id && tData.type == "payout") ? tData.merchant.logo : "/images/deduct_money.png"} />
                                                <div className={styles.transaction_info}>
                                                    <p>{(tData.user_id == user_id && tData.type == "payout") ? `${tData.merchant.name}` : `${tData.paytm_number}`} </p>
                                                    <p>{new Date(tData.time).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })}</p>
                                                </div>
                                                <p className={styles.amount}>
                                                    <b>₹{tData.amount}</b>
                                                </p>
                                            </div>
                                        </div>
                                    })}
                                </div>
                            }
                            <button
                                id="reloadTxn"
                                className="btn mb-3 btn-warning btn-sm"
                                onClick={loadTransactions}
                            >
                                <i className="fad fa-sync-alt"></i> Reload
                            </button>
                        </center>
                    </div>
                </div>
            </div>
            <Circle_bg />
        </div>
    );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
