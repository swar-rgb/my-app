import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // ✅ Import this
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

  // const upsertRecord = (data) => {
  //   try {
  //     let updated;
  //     if (data.id) {
  //       updated = records.map((r) => (r.id === data.id ? data : r));
  //     } else {
  //       const nextId = records.length ? Math.max(...records.map((r) => r.id)) + 1 : 1;
  //       updated = [...records, { ...data, id: nextId }];
  //     }
  //     setRecords(updated);
  //     writeDB(updated);
  //     setEditing(null);
  //   } catch (error) {
  //     console.error('Error saving data:', error);
  //   }
  // };

  const upsertRecord = (data) => {
  try {
    // If the record already has an id → it's an edit
    const isEditing = Boolean(data.id);
    let updatedRecords = [];

    if (isEditing) {
      // Replace the existing record with the updated one
      updatedRecords = records.map(record =>
        record.id === data.id ? data : record
      );
    } else {
      // Create a new record with the next available ID
      const maxId = records.length > 0 ? Math.max(...records.map(r => r.id)) : 0;
      const newRecord = { ...data, id: maxId + 1 };
      updatedRecords = [...records, newRecord];
    }

    // Update state and save to "database"
    setRecords(updatedRecords);
    writeDB(updatedRecords);

    // Exit editing mode
    setEditing(null);
  } catch (error) {
    console.error('❌ Error saving data:', error);
  }
};

const location = useLocation();

useEffect(() => {
  try {
    const data = readDB();
    setRecords(data);

    if (location.state && location.state.userToEdit) {
      setEditing(location.state.userToEdit);
    }
  } catch (error) {
    console.error('Error reading DB:', error);
  }
}, [location.state]);


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
