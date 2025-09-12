import React, { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js'
import axios from 'axios'
import { toast } from 'react-toastify'

// Load Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHED_KEY)

// Payment Form Component
const PaymentForm = ({ appointment, token, BackendURL, onPaymentSuccess, onCancel }) => {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [clientSecret, setClientSecret] = useState('')

  useEffect(() => {
    // Create payment intent when component mounts
    createPaymentIntent()
  }, [])

  const createPaymentIntent = async () => {
    try {
      const { data } = await axios.post(
        BackendURL + '/api/payment/create-payment-intent',
        { appointmentId: appointment._id },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (data.success) {
        setClientSecret(data.clientSecret)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error('Failed to initialize payment')
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!stripe || !elements || !clientSecret) {
      return
    }

    setIsLoading(true)

    const cardElement = elements.getElement(CardElement)

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: appointment.userData.name,
            email: appointment.userData.email,
          },
        },
      })

      if (error) {
        toast.error(error.message)
      } else if (paymentIntent.status === 'succeeded') {
        // Confirm payment on backend
        const { data } = await axios.post(
          BackendURL + '/api/payment/confirm-payment',
          {
            paymentIntentId: paymentIntent.id,
            appointmentId: appointment._id
          },
          { headers: { Authorization: `Bearer ${token}` } }
        )

        if (data.success) {
          toast.success('Payment successful!')
          onPaymentSuccess()
        } else {
          toast.error(data.message)
        }
      }
    } catch (error) {
      console.log(error)
      toast.error('Payment failed')
    } finally {
      setIsLoading(false)
    }
  }

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
    },
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Complete Payment</h2>
        <div className="text-sm text-gray-600 mb-4">
          <p><strong>Doctor:</strong> Dr. {appointment.docData.name}</p>
          <p><strong>Specialty:</strong> {appointment.docData.speciality}</p>
          <p><strong>Amount:</strong> ${appointment.amount}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Details
          </label>
          <div className="border border-gray-300 rounded-md p-3">
            <CardElement options={cardElementOptions} />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={!stripe || isLoading}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : `Pay $${appointment.amount}`}
          </button>
          
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md font-medium hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

// Main Payment Modal Component
const PaymentModal = ({ appointment, token, BackendURL, isOpen, onClose, onPaymentSuccess }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Payment</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ×
            </button>
          </div>
        </div>
        
        <div className="p-4">
          <Elements stripe={stripePromise}>
            <PaymentForm
              appointment={appointment}
              token={token}
              BackendURL={BackendURL}
              onPaymentSuccess={() => {
                onPaymentSuccess()
                onClose()
              }}
              onCancel={onClose}
            />
          </Elements>
        </div>
      </div>
    </div>
  )
}

export default PaymentModal