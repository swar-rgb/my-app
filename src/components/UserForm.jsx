import React, { useState, useEffect } from 'react';
import '../App.css';

export default function UserForm({ onSubmit, editing, onCancel }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' });

  useEffect(() => {
    if (editing) setForm(editing);
  }, [editing]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm({ name: '', email: '', phone: '', address: '' });
  };

  return (
    <div className="card">
      <h3>{editing ? 'Edit User' : 'Add User'}</h3>
      <form className="form" onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required />
        <input name="address" placeholder="Address" value={form.address} onChange={handleChange} required />
        <button type="submit">{editing ? 'Update' : 'Add'}</button>
        {editing && <button onClick={onCancel}>Cancel</button>}
      </form>
    </div>
  );
}
