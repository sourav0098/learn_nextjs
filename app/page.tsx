import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <h2>Home Page</h2>
      <p>
        <Link href={"/users"}>Users</Link>
      </p>
    </main>
  );
}
