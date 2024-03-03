import { useEffect, useState } from "react";

export default function Clock() {
  const [time, setTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="clock-parent">
      <div className="clock-container">
        <h3>Digital Clock</h3>
        <div className="time">{time.toLocaleTimeString()}</div>
      </div>
    </div>
  );
}
