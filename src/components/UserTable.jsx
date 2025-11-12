import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import '../App.css';

export default function UserTable({ records, onEdit, onDelete }) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('id');
  const [sortDir, setSortDir] = useState('asc');

  const handleSort = (key) => {
    const newDir = sortKey === key && sortDir === 'asc' ? 'desc' : 'asc';
    setSortKey(key);
    setSortDir(newDir);
  };

  const handleExport = () => {
    try {
      const ws = XLSX.utils.json_to_sheet(records);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Users');
      const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      saveAs(new Blob([buf]), 'users.xlsx');
    } catch (err) {
      alert('Export failed.');
      console.error(err);
    }
  };

  const sorted = [...records].sort((a, b) => {
    if (a[sortKey] < b[sortKey]) return sortDir === 'asc' ? -1 : 1;
    if (a[sortKey] > b[sortKey]) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const filtered = sorted.filter((r) =>
    Object.values(r).some((v) => v.toString().toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="card">
      <div className="table-toolbar">
        <h3>User List</h3>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={handleExport}>Export</button>
        </div>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            {['id', 'name', 'email', 'phone', 'address'].map((key) => (
              <th key={key} onClick={() => handleSort(key)}>
                {key.toUpperCase()} {sortKey === key ? (sortDir === 'asc' ? '↑' : '↓') : ''}
              </th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length ? (
            filtered.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.name}</td>
                <td>{r.email}</td>
                <td>{r.phone}</td>
                <td>{r.address}</td>
                <td>
                  <button onClick={() => onEdit(r)}>Edit</button>
                  <button className="delete" onClick={() => onDelete(r.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center' }}>
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
