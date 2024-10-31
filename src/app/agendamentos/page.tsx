"use client";

import { useEffect, useState } from "react";
import styles from "./Agendamentos.module.scss";

interface Appointments {
  id: number;
  name: string;
  date: string;
  local: string;
}

const apiurl = process.env.NEXT_PUBLIC_API_URL;

export default function Agendamentos() {
  const [appointments, setAppointments] = useState<Appointments[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAppointment, setCurrentAppointment] =
    useState<Appointments | null>(null);

  const fetchAppointments = async () => {
    try {
      const response = await fetch(`${apiurl}/appointments`);
      if (!response.ok) {
        throw new Error("Erro ao buscar os agendamentos");
      }
      const data = await response.json();
      setAppointments(data);
    } catch (err) {
      setError("Nenhum agendamento encontrado.");
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleUpdate = (appointment: Appointments) => {
    setCurrentAppointment(appointment);
    setIsEditing(true);
  };

  const handleUpdateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentAppointment) return;

    const updatedData = {
      name: currentAppointment.name,
      date: currentAppointment.date,
      local: currentAppointment.local,
    };

    try {
      const response = await fetch(
        `${apiurl}/appointments/${currentAppointment.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao atualizar o agendamento");
      }

      setAppointments((prev) =>
        prev.map((appt) =>
          appt.id === currentAppointment.id ? { ...appt, ...updatedData } : appt
        )
      );
      setIsEditing(false);
      setCurrentAppointment(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = confirm(
      "Tem certeza que deseja excluir este agendamento?"
    );
    if (confirmed) {
      await fetch(`${apiurl}/appointments/${id}`, {
        method: "DELETE",
      });
      setAppointments((prev) =>
        prev.filter((appointment) => appointment.id !== id)
      );
    }
  };

  return (
    <div className={styles.tabela_container}>
      <h1>Lista de Agendamentos</h1>
      {error && <div className={styles.error_message}>{error}</div>}
      <table className={styles.tabela}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Data</th>
            <th>Local</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment.id}>
              <td>{appointment.name}</td>
              <td>{new Date(appointment.date).toLocaleString("pt-BR")}</td>
              <td>{appointment.local}</td>
              <td>
                <button onClick={() => handleUpdate(appointment)}>
                  Atualizar
                </button>
                <button onClick={() => handleDelete(appointment.id)}>
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isEditing && currentAppointment && (
        <form onSubmit={handleUpdateSubmit} className={styles.edit_form}>
          <h2>Atualizar Agendamento</h2>
          <label>
            Nome:
            <input
              type="text"
              value={currentAppointment.name}
              onChange={(e) =>
                setCurrentAppointment({
                  ...currentAppointment,
                  name: e.target.value,
                })
              }
              required
            />
          </label>
          <label>
            Data:
            <input
              type="text"
              value={currentAppointment.date}
              onChange={(e) =>
                setCurrentAppointment({
                  ...currentAppointment,
                  date: e.target.value,
                })
              }
              placeholder="dd/MM/yyyy HH:mm"
              required
            />
          </label>
          <label>
            Local:
            <input
              type="text"
              value={currentAppointment.local}
              onChange={(e) =>
                setCurrentAppointment({
                  ...currentAppointment,
                  local: e.target.value,
                })
              }
              required
            />
          </label>
          <button type="submit">Salvar</button>
          <button type="button" onClick={() => setIsEditing(false)}>
            Cancelar
          </button>
        </form>
      )}
    </div>
  );
}
