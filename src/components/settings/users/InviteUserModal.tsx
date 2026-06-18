"use client";

import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onInvite?: (email: string, role: string) => void;
}

export default function InviteUserModal({ open, onClose, onInvite }: Props) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("AUDITOR");

  if (!open) return null;

  const handleInvite = () => {
    if (email.trim()) {
      onInvite?.(email.trim(), role);
      setEmail("");
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3>Invite User</h3>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <select value={role} onChange={(e) => setRole(e.target.value)} style={styles.input}>
          <option value="AUDITOR">Auditor</option>
          <option value="MEMBER">Accountant</option>
        </select>

        <div style={styles.actions}>
          <button onClick={onClose}>Cancel</button>
          <button style={styles.invite} onClick={handleInvite}>Invite</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed" as const,
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  modal: {
    background: "#fff",
    padding: 24,
    borderRadius: 14,
    width: 400,
    display: "flex",
    flexDirection: "column" as const,
    gap: 12,
  },

  input: {
    height: 42,
    padding: "0 12px",
  },

  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 12,
  },

  invite: {
    background: "#1e3a8a",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: 10,
  },
};