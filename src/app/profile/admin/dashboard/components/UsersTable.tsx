"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { FaTrash } from "react-icons/fa";
type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
  rollNumber?: string; // ✅ add this
  phone?: string;
};

export default function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/users");
      
      setUsers(res.data);
    } catch (error) {
      toast.error("Failed to load users.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      toast.success("User deleted");
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  const handleVerify = async (id: string) => {
    try {
      await axios.patch(`/api/users/${id}/verify`);
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, isVerified: true } : u))
      );
      toast.success("User verified");
    } catch (error) {
      toast.error("Failed to verify user");
    }
  };

  const filteredUsers = users.filter((u) =>
    `${u.name}${u.rollNumber} ${u.email}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mb-8">
      <h3 className="text-lg font-semibold mb-4">👤 All Users</h3>

      <input
        type="text"
        placeholder="Search by name or email..."
        className="mb-4 p-2 w-full border rounded-md"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <table className="w-full text-sm text-left border">
        <thead className="bg-gray-100">
          <tr>
          <th className="p-2">RollNumber</th>
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Role</th>
            <th className="p-2">Phone</th>
            <th className="p-2">Verified</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((u) => (
            <tr key={u.id} className="border-t">
              <td className="p-2">{u.rollNumber}</td>
              <td className="p-2">{u.name}</td>
              <td className="p-2">{u.email}</td>
              <td className="p-2 capitalize">{u.role}</td>
              <td className="p-2 capitalize">{u.phone}</td>

              <td className="p-2">
                {u.isVerified ? (
                  <span className="text-green-600 font-semibold">Yes</span>
                ) : (
                  <span className="text-red-500 font-semibold">No</span>
                )}
              </td>
              <td className="p-2 space-x-2">
                {!u.isVerified && (
                  <button
                    className="text-sm px-2 py-1 bg-blue-500 text-white rounded"
                    onClick={() => handleVerify(u.id)}
                  >
                    Verify
                  </button>
                )}
                <button
                  className="text-sm px-2 py-1 bg-red-500 text-white rounded"
                  onClick={() => handleDelete(u.id)}
                  title="Delete User"
                >
                  <FaTrash className="w-4 h-4"/> 
                </button>
              </td>
            </tr>
          ))}
          {filteredUsers.length === 0 && (
            <tr>
              <td className="p-4 text-center" colSpan={5}>
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
