import { useEffect, useState, type FormEvent } from "react";
import { api, authUrl, setToken, err } from "./api";
import type { Customer, Account } from "./types";

export default function App() {
  const [t, setT] = useState(false);
  const [user, setUser] = useState("");
  const [page, setPage] = useState<"customers" | "accounts">("customers");
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("demo");
  const [password, setPassword] = useState("Demo@123");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);

  const [cf, setCf] = useState({
    name: "",
    email: "",
    dateOfBirth: "",
    gender: "Female",
    city: ""
  });

  const [af, setAf] = useState({
    customerId: 1,
    accountType: "SAVINGS",
    openingDate: new Date().toISOString().slice(0, 10),
    balance: 0
  });

  async function load() {
    setError("");
    setLoading(true);
    try {
      if (page === "customers") {
        const res = await api.get<Customer[]>("/api/v1/customers");
        setCustomers(res.data);
      } else {
        const res = await api.get<Account[]>("/api/v1/accounts");
        setAccounts(res.data);
      }
    } catch (e) {
      setError(err(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (t) void load();
  }, [t, page]);

  useEffect(() => {
    const onAuthExpired = () => {
      setT(false);
      setToken(null);
      setUser("");
    };
    window.addEventListener("auth-expired", onAuthExpired);
    return () => window.removeEventListener("auth-expired", onAuthExpired);
  }, []);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setNotice("");
    setLoading(true);
    try {
      if (mode === "register") {
        const r = await fetch(authUrl + "/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password })
        });
        const d = await r.text();
        if (!r.ok) throw Error(d);
        setNotice(d + " — sign in now.");
        setMode("login");
      } else {
        const r = await fetch(authUrl + "/auth/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password })
        });
        const d = (await r.text()).trim();
        if (!r.ok) throw Error(d);
        if (d.split(".").length !== 3) throw Error("Auth service did not return a valid JWT token.");
        setToken(d);
        setT(true);
        setUser(username);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  async function create(e: FormEvent) {
    e.preventDefault();
    setError("");
    setNotice("");
    try {
      if (page === "customers") {
        await api.post("/api/v1/customers", cf);
        setCf({ name: "", email: "", dateOfBirth: "", gender: "Female", city: "" });
      } else {
        await api.post("/api/v1/accounts", af);
        setAf({ ...af, balance: 0 });
      }
      setNotice("Record created successfully.");
      await load();
    } catch (e) {
      setError(err(e));
    }
  }

  // Calculate stats
  const totalBalance = accounts.reduce((acc, curr) => acc + (curr.balance || 0), 0);

  if (!t) {
    return (
      <main className="login">
        <form className="login-card shadow-lg" onSubmit={submit}>
          <div className="brand mb-4">
            <span className="logo">B</span>
            <div>
              <h4 className="mb-0 font-extrabold" style={{ fontWeight: 800 }}>Apex Bank Portal</h4>
              <small style={{ color: "#64748b", fontWeight: 600 }}>MICROSERVICES PLATFORM</small>
            </div>
          </div>

          <h2 className="h4" style={{ fontWeight: 800, marginTop: 10 }}>
            {mode === "login" ? "Sign in to Dashboard" : "Create Bank Admin"}
          </h2>
          <p style={{ color: "#64748b", fontSize: 13, marginBottom: 20 }}>
            Secure JWT access for bank account & customer operations.
          </p>

          {error && <div className="alert alert-danger py-2">{error}</div>}
          {notice && <div className="alert alert-success py-2">{notice}</div>}

          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              className="form-control"
              minLength={3}
              placeholder="e.g. demo"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              minLength={6}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Authenticating..." : mode === "login" ? "Sign In" : "Register Account"}
          </button>

          <button
            type="button"
            className="btn btn-link w-100 mt-2 text-decoration-none"
            style={{ fontSize: 13 }}
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setError("");
              setNotice("");
            }}
          >
            {mode === "login" ? "Need an admin account? Register" : "Already registered? Back to Sign In"}
          </button>

          {mode === "login" && (
            <div className="demo mt-3 text-center" style={{ background: "#f8fafc", padding: "10px", borderRadius: "10px", border: "1px dashed #cbd5e1" }}>
              <span style={{ fontSize: 12, color: "#64748b" }}>Demo credentials: </span>
              <strong style={{ fontSize: 12 }}>demo</strong> / <strong style={{ fontSize: 12 }}>Demo@123</strong>
            </div>
          )}
        </form>
      </main>
    );
  }

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand mb-4">
          <span className="logo">B</span>
          <div>
            <b>Apex Banking</b>
            <small>ENTERPRISE</small>
          </div>
        </div>

        <p className="nav-label">Management</p>
        <button
          className={"nav-item " + (page === "customers" ? "active" : "")}
          onClick={() => setPage("customers")}
        >
          <span>👥</span> Customers
        </button>
        <button
          className={"nav-item " + (page === "accounts" ? "active" : "")}
          onClick={() => setPage("accounts")}
        >
          <span>💳</span> Bank Accounts
        </button>

        <div className="sidebar-foot">
          <div className="user-badge">
            <div className="user-avatar">{user.charAt(0).toUpperCase()}</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{user}</div>
              <div style={{ fontSize: 10, color: "#94a3b8" }}>Administrator</div>
            </div>
          </div>
          <button
            className="btn btn-sm btn-outline-danger"
            style={{ fontSize: 12, padding: "4px 10px" }}
            onClick={() => {
              setToken(null);
              setT(false);
              setUser("");
            }}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="content">
        <header className="topbar">
          <div className="system-status">
            <div className="status-dot"></div>
            <span>Microservices Gateway: Connected</span>
          </div>
          <small style={{ color: "#64748b", fontWeight: 600 }}>Port: 8765 (Gateway) • Auth: 9898</small>
        </header>

        <section className="page">
          <div className="page-header d-flex justify-content-between align-items-center">
            <div>
              <div className="eyebrow">{page === "customers" ? "CLIENT PORTFOLIO" : "FINANCIAL LEDGER"}</div>
              <h1>{page === "customers" ? "Customer Directory" : "Account Ledger"}</h1>
              <p style={{ color: "#64748b", margin: 0 }}>
                {page === "customers"
                  ? "View and onboard clients across the banking microservices system."
                  : "Manage savings, checking, and fixed deposit accounts."}
              </p>
            </div>
            <button className="btn btn-outline-primary" onClick={() => void load()} disabled={loading}>
              🔄 {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {/* Quick Metrics / Stats Bar */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon primary">👥</div>
              <div>
                <div className="stat-label">Total Customers</div>
                <div className="stat-val">{customers.length}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon success">💳</div>
              <div>
                <div className="stat-label">Active Accounts</div>
                <div className="stat-val">{accounts.length}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon warning">💰</div>
              <div>
                <div className="stat-label">Total Liquidity</div>
                <div className="stat-val">
                  {totalBalance.toLocaleString("en-IN", { style: "currency", currency: "INR" })}
                </div>
              </div>
            </div>
          </div>

          {error && <div className="alert alert-danger py-2 mb-4">{error}</div>}
          {notice && <div className="alert alert-success py-2 mb-4">{notice}</div>}

          {/* Form + Table Section */}
          <div className="row g-4">
            {/* Action Form */}
            <div className="col-12 col-xl-4">
              <form className="panel" onSubmit={create}>
                <h5>{page === "customers" ? "✨ Onboard Customer" : "✨ Open New Account"}</h5>
                {page === "customers" ? (
                  <>
                    <div className="mb-3">
                      <label className="form-label">Full Name</label>
                      <input
                        className="form-control"
                        placeholder="e.g. Rahul Sharma"
                        value={cf.name}
                        onChange={(e) => setCf({ ...cf, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Email Address</label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="name@domain.com"
                        value={cf.email}
                        onChange={(e) => setCf({ ...cf, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Date of Birth</label>
                      <input
                        type="date"
                        className="form-control"
                        value={cf.dateOfBirth}
                        onChange={(e) => setCf({ ...cf, dateOfBirth: e.target.value })}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Gender</label>
                      <select
                        className="form-select"
                        value={cf.gender}
                        onChange={(e) => setCf({ ...cf, gender: e.target.value })}
                      >
                        <option>Female</option>
                        <option>Male</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="mb-4">
                      <label className="form-label">City / Branch</label>
                      <input
                        className="form-control"
                        placeholder="e.g. Mumbai"
                        value={cf.city}
                        onChange={(e) => setCf({ ...cf, city: e.target.value })}
                        required
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-3">
                      <label className="form-label">Customer ID</label>
                      <input
                        type="number"
                        min="1"
                        className="form-control"
                        value={af.customerId}
                        onChange={(e) => setAf({ ...af, customerId: Number(e.target.value) })}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Account Type</label>
                      <select
                        className="form-select"
                        value={af.accountType}
                        onChange={(e) => setAf({ ...af, accountType: e.target.value })}
                      >
                        <option value="SAVINGS">Savings Account</option>
                        <option value="CURRENT">Current / Checking</option>
                        <option value="FIXED_DEPOSIT">Fixed Deposit</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Opening Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={af.openingDate}
                        onChange={(e) => setAf({ ...af, openingDate: e.target.value })}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="form-label">Initial Balance (INR)</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        className="form-control"
                        value={af.balance}
                        onChange={(e) => setAf({ ...af, balance: Number(e.target.value) })}
                        required
                      />
                    </div>
                  </>
                )}
                <button className="btn btn-primary w-100">
                  {page === "customers" ? "Register Customer" : "Create Bank Account"}
                </button>
              </form>
            </div>

            {/* Data Table */}
            <div className="col-12 col-xl-8">
              <section className="panel">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="m-0">
                    {page === "customers" ? "Registered Customers" : "Active Bank Accounts"}
                  </h5>
                  <span className="badge bg-light text-dark border px-3 py-2" style={{ borderRadius: 20 }}>
                    {page === "customers" ? customers.length : accounts.length} records found
                  </span>
                </div>

                <div className="table-responsive">
                  {page === "customers" ? (
                    <table className="table align-middle">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Customer Name</th>
                          <th>Email</th>
                          <th>DOB</th>
                          <th>Gender</th>
                          <th>City</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customers.map((c) => (
                          <tr key={c.customerId}>
                            <td><span className="badge-id">#{c.customerId}</span></td>
                            <td style={{ fontWeight: 600 }}>{c.name}</td>
                            <td style={{ color: "#64748b" }}>{c.email}</td>
                            <td>{c.dateOfBirth}</td>
                            <td>{c.gender}</td>
                            <td><span className="badge bg-secondary-subtle text-secondary px-2 py-1">{c.city}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <table className="table align-middle">
                      <thead>
                        <tr>
                          <th>Account #</th>
                          <th>Cust ID</th>
                          <th>Type</th>
                          <th>Opening Date</th>
                          <th className="text-end">Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {accounts.map((a) => (
                          <tr key={a.accountno}>
                            <td><span className="badge-id">ACC-{a.accountno}</span></td>
                            <td>#{a.customerId}</td>
                            <td>
                              <span className={`badge-tag ${a.accountType === "SAVINGS" ? "savings" : a.accountType === "CURRENT" ? "current" : "fixed"}`}>
                                {a.accountType}
                              </span>
                            </td>
                            <td>{a.openingDate}</td>
                            <td className="text-end" style={{ fontWeight: 700, color: "#166534" }}>
                              {a.balance.toLocaleString("en-IN", { style: "currency", currency: "INR" })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {((page === "customers" && customers.length === 0) ||
                    (page === "accounts" && accounts.length === 0)) && (
                    <div className="text-center py-5">
                      <div style={{ fontSize: 40, marginBottom: 10 }}>📂</div>
                      <p className="text-muted m-0">No records found. Use the onboarding form to add your first record.</p>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
