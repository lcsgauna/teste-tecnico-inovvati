import Link from "next/link";
import styles from "./Header.module.scss";

export default function Header() {
  return (
    <header className={styles.header}>
      <Link href="/cadastro" className={styles.header_item}>
        Novo agendamento
      </Link>
      <Link href="/agendamentos" className={styles.header_item}>
        Agendamentos
      </Link>
    </header>
  );
}
