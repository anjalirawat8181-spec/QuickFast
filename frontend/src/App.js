import { useState, useEffect } from "react";

const locations = [
  "Andheri","Bandra","Dadar","Borivali",
  "Kurla","Thane","Ghatkopar","Powai","Vashi","CST"
];

function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [results, setResults] = useState([]);
  const [selectedRide, setSelectedRide] = useState(null);

  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);

  // Load user from browser
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(savedUser);
  }, []);

  // LOGIN
  const handleLogin = () => {
    if (!email || !password) {
      alert("Enter email and password");
      return;
    }

    localStorage.setItem("user", email);
    setUser(email);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  // ROUTE LOGIC
  const handleSearch = () => {
    if (!from || !to) {
      alert("Enter locations");
      return;
    }

    const distance = Math.abs(from.length - to.length) + 5;

    const data = [
      { mode: "Cab", time: distance * 2, cost: distance * 20, color:"#2563eb" },
      { mode: "Train", time: distance * 3, cost: distance * 5, color:"#16a34a" },
      { mode: "Walk", time: distance * 6, cost: 0, color:"#6b7280" },
    ];

    setResults(data);
  };

  const cheapest = results.reduce(
    (min, item) => (item.cost < min.cost ? item : min),
    results[0] || {}
  );

  const fastest = results.reduce(
    (min, item) => (item.time < min.time ? item : min),
    results[0] || {}
  );

  // 🔐 LOGIN PAGE
  if (!user) {
    return (
      <div style={page}>
        <div style={app}>
          <h2>Login</h2>

          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={input}
          />

          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={input}
          />

          <button style={button} onClick={handleLogin}>
            Login
          </button>
        </div>
      </div>
    );
  }

  // 🚕 BOOKING PAGE
  if (selectedRide) {
    return (
      <div style={page}>
        <div style={app}>
          <h2>Confirm Booking</h2>

          <p><b>From:</b> {from}</p>
          <p><b>To:</b> {to}</p>
          <p><b>Ride:</b> {selectedRide.mode}</p>
          <p><b>Cost:</b> ₹{selectedRide.cost}</p>

          <button style={button}>Confirm Ride</button>

          <button
            style={{...button, background:"#aaa"}}
            onClick={() => setSelectedRide(null)}
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  // 🚀 MAIN APP
  return (
    <div style={page}>
      <div style={app}>
        <h1>QuickFast</h1>
        <p style={{color:"#6b7280"}}>Welcome, {user}</p>

        <button onClick={handleLogout} style={logout}>
          Logout
        </button>

        <input
          placeholder="From"
          value={from}
          onChange={(e) => {
            const val = e.target.value;
            setFrom(val);
            setFromSuggestions(locations.filter(l => l.toLowerCase().includes(val.toLowerCase())));
          }}
          style={input}
        />

        {fromSuggestions.map((item, i) => (
          <div key={i} style={dropdown} onClick={() => {
            setFrom(item);
            setFromSuggestions([]);
          }}>{item}</div>
        ))}

        <input
          placeholder="To"
          value={to}
          onChange={(e) => {
            const val = e.target.value;
            setTo(val);
            setToSuggestions(locations.filter(l => l.toLowerCase().includes(val.toLowerCase())));
          }}
          style={input}
        />

        {toSuggestions.map((item, i) => (
          <div key={i} style={dropdown} onClick={() => {
            setTo(item);
            setToSuggestions([]);
          }}>{item}</div>
        ))}

        <button style={button} onClick={handleSearch}>
          Find Routes
        </button>

        {results.map((item, i) => (
          <div key={i} style={{
            ...card,
            borderLeft: `6px solid ${item.color}`
          }}>
            <h3>{item.mode}</h3>
            <p>Time: {item.time} min</p>
            <p>Cost: {item.cost === 0 ? "Free" : `₹${item.cost}`}</p>

            {item.mode === cheapest.mode && <p style={{color:"#16a34a"}}>Cheapest</p>}
            {item.mode === fastest.mode && <p style={{color:"#2563eb"}}>Fastest</p>}

            {item.mode === "Cab" && (
              <button style={button} onClick={() => setSelectedRide(item)}>
                Book Cab
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* STYLES */

const page = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg, #eef2ff, #f8fafc)"
};

const app = {
  width: "380px",
  padding: "30px",
  borderRadius: "20px",
  background: "#fff",
  boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
  textAlign: "center"
};

const input = {
  width: "100%",
  padding: "12px",
  margin: "8px 0",
  borderRadius: "10px",
  border: "1px solid #ddd"
};

const dropdown = {
  background: "#f1f5f9",
  padding: "8px",
  borderRadius: "6px",
  marginBottom: "5px",
  cursor: "pointer"
};

const button = {
  width: "100%",
  padding: "12px",
  marginTop: "10px",
  borderRadius: "10px",
  border: "none",
  background: "#2563eb",
  color: "#fff",
  cursor: "pointer"
};

const logout = {
  background: "#ef4444",
  color: "white",
  border: "none",
  padding: "6px 10px",
  borderRadius: "6px",
  marginBottom: "10px",
  cursor: "pointer"
};

const card = {
  marginTop: "10px",
  padding: "15px",
  borderRadius: "12px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
  textAlign: "left"
};

export default App;