import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";

type User = {
  id: string;
  name: string;
  email: string;
  role?: string;
  blocked?: boolean;
};

type Property = {
  id: string;
  title: string;
  city: string;
  price: number;
  status: "pending" | "approved" | "rejected";
  description?: string;
};

type Booking = {
  id: string;
  user: string;
  property: string;
  from: string;
  to: string;
  status: string;
};

type Review = {
  id: string;
  user: string;
  property: string;
  rating: number;
  comment: string;
};

const sampleUsers: User[] = [
  { id: "u1", name: "Alice Johnson", email: "alice@example.com" },
  { id: "u2", name: "Bob Smith", email: "bob@example.com" },
  { id: "u3", name: "Chen Li", email: "chen@example.com" },
];

const sampleProperties: Property[] = [
  { id: "p1", title: "Cozy Downtown Studio", city: "Boston", price: 120, status: "pending", description: "Bright studio close to public transit." },
  { id: "p2", title: "Seaside Bungalow", city: "San Diego", price: 230, status: "approved", description: "Ocean views and private patio." },
  { id: "p3", title: "Mountain Cabin", city: "Aspen", price: 300, status: "pending", description: "Rustic cabin with fireplace." },
];

const sampleBookings: Booking[] = [
  { id: "b1", user: "Alice Johnson", property: "Cozy Downtown Studio", from: "2026-03-01", to: "2026-03-05", status: "confirmed" },
  { id: "b2", user: "Bob Smith", property: "Seaside Bungalow", from: "2026-04-10", to: "2026-04-15", status: "pending" },
];

const sampleReviews: Review[] = [
  { id: "r1", user: "Alice Johnson", property: "Seaside Bungalow", rating: 5, comment: "Amazing stay!" },
  { id: "r2", user: "Chen Li", property: "Mountain Cabin", rating: 4, comment: "Cozy place, great host." },
];

const revenueData = [1200, 1500, 1800, 1700, 2400, 2100, 2600, 3000, 2800, 3200, 3600, 4000];

