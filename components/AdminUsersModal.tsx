"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Users,
  UserPlus,
  Trash2,
  Shield,
  UserCheck,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Loader2,
  RefreshCw,
  Search,
} from "lucide-react";

interface SafeUser {
  id: string;
  username: string;
  fullName: string;
  role: "admin" | "editor" | "user";
  createdAt: string;
}

interface AdminUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserId?: string;
  onToast?: (message: string) => void;
}

export default function AdminUsersModal({
  isOpen,
  onClose,
  currentUserId,
  onToast,
}: AdminUsersModalProps) {
  const [activeTab, setActiveTab] = useState<"list" | "create">("list");
  const [users, setUsers] = useState<SafeUser[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Create user form state
  const [newUsername, setNewUsername] = useState("");
  const [newFullName, setNewFullName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<"editor" | "admin" | "user">("editor");
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Deleting state
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoadingList(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "प्रयोगकर्ता सूची लोड गर्न सकिएन");
      }
      setUsers(data.users || []);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
      setErrorMsg(null);
      setSuccessMsg(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!newUsername.trim() || !newPassword.trim()) {
      setErrorMsg("प्रयोगकर्ताको नाम र पासवर्ड अनिवार्य छ");
      return;
    }

    if (newUsername.trim().length < 3) {
      setErrorMsg("Username कम्तिमा ३ अक्षरको हुनुपर्छ");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg("पासवर्ड कम्तिमा ६ अक्षरको हुनुपर्छ");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: newUsername.trim(),
          fullName: newFullName.trim(),
          password: newPassword,
          role: newRole,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "प्रयोगकर्ता सिर्जना गर्न सकिएन");
      }

      setSuccessMsg(`प्रयोगकर्ता '@${data.user.username}' सफलतापूर्वक थपियो!`);
      if (onToast) {
        onToast(`नयाँ प्रयोगकर्ता '@${data.user.username}' थपियो`);
      }

      // Reset form
      setNewUsername("");
      setNewFullName("");
      setNewPassword("");
      setNewRole("editor");

      // Refresh list and switch to list tab after short delay
      await fetchUsers();
      setTimeout(() => {
        setActiveTab("list");
        setSuccessMsg(null);
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || "समस्या आयो");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (userId: string, username: string) => {
    if (!window.confirm(`के तपाईं निश्चित हुनुहुन्छ? प्रयोगकर्ता '@${username}' मेटाइनेछ ।`)) {
      return;
    }

    setDeletingId(userId);
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "प्रयोगकर्ता मेटाउन सकिएन");
      }

      setUsers((prev) => prev.filter((u) => u.id !== userId));
      if (onToast) {
        onToast(`प्रयोगकर्ता '@${username}' हटाइयो`);
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4.5 bg-gradient-to-r from-slate-900 to-brand-950 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold flex items-center gap-2">
                <span>प्रयोगकर्ता व्यवस्थापन (User Management)</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold">
                  Admin Only
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                नयाँ प्रयोगकर्ताहरू थप्नुहोस् वा विद्यमान खाताहरू व्यवस्थापन गर्नुहोस्
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-2">
          <button
            onClick={() => {
              setActiveTab("list");
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`pb-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === "list"
                ? "border-brand-800 text-brand-900"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>प्रयोगकर्ताहरूको सूची (Users List)</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-slate-200 text-slate-700 rounded-full font-bold">
              {users.length}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab("create");
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`pb-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === "create"
                ? "border-brand-800 text-brand-900"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <UserPlus className="w-4 h-4 text-emerald-600" />
            <span>नयाँ प्रयोगकर्ता थप्नुहोस् (Add New User)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-start gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs flex items-start gap-2 animate-fade-in">
              <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {activeTab === "list" ? (
            <div className="space-y-3">
              {/* Search & Refresh */}
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="नाम वा युजरनेम खोज्नुहोस् (Search users)..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:border-brand-600"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
                <button
                  onClick={fetchUsers}
                  disabled={loadingList}
                  title="रिफ्रेस गर्नुहोस्"
                  className="p-2 border border-slate-300 rounded-xl text-slate-600 hover:bg-slate-100 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingList ? "animate-spin" : ""}`} />
                </button>
              </div>

              {/* Users Table / List */}
              {loadingList ? (
                <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2">
                  <Loader2 className="w-6 h-6 animate-spin text-brand-700" />
                  <p className="text-xs">लोड हुँदैछ...</p>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  कुनै प्रयोगकर्ता फेला परेन
                </div>
              ) : (
                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-600 font-bold">
                        <th className="py-2.5 px-4">प्रयोगकर्ता (User)</th>
                        <th className="py-2.5 px-3">भूमिका (Role)</th>
                        <th className="py-2.5 px-3 hidden sm:table-cell">दर्ता मिति (Created)</th>
                        <th className="py-2.5 px-4 text-right">कार्य (Action)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredUsers.map((u) => {
                        const isSelf = currentUserId === u.id;
                        const isDefaultAdmin = u.username.toLowerCase() === "admin";
                        return (
                          <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center text-xs">
                                  {u.username.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <p className="font-bold text-slate-800 flex items-center gap-1.5">
                                    <span>{u.fullName || u.username}</span>
                                    {isSelf && (
                                      <span className="text-[10px] text-brand-800 bg-brand-50 border border-brand-200 px-1.5 py-0.2 rounded font-semibold">
                                        You
                                      </span>
                                    )}
                                  </p>
                                  <p className="text-[11px] text-slate-400">@{u.username}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-3">
                              {u.role === "admin" ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                                  <Shield className="w-3 h-3" />
                                  Admin
                                </span>
                              ) : u.role === "editor" ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300">
                                  <UserCheck className="w-3 h-3" />
                                  Editor
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-300">
                                  User
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-3 hidden sm:table-cell text-slate-500 text-[11px]">
                              {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "-"}
                            </td>
                            <td className="py-3 px-4 text-right">
                              {isDefaultAdmin ? (
                                <span className="text-[10px] text-slate-400 italic">Protected</span>
                              ) : isSelf ? (
                                <span className="text-[10px] text-slate-400 italic">Current</span>
                              ) : (
                                <button
                                  onClick={() => handleDeleteUser(u.id, u.username)}
                                  disabled={deletingId === u.id}
                                  title="प्रयोगकर्ता हटाउनुहोस्"
                                  className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                                >
                                  {deletingId === u.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                                  ) : (
                                    <Trash2 className="w-4 h-4" />
                                  )}
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            /* Add New User Form */
            <form onSubmit={handleCreateUser} className="space-y-4 max-w-lg mx-auto py-2">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
                यहाँबाट थपिएका प्रयोगकर्ताले सीधै आफ्नो Username र Password बाट लगइन गर्न सक्छन्।
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  प्रयोगकर्ताको नाम (Username) *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="उदा: editor_ram (कम्तिमा ३ अक्षर)"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:border-brand-600 pl-10"
                    required
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  पूरा नाम (Full Name)
                </label>
                <input
                  type="text"
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  placeholder="उदा: राम शर्मा"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:border-brand-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    भूमिका (User Role) *
                  </label>
                  <select
                    value={newRole}
                    onChange={(e: any) => setNewRole(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold outline-none focus:border-brand-600"
                  >
                    <option value="editor">सम्पादक (Editor - News Creator)</option>
                    <option value="admin">प्रशासक (Admin - Full Access)</option>
                    <option value="user">साधारण प्रयोगकर्ता (User)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    पासवर्ड (Password) *
                  </label>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="कम्तिमा ६ अक्षर"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:border-brand-600 pl-10 pr-10"
                      required
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-gradient-to-r from-brand-900 to-brand-800 hover:from-brand-950 hover:to-brand-900 text-white font-bold text-xs rounded-xl shadow-lg shadow-brand-900/25 active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <UserPlus className="w-4 h-4 text-emerald-400" />
                  )}
                  <span>नयाँ प्रयोगकर्ता थप्नुहोस् (Create User)</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 transition-all"
          >
            बन्द गर्नुहोस् (Close)
          </button>
        </div>
      </div>
    </div>
  );
}
