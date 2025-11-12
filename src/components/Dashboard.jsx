import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Import this
import { readDB, writeDB } from '../utils/db';
import UserForm from './UserForm';
import '../App.css';

export default function Dashboard({ onLogout }) {
  const [records, setRecords] = useState([]);
  const [editing, setEditing] = useState(null);
  const navigate = useNavigate(); // ✅ Create a navigation hook

  useEffect(() => {
    try {
      const data = readDB();
      setRecords(data);
    } catch (error) {
      console.error('Error reading DB:', error);
    }
  }, []);

  const upsertRecord = (data) => {
    try {
      let updated;
      if (data.id) {
        updated = records.map((r) => (r.id === data.id ? data : r));
      } else {
        const nextId = records.length ? Math.max(...records.map((r) => r.id)) + 1 : 1;
        updated = [...records, { ...data, id: nextId }];
      }
      setRecords(updated);
      writeDB(updated);
      setEditing(null);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  return (
    <div className="dashboard">
      <div className="toolbar">
        <strong>Welcome, Admin</strong>
        <div className="actions">
          {/* ✅ This button navigates to /table */}
          <button onClick={() => navigate('/table')}>View User Table</button>
          <button onClick={onLogout}>Logout</button>
        </div>
      </div>

      <div className="columns">
        <div className="left-column">
          <UserForm onSubmit={upsertRecord} editing={editing} onCancel={() => setEditing(null)} />
        </div>
      </div>
    </div>
  );
}
