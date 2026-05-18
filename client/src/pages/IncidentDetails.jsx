import {
  useEffect,
  useState,
  useCallback,
} from "react";

import { io } from "socket.io-client";

import api from "../services/api";

import { useParams } from "react-router-dom";

const socket = io("http://localhost:5000");

function IncidentDetails() {
  const { id } = useParams();

  const [incident, setIncident] =
    useState(null);

  const [message, setMessage] =
    useState("");

  const [author, setAuthor] =
    useState("");

  const [aiResult, setAiResult] =
    useState("");

  const [loadingAI, setLoadingAI] =
    useState(false);

  const fetchIncident = useCallback(
    async () => {
      const response = await api.get(
        `/incidents/${id}`
      );

      setIncident(response.data);
    },
    [id]
  );

  useEffect(() => {
    async function loadData() {
      await fetchIncident();
    }

    loadData();

    socket.on(
      "new-update",
      async () => {
        await fetchIncident();
      }
    );

    return () => {
      socket.off("new-update");
    };
  }, [fetchIncident]);

  async function addUpdate(e) {
    e.preventDefault();

    if (!message || !author) {
      alert("All fields required");

      return;
    }

    await api.post(
      `/incidents/${id}/updates`,
      {
        message,
        author_name: author,
      }
    );

    setMessage("");
    setAuthor("");
  }

  async function updateStatus(status) {
    await api.patch(
      `/incidents/${id}/status`,
      {
        status,
      }
    );

    await fetchIncident();
  }

  async function generateSummary() {
    try {
      setLoadingAI(true);

      const response =
        await api.post(
          `/incidents/${id}/ai-summary`
        );

      setAiResult(response.data.result);

    } catch (error) {
      console.log(error);

      alert(
        "Failed to generate AI summary"
      );

    } finally {
      setLoadingAI(false);
    }
  }

  if (!incident) {
    return (
      <p className="p-6">
        Loading...
      </p>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">

      <h1 className="text-4xl font-bold mb-4">
        {incident.title}
      </h1>

      <p className="text-lg text-gray-700">
        {incident.description}
      </p>

      <div className="mt-6 flex items-center">

        <span
          className={`px-4 py-2 rounded text-white font-semibold ${
            incident.status === "Resolved"
              ? "bg-green-500"
              : incident.status ===
                "Investigating"
              ? "bg-yellow-500"
              : "bg-red-500"
          }`}
        >
          {incident.status}
        </span>

        <select
          value={incident.status}
          onChange={(e) =>
            updateStatus(
              e.target.value
            )
          }
          className="border p-3 ml-4 rounded"
        >
          <option>Open</option>

          <option>
            Investigating
          </option>

          <option>Resolved</option>
        </select>
      </div>

      <div className="mt-6">

        <button
          onClick={generateSummary}
          className="bg-blue-600 text-white px-5 py-3 rounded"
        >
          {
            loadingAI
              ? "Generating..."
              : "Generate AI Summary"
          }
        </button>

        {
          aiResult && (
            <div className="border rounded p-5 mt-5 bg-gray-50">

              <h2 className="text-2xl font-bold mb-3">
                AI Incident Summary
              </h2>

              <p className="whitespace-pre-wrap">
                {aiResult}
              </p>

            </div>
          )
        }
      </div>

      <div className="mt-12">

        <h2 className="text-3xl font-bold mb-6">
          Incident Updates
        </h2>

        <form
          onSubmit={addUpdate}
          className="space-y-4 mb-10"
        >
          <input
            className="border p-3 w-full rounded"
            placeholder="Your Name"
            value={author}
            onChange={(e) =>
              setAuthor(
                e.target.value
              )
            }
          />

          <textarea
            className="border p-3 w-full rounded"
            placeholder="Update Message"
            value={message}
            onChange={(e) =>
              setMessage(
                e.target.value
              )
            }
          />

          <button className="bg-black text-white px-5 py-3 rounded">
            Add Update
          </button>
        </form>

        {
          incident.updates.length ===
            0 && (
            <p>
              No updates yet.
            </p>
          )
        }

        <div className="space-y-5">

          {
            incident.updates.map(
              (update) => (
                <div
                  key={update.id}
                  className="border rounded p-5 shadow-sm"
                >
                  <p className="text-lg">
                    {update.message}
                  </p>

                  <div className="mt-3 text-sm text-gray-600">

                    <p>
                      By{" "}
                      <span className="font-semibold">
                        {
                          update.author_name
                        }
                      </span>
                    </p>

                    <p>
                      {new Date(
                        update.created_at
                      ).toLocaleString()}
                    </p>

                  </div>
                </div>
              )
            )
          }

        </div>
      </div>
    </div>
  );
}

export default IncidentDetails;