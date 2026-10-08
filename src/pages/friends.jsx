import { useEffect, useState } from "react";
import { useAuth } from "../context/login";
import { ENDPOINTS } from "../App";

export default function Friends() {
  const { apiFetch } = useAuth();
  const [users, setUsers] = useState([]);
  const [friendshipStatuses, setFriendshipStatuses] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch(ENDPOINTS.users)
      .then((data) => {
        // const usersList = Array.isArray(data) ? data : data.users || [];
        const usersList = data;
        setUsers(usersList);

        // Map initial statuses out of the backend rows into the state dictionary
        const initialStatuses = {};
        usersList.forEach((user) => {
          if (user.friendship_status) {
            initialStatuses[user.user_id] = user.friendship_status;
          }
        });
        setFriendshipStatuses(initialStatuses);
      })
      .catch((err) => setError(err.message));
  }, []);

  async function follow(userId) {
    setError("");
    try {
      const response = await apiFetch(ENDPOINTS.friends, {
        method: "POST",
        body: JSON.stringify({ receiverId: userId }),
      });

      // Handle both backend structures: an object or an array of objects
      // const relationship = Array.isArray(response) ? response[0] : response;
      const relationship = response;
      if (relationship && relationship.status === "accepted") {
        setFriendshipStatuses((prev) => ({ ...prev, [userId]: "accepted" }));
      } else {
        setFriendshipStatuses((prev) => ({ ...prev, [userId]: "pending" }));
      }
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

        {users.map((user) => {
          const status = friendshipStatuses[user.user_id];

          let buttonClass =
            "bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50/50";
          let buttonText = "Add Friend";
          let isButtonDisabled = false;

          if (status === "pending") {
            // Check if the current user was the sender or receiver using the field from our backend join
            if (user.request_sender === user.user_id) {
              // The other user requested to be friend, so we can add them as friend!
              buttonClass =
                "bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700";
              buttonText = "Accept as Friend";
              isButtonDisabled = false;
            } else {
              // We sent the request, so we must wait
              buttonClass =
                "bg-slate-50 text-slate-400 border-slate-200 cursor-default";
              buttonText = "✓ Friend request sent";
              isButtonDisabled = true;
            }
          } else if (status === "accepted") {
            // Show text on button that we are friends
            buttonClass =
              "bg-emerald-50 text-emerald-600 border-emerald-200 cursor-default";
            buttonText = "🤝 Friends";
            isButtonDisabled = true;
          }

          return (
            <div
              key={user.user_id}
              className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition"
            >
              {/* ... Profile avatar and text ... */}
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
                onClick={() => follow(user.user_id)}
                disabled={isButtonDisabled}
                className={`text-xs font-semibold px-4 py-2 rounded-lg border transition shadow-sm ${buttonClass}`}
              >
                {buttonText}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
