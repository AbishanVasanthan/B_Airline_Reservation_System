import React, { useState } from 'react';
import axios from 'axios';
import './Report.css';

const Report = () => {
  const [reportType, setReportType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [userType, setUserType] = useState('');
  const [flightNumber, setFlightNumber] = useState(''); // New state for flight number
  const [reportData, setReportData] = useState([]); // Initialize as an empty array
  const [error, setError] = useState('');

  const fetchReport = async () => {
    try {
      let response;

      // Handle different report types with corresponding requests
      switch (reportType) {
        case 'passengers_above_18_years_or_below_18_years':
          if (!flightNumber) {
            throw new Error('Flight number is required');
          }
          response = await axios.post('http://localhost:3000/report/generateReport', { reportType, flightNumber });
          break;

        case 'passengers_by_destination':
          response = await axios.post('http://localhost:3000/report/generateReport', {
            reportType,
            startDate,
            endDate,
            destination,
          });
          break;

        case 'bookings_by_type':
          response = await axios.post('http://localhost:3000/report/generateReport', {
            reportType,
            startDate,
            endDate,
          });
          break;

        case 'flights_by_route':
          response = await axios.post('http://localhost:3000/report/generateReport', {
            reportType,
            startDate,
            endDate,
            origin,
            destination,
          });
          break;

        case 'revenue_by_aircraft':
          response = await axios.post('http://localhost:3000/report/generateReport', {
            reportType,
          });
          break;

        default:
          throw new Error('Invalid report type');
      }

      // Update the report data state
      setReportData(response.data);
      setError('');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to fetch report');
    }
  };

  const handleGenerateReport = () => {
    fetchReport();
  };

  return (
    <div className="report-container">
      <h2 className="report-title">Report Generator</h2>

      <div className="form-group">
        <label>Report Type:</label>
        <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
          <option value="">Select Report Type</option>
          <option value="passengers_above_18_years_or_below_18_years">Passengers Above 18 Years or Below 18</option>
          <option value="passengers_by_destination">Passengers By Destination</option>
          <option value="bookings_by_type">Bookings By Type</option>
          <option value="flights_by_route">Flights By Route</option>
          <option value="revenue_by_aircraft">Revenue By Aircraft</option>
        </select>
      </div>

      {reportType === 'passengers_above_18_years_or_below_18_years' && (
        <div className="form-group">
          <label>Flight Number:</label>
          <input type="text" value={flightNumber} onChange={(e) => setFlightNumber(e.target.value)} />
        </div>
      )}

      {(reportType === 'passengers_by_destination' || reportType === 'flights_by_route') && (
        <>
          <div className="form-group">
            <label>Origin:</label>
            <input type="text" value={origin} onChange={(e) => setOrigin(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Destination:</label>
            <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} />
          </div>
        </>
      )}

      {(reportType === 'passengers_by_destination' || reportType === 'bookings_by_type' || reportType === 'flights_by_route') && (
        <>
          <div className="form-group">
            <label>Start Date:</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="form-group">
            <label>End Date:</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </>
      )}

      {/* {reportType === 'bookings_by_type' && (
        <div className="form-group">
          <label>User Type:</label>
          <input type="email" value={userTypr} onChange={(e) => setUserType(e.target.value)} />
        </div>
      )} */}

      <div className="form-group">
        <button onClick={handleGenerateReport} className="generate-button">Generate Report</button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {reportData.length > 0 && (
        <div className="report-results">
          <h3>Report Results</h3>
          <table className="report-table" border="1">
            <thead>
              <tr>
                {Object.keys(reportData[0] || {}).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reportData.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value, idx) => (
                    <td key={idx}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Report;
