import React from 'react';
import './OrderDetailsForm.css';

type Props = {
  orderId: number;
  onDone?: () => void;
};

const OrderDetailsForm: React.FC<Props> = ({ orderId, onDone }) => {
  const [form, setForm] = React.useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [submitting, setSubmitting] = React.useState(false);
  const [msg, setMsg] = React.useState<string | null>(null);

  const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY as string | undefined;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);

    if (!accessKey) {
      setMsg('Missing Web3Forms access key. Please set VITE_WEB3FORMS_ACCESS_KEY in your .env.local');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        access_key: accessKey,
        subject: `New UnPrint3D Order #${orderId}`,
        from_name: 'UnPrint3D',
        email: form.email, // allows autoresponder
        orderId,
        name: form.name,
        phone: form.phone,
        address: form.address,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
      } as Record<string, any>;

      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setMsg('Details sent successfully. Please check your email for confirmation.');
        onDone?.();
      } else {
        setMsg(data.message || 'Failed to send details.');
      }
    } catch (err: any) {
      setMsg(err?.message || 'Network error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="order-details-form">
      <h3>Enter your details for shipping/confirmation</h3>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        </div>
        <div className="row">
          <input name="phone" placeholder="Phone (optional)" value={form.phone} onChange={handleChange} />
        </div>
        <textarea name="address" placeholder="Address" value={form.address} onChange={handleChange} required />
        <div className="row">
          <input name="city" placeholder="City" value={form.city} onChange={handleChange} required />
          <input name="state" placeholder="State" value={form.state} onChange={handleChange} required />
          <input name="pincode" placeholder="Pincode" value={form.pincode} onChange={handleChange} required />
        </div>
        <button type="submit" disabled={submitting}>{submitting ? 'Sending...' : 'Send Details'}</button>
      </form>
      {msg && <p className="message">{msg}</p>}
      {!accessKey && (
        <p className="warning">Note: Set VITE_WEB3FORMS_ACCESS_KEY in .env.local to enable form submission.</p>
      )}
    </div>
  );
};

export default OrderDetailsForm;
