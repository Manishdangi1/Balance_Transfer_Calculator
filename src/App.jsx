import React from "react";
import ReactDOM from "react-dom/client";
// import App from "./App";
import BalanceTransferCalculator from "./components/BalanceTransferCalculator";
function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <BalanceTransferCalculator />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"))

root.render(<App />)
export default App;
