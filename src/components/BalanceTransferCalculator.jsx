import React, { useState, useEffect } from "react";

const BalanceTransferCalculator = () => {
  const [loanAmount, setLoanAmount] = useState("");
  const [oldRate, setOldRate] = useState("");
  const [newRate, setNewRate] = useState("");
  const [tenure, setTenure] = useState("");
  const [processingFee, setProcessingFee] = useState("");
  const [savings, setSavings] = useState(null);
  const [errors, setErrors] = useState({});
  const [isCalculated, setIsCalculated] = useState(false);

  useEffect(() => {
    const newErrors = {};

    if (loanAmount && (isNaN(loanAmount) || parseFloat(loanAmount) <= 0)) {
      newErrors.loanAmount = "Loan amount must be a positive number";
    }

    if (oldRate && (isNaN(oldRate) || parseFloat(oldRate) <= 0 || parseFloat(oldRate) > 100)) {
      newErrors.oldRate = "Old interest rate must be between 0 and 100";
    }

    if (newRate && (isNaN(newRate) || parseFloat(newRate) <= 0 || parseFloat(newRate) > 100)) {
      newErrors.newRate = "New interest rate must be between 0 and 100";
    }

    if (tenure && (isNaN(tenure) || parseFloat(tenure) <= 0)) {
      newErrors.tenure = "Tenure must be a positive number";
    }

    if (processingFee && (isNaN(processingFee) || parseFloat(processingFee) < 0)) {
      newErrors.processingFee = "Processing fee must be 0 or a positive number";
    }

    setErrors(newErrors);
  }, [loanAmount, oldRate, newRate, tenure, processingFee]);

  const calculateSavings = () => {
    if (!loanAmount || !oldRate || !newRate || !tenure) {
      const newErrors = {};
      if (!loanAmount) newErrors.loanAmount = "Loan amount is required";
      if (!oldRate) newErrors.oldRate = "Old rate is required";
      if (!newRate) newErrors.newRate = "New rate is required";
      if (!tenure) newErrors.tenure = "Tenure is required";
      setErrors(newErrors);
      return;
    }

    if (Object.keys(errors).some(key => errors[key])) return;

    const P = parseFloat(loanAmount);
    const R1 = parseFloat(oldRate) / 12 / 100;
    const R2 = parseFloat(newRate) / 12 / 100;
    const N = parseInt(tenure);
    const fee = parseFloat(processingFee) || 0;

    const EMI1 = (P * R1 * Math.pow(1 + R1, N)) / (Math.pow(1 + R1, N) - 1);
    const EMI2 = (P * R2 * Math.pow(1 + R2, N)) / (Math.pow(1 + R2, N) - 1);

    const totalOld = EMI1 * N;
    const totalNew = EMI2 * N + fee;

    const totalSavings = totalOld - totalNew;

    setSavings({
      emiOld: EMI1.toFixed(2),
      emiNew: EMI2.toFixed(2),
      interestSaved: totalSavings.toFixed(2),
      fee: fee.toFixed(2)
    });
    setIsCalculated(true);
  };

  const reset = () => {
    setLoanAmount("");
    setOldRate("");
    setNewRate("");
    setTenure("");
    setProcessingFee("");
    setErrors({});
    setSavings(null);
    setIsCalculated(false);
  };

  return (
    <div className="calculator-container">
      <h2 className="calculator-title">Balance Transfer Savings Calculator</h2>

      <div className="form-group">
        <div className="input-container">
          <input
            type="number"
            placeholder="Outstanding Loan Amount (₹)"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
            className={`input-field ${errors.loanAmount ? "error" : ""}`}
          />
          {errors.loanAmount && <span className="error-message">{errors.loanAmount}</span>}
        </div>

        <div className="input-container">
          <input
            type="number"
            placeholder="Current Interest Rate (%)"
            value={oldRate}
            onChange={(e) => setOldRate(e.target.value)}
            className={`input-field ${errors.oldRate ? "error" : ""}`}
          />
          {errors.oldRate && <span className="error-message">{errors.oldRate}</span>}
        </div>

        <div className="input-container">
          <input
            type="number"
            placeholder="New Interest Rate (%)"
            value={newRate}
            onChange={(e) => setNewRate(e.target.value)}
            className={`input-field ${errors.newRate ? "error" : ""}`}
          />
          {errors.newRate && <span className="error-message">{errors.newRate}</span>}
        </div>

        <div className="input-container">
          <input
            type="number"
            placeholder="Remaining Tenure (months)"
            value={tenure}
            onChange={(e) => setTenure(e.target.value)}
            className={`input-field ${errors.tenure ? "error" : ""}`}
          />
          {errors.tenure && <span className="error-message">{errors.tenure}</span>}
        </div>

        <div className="input-container">
          <input
            type="number"
            placeholder="Processing Fee (optional)"
            value={processingFee}
            onChange={(e) => setProcessingFee(e.target.value)}
            className={`input-field ${errors.processingFee ? "error" : ""}`}
          />
          {errors.processingFee && <span className="error-message">{errors.processingFee}</span>}
        </div>

        <div className="button-group">
          <button onClick={calculateSavings} className="calculate-button">Calculate</button>
          <button onClick={reset} className="reset-button">Reset</button>
        </div>

        {isCalculated && savings && (
          <div className="result">
            <div className="result-summary">
              {parseFloat(savings.interestSaved) > 0 ? (
                <div style={{ color: "green", fontWeight: "bold" }}>
                  💸 Interest Saved: ₹ {Number(savings.interestSaved).toLocaleString('en-IN')}
                </div>
              ) : (
                <>
                  <div style={{ color: "red", fontWeight: "bold" }}>
                    ❌ No Interest Saving: ₹ {Number(savings.interestSaved).toLocaleString('en-IN')}
                  </div>
                  <p style={{ color: "red" }}>⚠️ You incur a loss of ₹ {Number(savings.interestSaved).toLocaleString('en-IN')} by transferring.</p>
                </>
              )}
            </div>

            <div className="breakdown">
              <p>Old EMI: ₹ {Number(savings.emiOld).toLocaleString('en-IN')}</p>
              <p>New EMI: ₹ {Number(savings.emiNew).toLocaleString('en-IN')}</p>
              <p>Processing Fee: ₹ {Number(savings.fee).toLocaleString('en-IN')}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BalanceTransferCalculator;
