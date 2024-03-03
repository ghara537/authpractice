import { useState } from "react";
import Clock from "./Components/Clock";
import Counter from "./Components/Counter";
import LoginForm from "./Components/LoginForm";

export default function App() {
  const [isUserLoggedIn, setLoggedIn] = useState(false);

  return (
    <main>
      {isUserLoggedIn ? (
        <>
          <Clock></Clock>
          <Counter></Counter>
        </>
      ) : (
        <LoginForm></LoginForm>
      )}
    </main>
  );
}
