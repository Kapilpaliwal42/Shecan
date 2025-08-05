import React, { useState, useEffect } from 'react';

// Assume apiRoutes.jsx content is available
// We'll import the functions directly for this example.
const API_BASE_URL = 'https://shecan-k2pc.onrender.com';

const registerUser = async ({ name, email, password, refer }) => {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, email, password, refer }) // Pass 'refer' to backend
  });
  return await response.json();
};

const loginUser = async ({ email, password }) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });
  return await response.json();
};

const getMyProfile = async (token) => {
  const response = await fetch(`${API_BASE_URL}/myProfile`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return await response.json();
};

const getUsers = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/getUsers`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`HTTP error! Status: ${response.status}, Body: ${errorText}`);
      try {
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.message || `Server error: ${response.status}`);
      } catch (parseError) {
        throw new Error(`Failed to fetch users: ${errorText || response.statusText}`);
      }
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Error in getUsers API call:", error);
    throw error;
  }
};


// Main App Component
const App = () => {
  const [currentPage, setCurrentPage] = useState('login');
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const fetchUserProfile = async (userToken) => {
    if (!userToken) return;

    setLoading(true);
    try {
      const profileResponse = await getMyProfile(userToken);
      if (profileResponse.data) {
        setUser(profileResponse.data);
      } else {
        setError(profileResponse.message || 'Failed to fetch user profile.');
        localStorage.removeItem('token');
        setToken(null);
        setCurrentPage('login');
      }
    } catch (err) {
      setError('An error occurred while fetching user profile.');
      localStorage.removeItem('token');
      setToken(null);
      setCurrentPage('login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile(token);
  }, [token]);

  const handleLogin = async (email, password) => {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const response = await loginUser({ email, password });
      if (response.token) {
        setToken(response.token);
        localStorage.setItem('token', response.token);
        fetchUserProfile(response.token);
        setCurrentPage('dashboard');
      } else {
        setError(response.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('An error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (name, email, password, refer) => {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const response = await registerUser({ name, email, password, refer });
      if (response.message) {
        setMessage(response.message + ' Please log in.');
        setCurrentPage('login');
      } else {
        setError(response.message || 'Registration failed.');
      }
    } catch (err) {
      setError('An error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    setCurrentPage('login');
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      );
    }

    if (!token || !user) {
      return (
        <AuthPage
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          onLogin={handleLogin}
          onRegister={handleRegister}
          error={error}
          message={message}
        />
      );
    }

    switch (currentPage) {
      case 'dashboard':
        return <Dashboard user={user} onLogout={handleLogout} goToLeaderboard={() => setCurrentPage('leaderboard')} />;
      case 'leaderboard':
        return <Leaderboard token={token} goToDashboard={() => setCurrentPage('dashboard')} />;
      default:
        return <Dashboard user={user} onLogout={onLogout} goToLeaderboard={() => setCurrentPage('leaderboard')} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      {renderContent()}
    </div>
  );
};

const AuthPage = ({ currentPage, setCurrentPage, onLogin, onRegister, error, message }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [refer, setRefer] = useState(''); // New state for referral code

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentPage === 'login') {
      onLogin(email, password);
    } else {
      onRegister(name, email, password, refer); // Pass 'refer' to onRegister
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 space-y-6">
      <h2 className="text-3xl font-bold text-center text-purple-600">
        {currentPage === 'login' ? 'Login' : 'Signup'}
      </h2>
      {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm text-center">{error}</div>}
      {message && <div className="bg-green-100 text-green-700 p-3 rounded-lg text-sm text-center">{message}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {currentPage === 'signup' && (
          <>
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="name">Name</label>
              <input
                className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500"
                id="name"
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="refer">Referral Code (Optional)</label>
              <input
                className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500"
                id="refer"
                type="text"
                placeholder="Enter referral code"
                value={refer}
                onChange={(e) => setRefer(e.target.value)}
              />
            </div>
          </>
        )}
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">Email</label>
          <input
            className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500"
            id="email"
            type="email"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="password">Password</label>
          <input
            className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500"
            id="password"
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
          type="submit"
        >
          {currentPage === 'login' ? 'Login' : 'Signup'}
        </button>
      </form>
      <div className="text-center">
        <button
          className="text-sm text-purple-600 hover:text-purple-800 transition duration-300"
          onClick={() => setCurrentPage(currentPage === 'login' ? 'signup' : 'login')}
        >
          {currentPage === 'login' ? 'Need an account? Sign Up' : 'Already have an account? Log In'}
        </button>
      </div>
    </div>
  );
};

const Dashboard = ({ user, onLogout, goToLeaderboard }) => {
  return (
    <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl p-8 space-y-6">
      <h1 className="text-4xl font-bold text-center text-purple-600">Dashboard</h1>
      <div className="flex justify-center space-x-4">
        <button
          onClick={goToLeaderboard}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
        >
          View Leaderboard
        </button>
        <button
          onClick={onLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300"
        >
          Logout
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
        <div className="bg-gray-50 p-6 rounded-xl shadow-inner">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Intern Profile</h2>
          <p className="text-lg text-gray-600">**Name:** {user.name}</p>
          <p className="text-lg text-gray-600">**Referral Code:** {user.username || 'N/A'}</p>
        </div>
        <div className="bg-gray-50 p-6 rounded-xl shadow-inner">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Donations & Credits</h2>
          <p className="text-lg text-gray-600">**Total Donations Raised:** ${user.Amount ? user.Amount.toFixed(2) : '0.00'}</p>
          <p className="text-lg text-gray-600">**Current Credits:** {user.credit || 0}</p>
        </div>
      </div>
      <div className="bg-purple-50 p-6 rounded-xl shadow-inner">
        <h2 className="text-2xl font-bold text-purple-800 text-center mb-4">Rewards & Unlockables</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <span className="text-4xl">🌟</span>
            <p className="font-bold mt-2">Bronze Badge</p>
            <p className="text-sm text-gray-500">Reach $100 in donations</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <span className="text-4xl">🚀</span>
            <p className="font-bold mt-2">Team Trip</p>
            <p className="text-sm text-gray-500">Reach $500 in donations</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <span className="text-4xl">🏆</span>
            <p className="font-bold mt-2">Top Performer</p>
            <p className="text-sm text-gray-500">Rank in the top 3</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Leaderboard = ({ token, goToDashboard }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getUsers(token);

        if (response.users) {
          if (Array.isArray(response.users)) {
            const sortedUsers = response.users.sort((a, b) => (b.Amount || 0) - (a.Amount || 0));
            setUsers(sortedUsers);
          } else {
            setError('Failed to fetch users: Backend response "users" is not an array.');
            console.error("Leaderboard fetch error: 'users' property is not an array.", response);
          }
        } else {
          setError('Failed to fetch users: Unexpected response format (missing "users" property).');
          console.error("Leaderboard fetch error: Missing 'users' property in response.", response);
        }
      } catch (err) {
        setError(`An error occurred while fetching the leaderboard: ${err.message || 'Unknown error'}`);
        console.error("Leaderboard fetch caught error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  return (
    <div className="w-full max-w-3xl bg-white rounded-xl shadow-2xl p-8 space-y-6">
      <h1 className="text-4xl font-bold text-center text-purple-600">Leaderboard</h1>
      <button
        onClick={goToDashboard}
        className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
      >
        Back to Dashboard
      </button>
      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm text-center">{error}</div>
      ) : (
        <ul className="space-y-4">
          {users.length > 0 ? users.map((user, index) => (
            <li
              key={user._id}
              className="bg-gray-50 rounded-xl p-4 shadow-md flex items-center justify-between transition-transform duration-300 hover:scale-105"
            >
              <div className="flex items-center">
                <span className="text-2xl font-bold text-purple-600 mr-4">{index + 1}.</span>
                <div>
                  <p className="text-xl font-semibold text-gray-800">{user.name}</p>
                  <p className="text-sm text-gray-500">@{user.username}</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-green-600">${user.Amount ? user.Amount.toFixed(2) : '0.00'}</p>
            </li>
          )) : (
            <p className="text-center text-gray-500">No users found on the leaderboard.</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default App;
