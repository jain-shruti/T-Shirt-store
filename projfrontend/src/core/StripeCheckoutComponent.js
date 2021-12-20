import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import { isAuthenticated } from '../auth/helper'
import { cartEmpty, loadCart } from './helper/carthelper'
import StripeCheckout from "react-stripe-checkout"
import { API } from '../backend'
import { createOrder } from './helper/orderhelper'

const StripeCheckoutComponent = ({ 
    products, 
    setReload = f => f,
    reload
}) => {
    const [data, setData] = useState({
        loading: false,
        success: false,
        error: "",
        address: ""
    });

    const token = isAuthenticated() && isAuthenticated().token
    const userId = isAuthenticated() && isAuthenticated().user._id

    const getFinalPrice = () => {
        let amount =0 
        products.map((product)=> {
            amount += product.price
        })
        return amount;
    }

    const makePayment = (token) => {
        const body = {
            token,
            products
        }
        const headers ={
            "Content-Type":"application/json"
        }
        return fetch(`${API}/stripepayment`,{
            method: "POST",
            headers,
            body: JSON.stringify(body)
        }).then(response => {
            const {status} = response;
            console.log("Response ",response)
            const orderData = {
                products: products,
                transaction_id: response.id,
                amount: response.amount
            }
            createOrder(userId, token, orderData);
            cartEmpty(() => {
                console.log("Did we got a crash?");
            })
            setReload(!reload)
        }).catch(err => console.log(err))
    }

    const showStripButton = () => {
        return isAuthenticated() ? (
            <StripeCheckout 
            stripeKey="pk_test_51JzwMQSHrRHOCrId2PcYayQuJROXf0RuRO7t65O3qaKa8CAX2B0qpaVpAR13eFKYXyOjqURADy5bKDVBdbRJDcuz00glLe1FBV"
            token={makePayment}
            name="Buy T-shirts"
            amount={getFinalPrice() * 100}
            shippingAddress
            billingAddress
            >
                <button className="btn btn-success">Buy at just ${getFinalPrice()}</button>
            </StripeCheckout>
        ) : (
            <Link to="/signin">
                <button className="btn btn-warning">Signin</button>
            </Link>
        );
    }


    const errorMessage = () =>{ }
    const successMessage = () => {}

    return (
        <div>
            <h3 className="text-white">
                Stripe checkout {getFinalPrice()}
            </h3>
            {showStripButton()}
        </div>
    )
}

export default StripeCheckoutComponent