import { useEffect, useState } from "react";
import { useAuth } from "../context/login";
import { ENDPOINTS } from "../App";

export default function Friends() {
  console.log("this is called");
  const { apiFetch } = useAuth();
  const [users, setUsers] = useState([]);
  const [followed, setFollowed] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch(ENDPOINTS.users)
      .then((data) => setUsers(Array.isArray(data) ? data : data.users || []))
      .catch((err) => setError(err.message));
  }, []);

  async function follow(userId) {
    setError("");
    try {
      await apiFetch(ENDPOINTS.friends, {
        method: "POST",
        body: JSON.stringify({ friend_id: userId }),
      });
      setFollowed({ ...followed, [userId]: true });
    } catch (err) {
      console.log(err);
      setError(err.message);
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950 tracking-tight">
          Discover People
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Connect with other accounts to view their private updates.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 text-rose-600 text-sm font-medium rounded-lg border border-rose-100">
          {error}
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100 shadow-sm overflow-hidden">
        {users.length === 0 && (
          <p className="text-sm text-slate-500 text-center py-8">
            No other users found.
          </p>
        )}

        {users.map((user) => (
          <div
            key={user.id}
            className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-between text-white text-sm font-bold justify-center uppercase select-none">
                {(user.username || user.email).substring(0, 2)}
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-slate-800 text-sm">
                  {user.username || "User"}
                </span>
                <span className="text-xs text-slate-400">{user.email}</span>
              </div>
            </div>

            <button
              onClick={() => follow(user.id)}
              disabled={followed[user.id]}
              className={`text-xs font-semibold px-4 py-2 rounded-lg border transition shadow-sm ${
                followed[user.id]
                  ? "bg-slate-50 text-slate-400 border-slate-200 cursor-default"
                  : "bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50/50"
              }`}
            >
              {followed[user.id] ? "✓ Following" : "Follow"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