const AdminDashboard: React.FC = () => {
  const [active, setActive] = useState<string>("overview");
  const [users, setUsers] = useState<User[]>(sampleUsers);
  const [properties, setProperties] = useState<Property[]>(sampleProperties);
  const [bookings] = useState<Booking[]>(sampleBookings);
  const [reviews] = useState<Review[]>(sampleReviews);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const role = localStorage.getItem("role");
    setIsAdmin(role === "admin");
  }, []);

  const totals = useMemo(() => {
    return {
      users: users.length,
      properties: properties.length,
      bookings: bookings.length,
      revenue: revenueData.reduce((a, b) => a + b, 0),
    };
  }, [users, properties, bookings]);

  function toggleBlock(userId: string) {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, blocked: !u.blocked } : u)));
  }

  function deleteUser(userId: string) {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  }

  function openProperty(p: Property) {
    setSelectedProperty(p);
    setIsModalOpen(true);
  }

  function closeModal() {
    setSelectedProperty(null);
    setIsModalOpen(false);
  }

  function updatePropertyStatus(id: string, status: Property["status"]) {
    setProperties((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <main className="container mx-auto p-6">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6 text-center">
            <h2 className="text-2xl font-semibold text-slate-800">Access denied</h2>
            <p className="mt-2 text-slate-600">You must be signed in as an admin to view this page.</p>
            <div className="mt-4">
              <a href="/login" className="inline-block px-4 py-2 bg-primary-600 text-white rounded shadow">Go to Login</a>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <aside className="col-span-12 lg:col-span-3">
            <div className="sticky top-6 space-y-4">
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-lg font-semibold text-slate-800">Admin Panel</h3>
                <p className="text-sm text-slate-500">Manage EasyStay content and users</p>
              </div>

              <nav className="bg-white rounded-lg shadow p-3 space-y-1">
                {[
                  { id: "overview", label: "Overview" },
                  { id: "users", label: "Users" },
                  { id: "properties", label: "Properties" },
                  { id: "bookings", label: "Bookings" },
                  { id: "reviews", label: "Reviews" },
                  { id: "reports", label: "Reports" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActive(item.id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      active === item.id ? "bg-primary-50 text-primary-700" : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>

              <div className="bg-white rounded-lg shadow p-4">
                <h4 className="text-sm font-medium text-slate-700">Quick Actions</h4>
                <div className="mt-3 flex flex-col gap-2">
                  <button className="px-3 py-2 bg-primary-600 text-white rounded">Create Announcement</button>
                  <button className="px-3 py-2 border border-slate-200 rounded text-slate-700">Export CSV</button>
                </div>
              </div>
            </div>
          </aside>

          {/* Main */}
          <section className="col-span-12 lg:col-span-9">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-slate-800">Dashboard</h1>
              <div className="text-sm text-slate-500">Welcome back, Admin</div>
            </div>

            {/* Overview */}
            {active === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-sm text-slate-500">Total Users</div>
                    <div className="mt-2 text-2xl font-bold text-slate-800">{totals.users}</div>
                  </div>
                  <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-sm text-slate-500">Properties</div>
                    <div className="mt-2 text-2xl font-bold text-slate-800">{totals.properties}</div>
                  </div>
                  <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-sm text-slate-500">Bookings</div>
                    <div className="mt-2 text-2xl font-bold text-slate-800">{totals.bookings}</div>
                  </div>
                  <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-sm text-slate-500">Revenue (YTD)</div>
                    <div className="mt-2 text-2xl font-bold text-slate-800">${totals.revenue.toLocaleString()}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="lg:col-span-2 bg-white rounded-lg shadow p-4">
                    <h3 className="text-lg font-medium text-slate-800">Revenue</h3>
                    <p className="text-sm text-slate-500 mt-1">Monthly earnings overview</p>
                    <div className="mt-4">
                      <RevenueChart data={revenueData} />
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-4">
                    <h3 className="text-lg font-medium text-slate-800">Recent Activity</h3>
                    <ul className="mt-3 space-y-3 text-sm text-slate-600">
                      <li>New property submitted: <strong>Cozy Downtown Studio</strong></li>
                      <li>User <strong>Bob Smith</strong> requested payout</li>
                      <li>Booking confirmed: <strong>Alice Johnson</strong></li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Users */}
            {active === "users" && (
              <div className="space-y-4">
                <div className="bg-white rounded-lg shadow p-4">
                  <h3 className="text-lg font-medium text-slate-800">Users</h3>
                  <p className="text-sm text-slate-500">Manage user accounts</p>
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="text-slate-500 text-left">
                        <tr>
                          <th className="py-2">Name</th>
                          <th className="py-2">Email</th>
                          <th className="py-2">Role</th>
                          <th className="py-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="text-slate-700">
                        {users.map((u) => (
                          <tr key={u.id} className="border-t border-slate-100">
                            <td className="py-3">{u.name}</td>
                            <td className="py-3">{u.email}</td>
                            <td className="py-3">{u.role ?? "guest"}</td>
                            <td className="py-3">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => toggleBlock(u.id)}
                                  className={`px-3 py-1 rounded text-sm ${u.blocked ? "bg-yellow-100 text-yellow-800" : "bg-slate-100 text-slate-700"}`}
                                >
                                  {u.blocked ? "Unblock" : "Block"}
                                </button>
                                <button onClick={() => deleteUser(u.id)} className="px-3 py-1 rounded text-sm bg-red-50 text-red-700">
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Properties */}
            {active === "properties" && (
              <div className="space-y-4">
                <div className="bg-white rounded-lg shadow p-4">
                  <h3 className="text-lg font-medium text-slate-800">Properties</h3>
                  <p className="text-sm text-slate-500">Approve or reject property listings</p>
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="text-slate-500 text-left">
                        <tr>
                          <th className="py-2">Title</th>
                          <th className="py-2">City</th>
                          <th className="py-2">Price</th>
                          <th className="py-2">Status</th>
                          <th className="py-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="text-slate-700">
                        {properties.map((p) => (
                          <tr key={p.id} className="border-t border-slate-100">
                            <td className="py-3">{p.title}</td>
                            <td className="py-3">{p.city}</td>
                            <td className="py-3">${p.price}</td>
                            <td className="py-3">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                p.status === "approved" ? "bg-green-100 text-green-700" : p.status === "rejected" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-800"
                              }`}
                              >
                                {p.status}
                              </span>
                            </td>
                            <td className="py-3">
                              <div className="flex gap-2">
                                <button onClick={() => openProperty(p)} className="px-3 py-1 rounded text-sm bg-slate-100">View</button>
                                {p.status === "pending" && (
                                  <>
                                    <button onClick={() => updatePropertyStatus(p.id, "approved")} className="px-3 py-1 rounded text-sm bg-green-50 text-green-700">Approve</button>
                                    <button onClick={() => updatePropertyStatus(p.id, "rejected")} className="px-3 py-1 rounded text-sm bg-red-50 text-red-700">Reject</button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Bookings */}
            {active === "bookings" && (
              <div className="space-y-4">
                <div className="bg-white rounded-lg shadow p-4">
                  <h3 className="text-lg font-medium text-slate-800">Bookings</h3>
                  <p className="text-sm text-slate-500">Recent booking activity</p>
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="text-slate-500 text-left">
                        <tr>
                          <th className="py-2">User</th>
                          <th className="py-2">Property</th>
                          <th className="py-2">From</th>
                          <th className="py-2">To</th>
                          <th className="py-2">Status</th>
                        </tr>
                      </thead>
                      <tbody className="text-slate-700">
                        {bookings.map((b) => (
                          <tr key={b.id} className="border-t border-slate-100">
                            <td className="py-3">{b.user}</td>
                            <td className="py-3">{b.property}</td>
                            <td className="py-3">{b.from}</td>
                            <td className="py-3">{b.to}</td>
                            <td className="py-3">{b.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Reviews */}
            {active === "reviews" && (
              <div className="space-y-4">
                <div className="bg-white rounded-lg shadow p-4">
                  <h3 className="text-lg font-medium text-slate-800">Reviews</h3>
                  <p className="text-sm text-slate-500">Recent feedback from guests</p>
                  <div className="mt-4 space-y-3">
                    {reviews.map((r) => (
                      <div key={r.id} className="border border-slate-100 rounded p-3">
                        <div className="flex justify-between">
                          <div className="text-sm font-medium">{r.user} — <span className="text-slate-500">{r.property}</span></div>
                          <div className="text-sm text-yellow-600">{Array.from({ length: r.rating }).map((_, i) => "★").join("")}</div>
                        </div>
                        <div className="text-slate-600 mt-1">{r.comment}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Reports */}
            {active === "reports" && (
              <div className="space-y-4">
                <div className="bg-white rounded-lg shadow p-4">
                  <h3 className="text-lg font-medium text-slate-800">Reports</h3>
                  <p className="text-sm text-slate-500">User-submitted reports and flags</p>
                  <div className="mt-4">
                    <ul className="space-y-3 text-sm text-slate-700">
                      <li className="flex justify-between items-center border p-3 rounded">
                        <div>
                          <div className="font-medium">Report: Inaccurate listing</div>
                          <div className="text-slate-500 text-xs">Property: Mountain Cabin — submitted 2 days ago</div>
                        </div>
                        <div className="flex gap-2">
                          <button className="px-3 py-1 rounded bg-slate-100">Dismiss</button>
                          <button className="px-3 py-1 rounded bg-red-50 text-red-700">Take action</button>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Property Modal */}
      {isModalOpen && selectedProperty && (
        <Modal onClose={closeModal} title={selectedProperty.title}>
          <div className="space-y-3">
            <p className="text-slate-600">{selectedProperty.description}</p>
            <div className="text-sm text-slate-500">City: {selectedProperty.city}</div>
            <div className="text-sm text-slate-500">Price: ${selectedProperty.price}</div>
            <div className="flex gap-2 mt-3">
              {selectedProperty.status === "pending" && (
                <>
                  <button onClick={() => { updatePropertyStatus(selectedProperty.id, "approved"); closeModal(); }} className="px-3 py-2 bg-green-600 text-white rounded">Approve</button>
                  <button onClick={() => { updatePropertyStatus(selectedProperty.id, "rejected"); closeModal(); }} className="px-3 py-2 bg-red-50 text-red-700 rounded">Reject</button>
                </>
              )}
              <button onClick={closeModal} className="px-3 py-2 bg-slate-100 rounded">Close</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminDashboard;

/* Small helper components placed inline to avoid external deps and match project styling */
function RevenueChart({ data }: { data: number[] }) {
  const width = 720;
  const height = 180;
  const max = Math.max(...data);
  const points = data.map((d, i) => `${(i / (data.length - 1)) * width},${height - (d / max) * height}`);
  const poly = `0,${height} ${points.join(" ")} ${width},${height}`;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-44">
        <defs>
          <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`M ${points.join(" L ")}`} fill="none" stroke="#3b82f6" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
        <path d={`M ${poly}`} fill="url(#g1)" opacity={0.9} />
      </svg>
    </div>
  );
}

function Modal({ children, title, onClose }: { children: React.ReactNode; title?: string; onClose: () => void }) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <div className="relative bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 z-10">
        {title && <h3 className="text-lg font-medium text-slate-800">{title}</h3>}
        <div className="mt-3">{children}</div>
      </div>
    </div>
  );
}