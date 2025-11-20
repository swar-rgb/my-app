import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { readDB, writeDB } from '../utils/db';
import UserTable from './UserTable';
import '../App.css';

export default function TablePage({ onLogout }) {
  const [records, setRecords] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const data = readDB();
      setRecords(data);
    } catch (error) {
      console.error('Error loading table data:', error);
      alert('Error loading data from database.');
    }
  }, []);

  const handleDelete = (id) => {
    try {
      const updated = records.filter((r) => r.id !== id);
      setRecords(updated);
      writeDB(updated);
    } catch (err) {
      console.error('Error deleting record:', err);
      alert('Failed to delete record.');
    }
  };

  // ✔ Clean edit handler — no alert
  const handleEdit = (record) => {
    navigate('/dashboard', { state: { userToEdit: record } });
  };

  return (
    <div className="table-page">
      <div className="toolbar">
        <button onClick={() => navigate('/dashboard')}>⬅ Back to Dashboard</button>
        <strong>User Data Table</strong>
        <button onClick={onLogout}>Logout</button>
      </div>

      <UserTable records={records} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
}
