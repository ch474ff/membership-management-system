
import { useEffect, useState } from "react";
import api from "./api/client";
import {
  LayoutDashboard,
  Users,
  UsersRound,
  LogOut,
  Search,
  RefreshCw,
} from "lucide-react";
import "./App.css";


function ScrambleNumber({ value, duration = 900 }) {
  const target = String(value ?? 0);
  const [display, setDisplay] = useState(
    target.replace(/[0-9]/g, "0")
  );

  useEffect(() => {
    const characters = "0123456789";
    const startTime = Date.now();
    let timer;

    const animate = () => {
      const progress = Math.min(
        (Date.now() - startTime) / duration,
        1
      );

      const revealedCount = Math.floor(
        progress * target.length
      );

      const next = target
        .split("")
        .map((character, index) => {
          if (!/[0-9]/.test(character)) return character;
          if (index < revealedCount) return character;

          return characters[
            Math.floor(Math.random() * characters.length)
          ];
        })
        .join("");

      setDisplay(progress >= 1 ? target : next);

      if (progress < 1) {
        timer = setTimeout(animate, 40);
      }
    };

    animate();

    return () => clearTimeout(timer);
  }, [target, duration]);

  return <>{display}</>;
}


function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("Dashboard");
  const [dashboard, setDashboard] = useState(null);
  const [members, setMembers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  


useEffect(() => {
  const selectors = [
    "button",
    ".stat-card",
    ".content-card",
    ".team-card",
    ".welcome-panel",
    ".user-card",
    ".nav-link",
  ].join(", ");

  const handleMouseMove = (event) => {
    const element = event.target.closest(selectors);
    if (!element) return;

    const rect = element.getBoundingClientRect();

    element.style.setProperty(
      "--mouse-x",
      `${event.clientX - rect.left}px`
    );
    element.style.setProperty(
      "--mouse-y",
      `${event.clientY - rect.top}px`
    );
  };

  document.addEventListener("pointermove", handleMouseMove);

  return () => {
    document.removeEventListener("pointermove", handleMouseMove);
  };
}, []);



const [newAssignment, setNewAssignment] = useState({
  member_id: "",
  team_id: "",
  designation: "",
});
  const [showTeamForm, setShowTeamForm] = useState(false);
const [newTeam, setNewTeam] = useState({
  name: "",
  description: "",
});
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    department: "",
    year: "2",
    password: "",
  
});

  async function loadData() {
    try {
      setError("");
      const [stats, memberData, teamData] = await Promise.all([
        api.get("/dashboard"),
        api.get("/members"),
        api.get("/teams"),
      ]);

      setDashboard(stats.data);
      setMembers(memberData.data);
      setTeams(teamData.data);
    } catch (err) {
      setError(
        err.response?.data?.error || "Could not load data. Please refresh."
      );
    }
  }

  useEffect(() => {
    async function start() {
      try {
        const response = await api.get("/me");
        setUser(response.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    start();
  }, []);

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  async function handleLogin(event) {
    event.preventDefault();
    setError("");

    try {
      const response = await api.post("/login", { email, password });
      setUser(response.data);
      setPassword("");
    } catch (err) {
      setError(
        err.response?.data?.error || "Login failed. Check your credentials."
      );
    }
  }

  async function handleLogout() {
    try {
      await api.delete("/logout");
    } finally {
      setUser(null);
      setDashboard(null);
      setPage("Dashboard");
    }
  }
  
  
  async function handleAddMember(event) {
    event.preventDefault();
    setError("");

    try {
      await api.post("/members", {
        member: {
         ...newMember,
         role: "member",
         status: "active",
        },
      });

    setNewMember({
      name: "",
      email: "",
      department: "",
      year: "2",
      password: "",
    });

    setShowAddForm(false);
    await loadData();
  } catch (err) {
    setError(
      err.response?.data?.errors?.join(", ") ||
      err.response?.data?.error ||
      "Could not add member."
    );
  }
}

async function handleAddTeam(event) {
  event.preventDefault();
  setError("");

  try {
    await api.post("/teams", {
      team: newTeam,
    });

    setNewTeam({
      name: "",
      description: "",
    });

    setShowTeamForm(false);
    await loadData();
  } catch (err) {
    setError(
      err.response?.data?.errors?.join(", ") ||
      err.response?.data?.error ||
      "Could not create team."
    );
  }
}

async function handleAddAssignment(event) {
  event.preventDefault();
  setError("");

  try {
    await api.post("/memberships", {
      membership: {
        ...newAssignment,
        member_id: Number(newAssignment.member_id),
        team_id: Number(newAssignment.team_id),
      },
    });

    setNewAssignment({
      member_id: "",
      team_id: "",
      designation: "",
    });

    setShowAssignmentForm(false);
    await loadData();
  } catch (err) {
    setError(
      err.response?.data?.errors?.join(", ") ||
      err.response?.data?.error ||
      "Could not assign member to team."
    );
  }
}

function startEditing(member) {
  setEditingMember(member.id);
  setEditForm({
    name: member.name || "",
    email: member.email || "",
    department: member.department || "",
    year: String(member.year || "2"),
    status: member.status || "active",
  });
}

async function handleEditMember(event) {
  event.preventDefault();
  setError("");

  try {
    await api.put(`/members/${editingMember}`, {
      member: editForm,
    });

    setEditingMember(null);
    setEditForm({});
    await loadData();
  } catch (err) {
    setError(
      err.response?.data?.errors?.join(", ") ||
      err.response?.data?.error ||
      "Could not update member."
    );
  }
}


async function handleDeleteMember(member) {
  setError("");

  try {
    await api.delete(`/members/${member.id}`);
    setMemberToDelete(null);
    await loadData();
  } catch (err) {
    setError(
      err.response?.data?.error || "Could not delete member."
    );
  }
}



  const filteredMembers = members.filter((member) => {
  const matchesSearch =
    `${member.name} ${member.email} ${member.department}`
      .toLowerCase()
      .includes(search.toLowerCase());

  const matchesDepartment =
    !departmentFilter || member.department === departmentFilter;

  const matchesYear =
    !yearFilter || String(member.year) === yearFilter;

  const matchesStatus =
    !statusFilter || member.status === statusFilter;

  return (
    matchesSearch &&
    matchesDepartment &&
    matchesYear &&
    matchesStatus
  );
});

  if (loading) {
    return <div className="center-screen">Loading membership system...</div>;
  }

  if (!user) {
    return (
      <main className="login-screen">
        <form className="login-card" onSubmit={handleLogin}>
          <div className="brand-mark">M</div>
          <p className="eyebrow">MEMBERSHIP PORTAL</p>
          <h1>Welcome back</h1>
          <p className="muted">Sign in to manage your membership directory.</p>

          {error && <div className="error-message">{error}</div>}

          <label>Email address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="primary-button full-width" type="submit">
            Sign in
          </button>
        </form>
      </main>
    );
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">M</div>
          <div>
            <strong>MemberHub</strong>
            <small>Management portal</small>
          </div>
        </div>

        <p className="nav-heading">WORKSPACE</p>

        <nav>
          {[
            { name: "Dashboard", icon: LayoutDashboard },
            { name: "Members", icon: Users },
            { name: "Teams", icon: UsersRound },
          ].map(({ name, icon: Icon }) => (
            <button
              key={name}
              className={`nav-link ${page === name ? "selected" : ""}`}
              onClick={() => setPage(name)}
            >
              <Icon size={18} />
              {name}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="user-card">
            <div className="avatar">
              {user.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="user-info">
              <strong>{user.name}</strong>
              <small>{user.role}</small>
            </div>
            <button className="icon-button" onClick={handleLogout} title="Log out">
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div>
            <p className="eyebrow">MEMBERSHIP MANAGEMENT</p>
            <h1>{page}</h1>
          </div>
          <button className="secondary-button" onClick={loadData}>
            <RefreshCw size={16} /> Refresh
          </button>
        </header>

        {error && <div className="error-message">{error}</div>}

        {page === "Dashboard" && (
          <>
            <section className="welcome-panel">
              <div>
                <p className="eyebrow">YOUR ORGANIZATION</p>
                <h2>A clearer view of your community.</h2>
                <p>Manage members, follow team activity, and keep your directory organized.</p>
              </div>
              <div className="welcome-decoration">
                <UsersRound size={58} strokeWidth={1.2} />
              </div>
            </section>

            <section className="stats-grid">
              <StatCard
                label="Total members"
                value={dashboard?.total_members}
                icon={<Users size={20} />}
              />
              <StatCard
                label="Active members"
                value={dashboard?.active_members}
                icon={<UsersRound size={20} />}
              />
              <StatCard
                label="Inactive members"
                value={dashboard?.inactive_members}
                icon={<Users size={20} />}
              />
              <StatCard
                label="Teams"
                value={teams.length}
                icon={<LayoutDashboard size={20} />}
              />
            </section>

            <section className="content-card">
              <div className="section-heading">
                <div>
                  <h2>Recently added members</h2>
                  <p className="muted">The latest additions to your directory.</p>
                </div>
                <button
                  className="text-button"
                  onClick={() => setPage("Members")}
                >
                  View all members →
                </button>
              </div>

              <MemberTable
                members={members.slice(0, 5)}
                emptyText="No members yet. Add members to populate your directory."
              />
            </section>
          </>
        )}

        {page === "Members" && (
          <section className="content-card">
            
            <div className="section-heading">
  <div>
    <h2>Member directory</h2>
    <p className="muted">
      {members.length} members in your directory
    </p>
  </div>

  {user.role === "admin" && (
    <button
      className="primary-button"
      onClick={() => setShowAddForm(!showAddForm)}
    >
      {showAddForm ? "Cancel" : "+ Add member"}
    </button>
  )}
</div>
{showAddForm && user.role === "admin" && (
  <form className="add-member-form" onSubmit={handleAddMember}>
    <label>Full name</label>
    <input
      required
      value={newMember.name}
      onChange={(e) =>
        setNewMember({ ...newMember, name: e.target.value })
      }
      placeholder="Enter full name"
    />

    <label>Email</label>
    <input
      required
      type="email"
      value={newMember.email}
      onChange={(e) =>
        setNewMember({ ...newMember, email: e.target.value })
      }
      placeholder="member@example.com"
    />

    <label>Department</label>
    <input
      required
      value={newMember.department}
      onChange={(e) =>
        setNewMember({ ...newMember, department: e.target.value })
      }
      placeholder="e.g. Computer Science"
    />

    <label>Year</label>
    <select
      value={newMember.year}
      onChange={(e) =>
        setNewMember({ ...newMember, year: e.target.value })
      }
    >
      <option value="1">1st year</option>
      <option value="2">2nd year</option>
      <option value="3">3rd year</option>
      <option value="4">4th year</option>
    </select>

    <label>Temporary password</label>
    <input
      required
      minLength={8}
      type="password"
      value={newMember.password}
      onChange={(e) =>
        setNewMember({ ...newMember, password: e.target.value })
      }
      placeholder="At least 8 characters"
    />

    <button className="primary-button" type="submit">
      Save member
    </button>
  </form>
)}
            
<div className="member-toolbar">
  <div className="search-box">
    <Search size={18} />
    <input
      placeholder="Search by name, email or department..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
    {search && (
      <button
        type="button"
        className="search-clear-button"
        aria-label="Clear search"
        onClick={() => setSearch("")}
      >
        ×
      </button>
    )}
  </div>

  <div className="filters-heading">
    <span>Filter members</span>
    {(search.trim() || departmentFilter || yearFilter || statusFilter) && (
      <span className="active-filter-indicator">
        <span className="active-filter-dot" />
        Filters active
      </span>
    )}
  </div>

  <div className="filters-row">
    <select
      aria-label="Filter by department"
      value={departmentFilter}
      onChange={(e) => setDepartmentFilter(e.target.value)}
    >
      <option value="">All departments</option>
      {[...new Set(members.map((m) => m.department).filter(Boolean))].map(
        (department) => (
          <option key={department} value={department}>
            {department}
          </option>
        )
      )}
    </select>

    <select
      aria-label="Filter by year"
      value={yearFilter}
      onChange={(e) => setYearFilter(e.target.value)}
    >
      <option value="">All years</option>
      <option value="1">1st year</option>
      <option value="2">2nd year</option>
      <option value="3">3rd year</option>
      <option value="4">4th year</option>
    </select>

    <select
      aria-label="Filter by status"
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
    >
      <option value="">All statuses</option>
      <option value="active">Active</option>
      <option value="inactive">Inactive</option>
    </select>

    <button
      type="button"
      className="secondary-button"
      disabled={!search && !departmentFilter && !yearFilter && !statusFilter}
      onClick={() => {
        setSearch("");
        setDepartmentFilter("");
        setYearFilter("");
        setStatusFilter("");
      }}
    >
      Clear filters
    </button>
  </div>
</div>

            



            
{editingMember && user.role === "admin" && (
  <form className="add-member-form" onSubmit={handleEditMember}>
    <h2>Edit member</h2>

    <label>Full name</label>
    <input
      required
      value={editForm.name || ""}
      onChange={(e) =>
        setEditForm({ ...editForm, name: e.target.value })
      }
    />

    <label>Email</label>
    <input
      required
      type="email"
      value={editForm.email || ""}
      onChange={(e) =>
        setEditForm({ ...editForm, email: e.target.value })
      }
    />

    <label>Department</label>
    <input
      value={editForm.department || ""}
      onChange={(e) =>
        setEditForm({ ...editForm, department: e.target.value })
      }
    />

    <label>Year</label>
    <select
      value={editForm.year || "2"}
      onChange={(e) =>
        setEditForm({ ...editForm, year: e.target.value })
      }
    >
      <option value="1">1st year</option>
      <option value="2">2nd year</option>
      <option value="3">3rd year</option>
      <option value="4">4th year</option>
    </select>

    <label>Status</label>
    <select
      value={editForm.status || "active"}
      onChange={(e) =>
        setEditForm({ ...editForm, status: e.target.value })
      }
    >
      <option value="active">Active</option>
      <option value="inactive">Inactive</option>
    </select>

    <button className="primary-button" type="submit">
      Save changes
    </button>

    <button
      className="secondary-button"
      type="button"
      onClick={() => setEditingMember(null)}
    >
      Cancel
    </button>
  </form>
)}

<div className="table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Member</th>
        <th>Department</th>
        <th>Year</th>
        <th>Status</th>
        {user.role === "admin" && <th>Actions</th>}
      </tr>
    </thead>
    <tbody>
      {filteredMembers.map((member) => (
        <tr key={member.id}>
          <td>
            <div className="member-cell">
              <div className="avatar">
                {(member.name || "Member")
  .trim()
  .split(/\s+/)
  .slice(0, 2)
  .map((part) => part.charAt(0).toUpperCase())
  .join("")}
              </div>
              <div>
                <strong>{member.name}</strong>
                <small>{member.email}</small>
              </div>
            </div>
          </td>
          <td>
  {member.department ? (
    <span className="department-badge">
      {member.department}
    </span>
  ) : (
    "—"
  )}
</td>
          <td>{member.year || "—"}</td>
          <td>
            <span className={`status-pill ${member.status}`}>
              {member.status || "unknown"}
            </span>
          </td>
          {user.role === "admin" && (
            <td>
              <button
                className="secondary-button"
                onClick={() => startEditing(member)}
              >
                Edit
              </button>
            <button
  className="secondary-button"
  onClick={() => setMemberToDelete(member)}
>
  Delete
</button>
            </td>
          )}
        </tr>
      ))}
    </tbody>
  </table>

  {filteredMembers.length === 0 && (
    <div className="empty-state">No matching members found.</div>
  )}
</div>

{memberToDelete && user.role === "admin" && (
  <div
    className="delete-modal-backdrop"
    onClick={() => setMemberToDelete(null)}
  >
    <div
      className="delete-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="delete-modal-icon">!</div>

      <h2 id="delete-modal-title">Delete member?</h2>

      <p>
        Are you sure you want to delete{" "}
        <strong>{memberToDelete.name}</strong>?
        This action cannot be undone.
      </p>

      <div className="delete-modal-actions">
        <button
          type="button"
          className="secondary-button"
          onClick={() => setMemberToDelete(null)}
        >
          Cancel
        </button>

        <button
          type="button"
          className="delete-confirm-button"
          onClick={() => handleDeleteMember(memberToDelete)}
        >
          Delete member
        </button>
      </div>
    </div>
  </div>
)}


          </section>
        )}

        {page === "Teams" && (
          <section className="teams-grid">
             {user.role === "admin" && (
  <div className="content-card">
    <div className="section-heading">
      <div>
        <h2>Manage teams</h2>
        <p className="muted">Create a team for your organization.</p>
      </div>

      <button
        className="primary-button"
        onClick={() => setShowTeamForm(!showTeamForm)}
      >
        {showTeamForm ? "Cancel" : "+ Create team"}
      </button>
    </div>

    {showTeamForm && (
      <form className="add-member-form" onSubmit={handleAddTeam}>
        <label>Team name</label>
        <input
          required
          value={newTeam.name}
          onChange={(e) =>
            setNewTeam({ ...newTeam, name: e.target.value })
          }
          placeholder="e.g. Web Development"
        />

        <label>Description</label>
        <textarea
          value={newTeam.description}
          onChange={(e) =>
            setNewTeam({ ...newTeam, description: e.target.value })
          }
          placeholder="What does this team do?"
          rows={3}
        />

        <button className="primary-button" type="submit">
          Save team
        </button>
      </form>
    )}
  </div>
)}
            {user.role === "admin" && (
  <div className="content-card">
    <div className="section-heading">
      <div>
        <h2>Assign members</h2>
        <p className="muted">Assign a member to a team with a designation.</p>
      </div>

      <button
        className="primary-button"
        onClick={() => setShowAssignmentForm(!showAssignmentForm)}
      >
        {showAssignmentForm ? "Cancel" : "+ Assign member"}
      </button>
    </div>

    {showAssignmentForm && (
      <form className="add-member-form" onSubmit={handleAddAssignment}>
        <label>Member</label>
        <select
          required
          value={newAssignment.member_id}
          onChange={(e) =>
            setNewAssignment({ ...newAssignment, member_id: e.target.value })
          }
        >
          <option value="">Select a member</option>
          {members.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name} ({member.email})
            </option>
          ))}
        </select>

        <label>Team</label>
        <select
          required
          value={newAssignment.team_id}
          onChange={(e) =>
            setNewAssignment({ ...newAssignment, team_id: e.target.value })
          }
        >
          <option value="">Select a team</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>

        <label>Designation</label>
        <input
          required
          value={newAssignment.designation}
          onChange={(e) =>
            setNewAssignment({ ...newAssignment, designation: e.target.value })
          }
          placeholder="e.g. Developer, Team Lead"
        />

        <button className="primary-button" type="submit">
          Save assignment
        </button>
      </form>
    )}
  </div>
)}
               {teams.length === 0 ? (
              <div className="content-card empty-state">
                <UsersRound size={32} />
                <h2>No teams yet</h2>
                <p>Create teams to organize your members.</p>
              </div>
            ) : (
              teams.map((team) => (
                <article className="team-card" key={team.id}>
                  <div className="team-icon">
                    <UsersRound size={22} />
                  </div>
                  <h2>{team.name}</h2>
                  <p>{team.description || "No description provided."}</p>
                  
<div className="team-footer">
  <Users size={16} />
  {team.members?.length || 0} members
</div>

{team.members?.length > 0 && (
  <div className="team-members-list">
    {team.members.map((member) => (
      <div className="team-member-row" key={member.id}>
        <div className="avatar">
          {member.name?.charAt(0)?.toUpperCase() || "M"}
        </div>
        <div>
          <strong>{member.name}</strong>
          <small>{member.email}</small>
        </div>
      </div>
    ))}
  </div>
)}

                </article>
              ))
            )}
          </section>
        )}
      </main>
    </div>
  );
}



function StatCard({ label, value, icon }) {
  const target = Number(value ?? 0);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!Number.isFinite(target) || target < 0) {
      setDisplay(value ?? "—");
      return;
    }

    const duration = 200;
    const startTime = Date.now();
    let timer;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out effect: fast at first, then gradually slows down.
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(easedProgress * target);

      setDisplay(progress >= 1 ? target : currentValue);

      if (progress < 1) {
        timer = setTimeout(animate, 16);
      }
    };

    setDisplay(0);
    animate();

    return () => clearTimeout(timer);
  }, [target]);

  return (
    <article className="stat-card">
      <div className="stat-icon">{icon}</div>
      <p>{label}</p>
      <strong>{display}</strong>
    </article>
  );
}



function MemberTable({ members, emptyText }) {
  if (!members.length) {
    return <div className="empty-state">{emptyText}</div>;
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Member</th>
            <th>Department</th>
            <th>Year</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id}>
              <td>
                <div className="member-cell">
                  <div className="avatar">
                    {member.name?.charAt(0)?.toUpperCase() || "M"}
                  </div>
                  <div>
                    <strong>{member.name}</strong>
                    <small>{member.email}</small>
                  </div>
                </div>
              </td>
              <td>{member.department || "—"}</td>
              <td>{member.year || "—"}</td>
              <td>
                <span className={`status-pill ${member.status}`}>
                  {member.status || "unknown"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
