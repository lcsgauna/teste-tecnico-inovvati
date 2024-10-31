"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import styles from "./Cadastro.module.scss";

interface FormData {
  name: string;
  date: string;
  local: string;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

export default function Cadastro() {
  const [form, setForm] = useState<FormData>({ name: "", date: "", local: "" });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const apiurl = process.env.NEXT_PUBLIC_API_URL;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const localDate = form.date;
    const formattedDate = formatDate(localDate);

    const formattedData = {
      ...form,
      date: formattedDate,
    };

    try {
      const response = await fetch(`${apiurl}/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      if (response.ok) {
        setErrorMessage(null);
        setSuccessMessage("Formulário cadastrado com sucesso!");
      } else {
        const data = await response.json();
        setSuccessMessage(null);
        setErrorMessage(data.response);
      }
    } catch (error) {
      setErrorMessage("Erro ao enviar o formulário. Tente novamente.");
    }
  };

  return (
    <>
      <main className={styles.register_content}>
        <h1 className={styles.register_title}>
          Preencha as informações abaixo
        </h1>
        <form
          action=""
          method="post"
          className={styles.register_form}
          onSubmit={handleSubmit}
        >
          <label htmlFor="fnome">Nome:</label>
          <input
            type="text"
            id="fnome"
            name="name"
            required
            minLength={3}
            maxLength={30}
            value={form.name}
            onChange={handleChange}
          />
          <label htmlFor="fdataLocal">Data e Hora:</label>
          <input
            type="datetime-local"
            id="fdataLocal"
            name="date"
            required
            value={form.date}
            onChange={handleChange}
          />
          <label htmlFor="flocal">Local:</label>
          <input
            type="text"
            id="flocal"
            name="local"
            required
            minLength={3}
            maxLength={40}
            value={form.local}
            onChange={handleChange}
          />
          <input type="submit" value="Salvar" />

          {errorMessage && (
            <p className={styles.error_message}>{errorMessage}</p>
          )}
          {successMessage && (
            <p className={styles.success_message}>{successMessage}</p>
          )}
        </form>
      </main>
    </>
  );
}
