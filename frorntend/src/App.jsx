import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

export default function App() {
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentTitle, setPaymentTitle] = useState('');
  const [paymentRecords, setPaymentRecords] = useState([]);

  const fetchPayments = async () => {
    try {
      const response = await axios.get('https://money-management-server.vercel.app/api/payments');
      setPaymentRecords(response.data);
    } catch (err) {
      console.error("Error fetching payments:", err);
    }
  };

  const addPayment = async () => {
    if (paymentAmount === 0) {
      alert("Please enter a valid amount");
      return;
    }
    if (!paymentTitle.trim()) {
      alert("Please enter a title for the payment");
      return;
    }
    try {
      const newPayment = { title: paymentTitle, amount: paymentAmount, type: 'add' };
      await axios.post('https://money-management-server.vercel.app/api/payments', newPayment);
      setPaymentAmount(0);
      setPaymentTitle('');
      fetchPayments();
    } catch (err) {
      console.error("Error adding payment:", err);
    }
  };

  // const subtractPayment = async () => {
  //   if (paymentAmount === 0) {
  //     alert("Please enter a valid amount");
  //     return;
  //   }
  //   if (!paymentTitle.trim()) {
  //     alert("Please enter a title for the payment");
  //     return;
  //   }
  //   try {
  //     const newPayment = { title: paymentTitle, amount: paymentAmount, type: 'subtract' };
  //     await axios.post('https://money-management-server.vercel.app/api/payments', newPayment);
  //     setPaymentAmount(0);
  //     setPaymentTitle('');
  //     fetchPayments();
  //   } catch (err) {
  //     console.error("Error subtracting payment:", err);
  //   }
  // };

  // const editPayment = async (id, updatedAmount) => {
  //   try {
  //     const updatedPayment = { amount: updatedAmount, type: 'add' };
  //     await axios.put(`https://money-management-server.vercel.app/api/payments/${id}`, updatedPayment);
  //     fetchPayments();
  //   } catch (err) {
  //     console.error("Error editing payment:", err);
  //   }
  // };

  const deletePayment = async (id) => {
    try {
      await axios.delete(`https://money-management-server.vercel.app/api/payments/${id}`);
      fetchPayments();
    } catch (err) {
      console.error("Error deleting payment:", err);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <div className="payment-tracker-container">
      <h2 className="payment-tracker-heading">Payment Tracker</h2>
      <div className="payment-tracker-form">
        <input
          type="text"
          value={paymentTitle}
          onChange={(e) => setPaymentTitle(e.target.value)}
          placeholder="Enter title"
          className="payment-tracker-input"
        />
        <input
          type="number"
          value={paymentAmount}
          onChange={(e) => setPaymentAmount(e.target.value)}
          placeholder="Enter amount"
          className="payment-tracker-input"
        />
        <button onClick={addPayment} className="payment-tracker-button add">Add Payment</button>
        {/* <button onClick={subtractPayment} className="payment-tracker-button subtract">Subtract Payment</button> */}
      </div>

      {paymentRecords.length > 0 ? (
        <div className="payment-records-container">
          <h3 className="payment-records-heading">Payment Records</h3>
          <ul className="payment-records-list">
            {paymentRecords.map((record) => (
              <li key={record._id} className="payment-record-item">
                <span className='payment-record'>{record.title}</span>
                <span className={record.type === 'payment-record subtract' ? 'payment-record negative' : 'payment-record'}>
                  {record.type === 'add' ? `+${record.amount}` : `-${record.amount}`}
                </span>
                <div className="payment-record-actions">
                  {/* <button onClick={() => editPayment(record._id, record.amount + 10)} className="payment-record-button edit">Edit</button> */}
                  <button onClick={() => deletePayment(record._id)} className="payment-record-button delete">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="payment-records-empty">No payment records yet.</p>
      )}
    </div>
  );
}
