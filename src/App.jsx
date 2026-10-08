import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/login";
import Signup from "./pages/signup";
import Login from "./pages/login";
import Feed from "./pages/feed";
import Friends from "./pages/friends";
import Logo from "./assets/santaispace.png";

const BASE_URL = `https://social-backend-production-019c.up.railway.app`;
// const BASE_URL = `http://localhost:3000`;
export const ENDPOINTS = {
  signup: `${BASE_URL}/signup`,
  login: `${BASE_URL}/login`,
  posts: `${BASE_URL}/posts`,
  createPost: `${BASE_URL}/posts`,
  users: `${BASE_URL}/users`,
  friends: `${BASE_URL}/friendships`,
};

function RequireAuth({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

function GuestOnly({ children }) {
  const { token } = useAuth();
  return token ? <Navigate to="/feed" replace /> : children;
}

function Nav() {
  const { token, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          to="/feed"
          className="text-xl font-bold tracking-tight text-indigo-600 hover:opacity-90"
        >
          SantaiSpace
        </Link>
        <img src={Logo} style={{ width: "100px" }} />
        <div className="flex items-center gap-6">
          {!token ? (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition shadow-sm"
              >
                Sign up
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/feed"
                className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition"
              >
                Feed
              </Link>
              <Link
                to="/friends"
                className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition"
              >
                Friends
              </Link>
              <button
                onClick={logout}
                className="text-sm font-medium text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-md transition"
              >
                Log out
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
          <Nav />
          <main className="max-w-4xl mx-auto px-4 py-8">
            <Routes>
              <Route
                path="/signup"
                element={
                  <GuestOnly>
                    <Signup />
                  </GuestOnly>
                }
              />
              <Route
                path="/login"
                element={
                  <GuestOnly>
                    <Login />
                  </GuestOnly>
                }
              />
              <Route
                path="/feed"
                element={
                  <RequireAuth>
                    <Feed />
                  </RequireAuth>
                }
              />
              <Route
                path="/friends"
                element={
                  <RequireAuth>
                    <Friends />
                  </RequireAuth>
                }
              />
              <Route path="*" element={<Navigate to="/feed" replace />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
