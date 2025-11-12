import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { readDB, writeDB } from '../utils/db';
import UserTable from './UserTable';
import '../App.css';

export default function TablePage({ onLogout }) {
  const [records, setRecords] = useState([]);
  const navigate = useNavigate();

  // Load user data from localStorage
  useEffect(() => {
    try {
      const data = readDB();
      setRecords(data);
    } catch (error) {
      console.error('Error loading table data:', error);
      alert('Error loading data from database.');
    }
  }, []);

  // Handle deleting a record
  const handleDelete = (id) => {
    try {
      if (!window.confirm('Are you sure you want to delete this record?')) return;
      const updated = records.filter((r) => r.id !== id);
      setRecords(updated);
      writeDB(updated);
    } catch (err) {
      console.error('Error deleting record:', err);
      alert('Failed to delete record.');
    }
  };

  // Optionally handle edit — for now, it just logs
  const handleEdit = (record) => {
    console.log('Edit clicked:', record);
    alert('Editing directly from table is disabled. Go to Dashboard to edit users.');
  };

  return (
    <div className="table-page">
      {/* Top toolbar */}
      <div className="toolbar">
        <button onClick={() => navigate('/dashboard')}>⬅ Back to Dashboard</button>
        <strong>User Data Table</strong>
        <button onClick={onLogout}>Logout</button>
      </div>

      {/* Table display */}
      <UserTable records={records} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
}
