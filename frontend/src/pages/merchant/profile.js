import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Circle_bg from '@/components/Circle_bg';
import Link from 'next/link';
import Navbar from '@/components/navbar';
import styles from '@/styles/merchant_profile.module.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import image_not_found from '../../../public/images/no_image_available.png';
import Image from 'next/image';
import { useRouter } from 'next/router'; // Import 'next/router'

export const profile = (props) => {
    const router = useRouter();

    const [is_editing_profile, editing_profile] = useState(false);
    const [profile_data, set_profile_data] = useState({});
    const [user_id, set_user_id] = useState('');
    const [transactions, set_transactions] = useState([]);
    const [formData, setFormData] = useState({});

    const inputChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const loadTransactions = () => {
        axios.post(`${process.env.NEXT_PUBLIC_API}/layout/user/getTransactions`, {}, {
            headers: {
                "auth-token": localStorage.getItem("merchant-wallet-auth-token")
            }
        })
            .then((result) => {
                set_transactions(result.data.data.transactions);
                set_user_id(result.data.data._id);
            })
            .catch((error) => {
                console.log(error);
                toast.warn(error.message||error.response.data.message);
                router.push('/login');
            });
    };

    const load_profile = () => {
        axios.post(`${process.env.NEXT_PUBLIC_API}/layout/merchant/getProfile`, {}, {
            headers: {
                "auth-token": localStorage.getItem("merchant-wallet-auth-token")
            }
        })
            .then((result) => {
                set_profile_data(result.data.data);
            })
            .catch((error) => {
                console.log(error);
                toast.warn(error.message||error.response.data.message);
            });
    };

    const handle_submit = (e) => {
        e.preventDefault();
        axios.post(`${process.env.NEXT_PUBLIC_API}/layout/merchant/editProfile`, formData, {
            headers: {
                "auth-token": localStorage.getItem("merchant-wallet-auth-token")
            }
        })
            .then((result) => {
                toast.success(result.data.message);
                set_profile_data(result.data.data);
                editing_profile(false);
                setFormData({});
                load_profile();
            })
            .catch((error) => {
                console.log(error);
                toast.warn(error.message||error.response.data.message);
            });
    };

    useEffect(() => {
        load_profile();
        loadTransactions();
    }, []);

    return profile_data ? (
        <div>
            <Navbar />
            <div className={styles.container}>
                <div className={styles.first_section}>
                    {!is_editing_profile ? (
                        <div className={styles.profile_details_section}>
                            <div className="h-100 w-100">
                                <center>
                                    {profile_data.logo ? (
                                        <img src={profile_data.logo} alt="pic_not_Found" />
                                    ) : (
                                        <Image src={image_not_found} alt="pic_not_Found" />
                                    )}
                                    <h4>{profile_data.name}</h4>
                                    <Link href="/add_balance">
                                        <button
                                            data-bs-toggle="offcanvas"
                                            data-bs-target="#offcanvasBottom"
                                            aria-controls="offcanvasBottom"
                                            className="btn btn-primary btn-sm"
                                        >
                                            Add Fund
                                        </button>
                                    </Link>
                                    <button
                                        id="btn"
                                        className="btn mt-3 btn-primary "
                                        onClick={(e) => {
                                            e.preventDefault();
                                            editing_profile(true);
                                            setFormData({
                                                name: profile_data.name,
                                                logo: profile_data.logo,
                                            });
                                        }}
                                    >
                                        <i className="fa fa-pencil-square" aria-hidden="true"></i> Edit Profile
                                    </button>
                                </center>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.profile_editing_section}>
                            <div className="h-100 w-100">
                                <center>
                                    <form className="p-3" onSubmit={handle_submit}>
                                        <div className={`${styles['form-floating']} mb-3 form-floating`}>
                                            <input
                                                onChange={inputChange}
                                                type="text"
                                                className="form-control"
                                                id="name"
                                                placeholder="Merchant Name"
                                                name="name"
                                                value={formData.name || ''}
                                            />
                                            <label htmlFor="name">
                                                <i className="fad fa-user" style={{ fontSize: '15px' }}></i> Merchant Name
                                            </label>
                                        </div>
                                        <div className={`${styles['form-floating']} mb-3 form-floating`}>
                                            <input
                                                onChange={inputChange}
                                                type="url"
                                                className="form-control"
                                                id="logo"
                                                placeholder="Merchant Logo"
                                                name="logo"
                                                value={formData.logo || ''}
                                            />
                                            <label htmlFor="logo">
                                                <i className="fa fa-id-card" aria-hidden="true" style={{ fontSize: '15px' }}></i> Logo Link
                                            </label>
                                        </div>
                                        {(formData.name !== profile_data.name || formData.logo !== profile_data.logo) && (
                                            <button id="btn" type="submit" className="btn mt-3 w-50 btn-primary mx-1">
                                                <i className="fas fa-lock"></i> Save
                                            </button>
                                        )}
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                editing_profile(false);
                                                setFormData({});
                                            }}
                                            id="btn"
                                            type="submit"
                                            className="btn mt-3 w-50 btn-danger mx-1"
                                        >
                                            <i className="fa fa-ban"></i> Cancel
                                        </button>
                                    </form>
                                </center>
                            </div>
                        </div>
                    )}
                </div>
                <div className={styles.second_section}>
                    <center>
                        {!transactions.length ? (
                            <div>
                                <img
                                    className="mt-3 mb-2"
                                    src="/images/cloud.png"
                                    height="80px"
                                    alt=""
                                />
                                <h4>No Transactions</h4>
                            </div>
                        ) : (
                            <div className={styles.transactions_container}>
                                {transactions.map((tData, index) => (
                                    <div key={index} className={`${styles.transaction_container} ${(tData.user_id === user_id && tData.type === "payout") ? styles['added'] : styles['payout']}`}>
                                        <div>
                                            <img src={(tData.user_id === user_id && tData.type === "payout") ? tData.merchant.logo : "/images/deduct_money.png"} alt="transaction" />
                                            <div className={styles.transaction_info}>
                                                <p>{(tData.user_id !== user_id && tData.type === "payout") ? `Paid to ${tData.wallet_number}` : 'Added to wallet'} </p>
                                                <p>{new Date(tData.time).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })}</p>
                                            </div>
                                            <p className={styles.amount}>
                                                <b>₹{tData.amount}</b>
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
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
            <Circle_bg />
        </div>
    ) : null;
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(profile);
