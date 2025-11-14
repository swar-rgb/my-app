import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { readDB, writeDB } from '../utils/db';
import * as XLSX from 'xlsx';
import '../App.css';

export default function UserTable() {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const navigate = useNavigate();

  // ✅ Load records when component mounts
  useEffect(() => {
    try {
      const data = readDB();
      setRecords(data);
    } catch (error) {
      console.error('Error loading records:', error);
    }
  }, []);

  // ✅ Search Filter
  const filtered = records.filter((record) =>
    Object.values(record)
      .join(' ')
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // ✅ Sorting Logic
  const sorted = [...filtered].sort((a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    return sortOrder === 'asc'
      ? nameA.localeCompare(nameB)
      : nameB.localeCompare(nameA);
  });

  // ✅ Delete Record
  const handleDelete = (id) => {
    try {
      const updated = records.filter((record) => record.id !== id);
      setRecords(updated);
      writeDB(updated);
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };

  // ✅ Export to Excel
  const exportToExcel = () => {
    try {
      const ws = XLSX.utils.json_to_sheet(records);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Users');
      XLSX.writeFile(wb, 'UserData.xlsx');
    } catch (error) {
      console.error('Error exporting Excel:', error);
    }
  };

  // ✅ Edit Handler (redirect to Dashboard)
  const handleEdit = (user) => {
    try {
      navigate('/dashboard', { state: { userToEdit: user } });
    } catch (error) {
      console.error('Error navigating to Dashboard:', error);
    }
  };

  return (
    <div className="table-container">
      <h2>User Records</h2>

      <div className="toolbar">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
          Sort by Name ({sortOrder === 'asc' ? '↓' : '↑'})
        </button>
        <button onClick={exportToExcel}>Export to Excel</button>
        <button onClick={() => navigate('/dashboard')}>Add New User</button>
      </div>

      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sorted.length > 0 ? (
            sorted.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.address}</td>
                <td>
                  <button onClick={() => handleEdit(user)}>Edit</button>
                  <button onClick={() => handleDelete(user.id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No records found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
