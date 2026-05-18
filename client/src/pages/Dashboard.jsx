import {
  useEffect,
  useState,
} from "react";

import api from "../services/api";

import { Link } from "react-router-dom";
import { io } from "socket.io-client";
const socket = io("http://localhost:5000");

function Dashboard() {

  const [incidents, setIncidents] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "",
    reporter_name: "",
  });

  async function fetchIncidents() {

    try {

      const response =
        await api.get("/incidents");

      setIncidents(response.data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  }

  useEffect(() => {

  async function loadData() {
    await fetchIncidents();
  }

  loadData();

  socket.on(
    "new-update",
    async () => {
      await fetchIncidents();
    }
  );

  socket.on(
    "incident-created",
    async () => {
      await fetchIncidents();
    }
  );

  socket.on(
    "status-updated",
    async () => {
      await fetchIncidents();
    }
  );

  return () => {

    socket.off("new-update");

    socket.off("incident-created");

    socket.off("status-updated");
  };

}, []);
  async function createIncident(e) {

    e.preventDefault();

    if (
      !form.title ||
      !form.description ||
      !form.priority ||
      !form.reporter_name
    ) {
      alert("All fields required");

      return;
    }

    try {

      await api.post(
        "/incidents",
        form
      );

      setForm({
        title: "",
        description: "",
        priority: "",
        reporter_name: "",
      });

      fetchIncidents();

    } catch (error) {

      console.log(error);

      alert(
        "Failed to create incident"
      );
    }
  }

  if (loading) {
    return (
      <p className="p-6 text-xl">
        Loading incidents...
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-blue-500 p-6">

      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-10">
  <div className="bg-yellow-400 inline-block rounded-2xl shadow-lg px-8 py-4">
    <h1 className="text-5xl font-bold text-black">
      AI Incident Room
    </h1>
  </div>
</div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-12">

          <h2 className="text-2xl font-bold mb-6">
            Create New Incident
          </h2>

          <form
            onSubmit={createIncident}
            className="space-y-5"
          >

            <input
              className="border p-4 w-full rounded-lg"
              placeholder="Incident Title"
              value={form.title}
              onChange={(e) =>
                setForm({
                  ...form,
                  title: e.target.value,
                })
              }
            />

            <textarea
              className="border p-4 w-full rounded-lg"
              placeholder="Incident Description"
              rows="4"
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description:
                    e.target.value,
                })
              }
            />

            <select
              className="border p-4 w-full rounded-lg"
              value={form.priority}
              onChange={(e) =>
                setForm({
                  ...form,
                  priority:
                    e.target.value,
                })
              }
            >
              <option value="">
                Select Priority
              </option>

              <option>
                High
              </option>

              <option>
                Medium
              </option>

              <option>
                Low
              </option>
            </select>

            <input
              className="border p-4 w-full rounded-lg"
              placeholder="Reporter Name"
              value={
                form.reporter_name
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  reporter_name:
                    e.target.value,
                })
              }
            />

            <button className="bg-black hover:bg-gray-800 text-white px-6 py-4 rounded-lg transition">
              Create Incident
            </button>

          </form>
        </div>

        <div className="mb-6">

          <h2 className="text-3xl font-bold">
            Active Incidents
          </h2>

        </div>

        {
          incidents.length === 0 && (
            <div className="bg-white rounded-xl p-8 text-center shadow">
              <p className="text-xl text-gray-500">
                No incidents found
              </p>
            </div>
          )
        }

        <div className="grid md:grid-cols-2 gap-6">

          {
            incidents.map(
              (incident) => (

                <Link
                  key={incident.id}
                  to={`/incidents/${incident.id}`}
                >

                  <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition cursor-pointer">

                    <div className="flex justify-between items-start">

                      <h2 className="text-2xl font-bold mb-3">
                        {incident.title}
                      </h2>

                      <span
                        className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${
                          incident.priority ===
                          "High"
                            ? "bg-red-500"
                            : incident.priority ===
                              "Medium"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                      >
                        {
                          incident.priority
                        }
                      </span>

                    </div>

                    <div className="mb-4">

                      <span
                        className={`px-3 py-1 rounded-full text-white text-sm ${
                          incident.status ===
                          "Resolved"
                            ? "bg-green-600"
                            : incident.status ===
                              "Investigating"
                            ? "bg-yellow-600"
                            : "bg-red-600"
                        }`}
                      >
                        {incident.status}
                      </span>

                    </div>

                    <p className="text-gray-700 mb-4 line-clamp-2">
                      {
                        incident.description
                      }
                    </p>

                    <div className="border-t pt-4 text-sm text-gray-600">

                      <p className="mb-2">
                        <span className="font-semibold">
                          Reporter:
                        </span>{" "}
                        {
                          incident.reporter_name
                        }
                      </p>

                      <p className="mb-2">
                        <span className="font-semibold">
                          Latest Update:
                        </span>{" "}
                        {
                          incident.latest_update ||
                          "No updates yet"
                        }
                      </p>

                      <p>
                        <span className="font-semibold">
                          Created:
                        </span>{" "}
                        {
                          new Date(
                            incident.created_at
                          ).toLocaleString()
                        }
                      </p>

                    </div>

                  </div>

                </Link>
              )
            )
          }

        </div>

      </div>
    </div>
  );
}

export default Dashboard;