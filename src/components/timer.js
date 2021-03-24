import React, { useState, useEffect } from "react";

export default function Timer(props) {
  const [time, setTime] = useState(1);
  setTimeout(() => setTime(time + 1), 1000);

  useEffect(() => {
    return function ending() {
      document.cookie = "swipeTime=" + time;
    };
  });

  return (
    <>
      <strong>{time}</strong>
    </>
  );
}
