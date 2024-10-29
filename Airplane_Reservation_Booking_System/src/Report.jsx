import React, { useState } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf'; // Import jsPDF
import 'jspdf-autotable'; // Import jsPDF autotable
import './Report.css';

const Report = () => {
  const [reportType, setReportType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [flightNumber, setFlightNumber] = useState('');
  const [ageGroup, setAgeGroup] = useState('');
  const [reportData, setReportData] = useState([]);
  const [adultData, setAdultData] = useState([]);
  const [childData, setChildData] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError('');

      let response;

      switch (reportType) {
        case 'passengers_above_18_years_or_below_18_years':
          if (!flightNumber || !ageGroup) {
            throw new Error('Flight number and age group selection are required');
          }
          response = await axios.get('http://localhost:3000/admin/report1', {
            params: { flightNumber },
          });

          console.log("Response from backend:", response.data);

          const reportData = response.data.data;

          // Conditionally set adultData or childData based on ageGroup
          if (ageGroup === 'adult') {
            setAdultData(reportData.adult || []);
            setChildData([]); // Clear child data
          } else if (ageGroup === 'child') {
            setChildData(reportData.child || []);
            setAdultData([]); // Clear adult data
          }

          setReportData([]); // Clear general report data for specific age group data
          break;

        case 'passengers_by_destination':
          if (!destination || !startDate || !endDate) {
            throw new Error('Destination code, start date, and end date are required');
          }
          response = await axios.get('http://localhost:3000/admin/report2', {
            params: { destinationCode: destination, startDate, endDate },
          });
          setReportData([response.data.data]);
          console.log("report :", [response.data.data]);
          setAdultData([]);
          setChildData([]);
          break;

        case 'bookings_by_type':
          if (!startDate || !endDate) {
            throw new Error('Start date and end date are required');
          }
          response = await axios.get('http://localhost:3000/admin/report3', {
            params: { startDate, endDate },
          });
          setReportData(response.data.data);
          setAdultData([]);
          setChildData([]);
          break;

        case 'flights_by_route':
          if (!origin || !destination) {
            throw new Error('Source and destination codes are required');
          }
          response = await axios.get('http://localhost:3000/admin/report4', {
            params: { sourceCode: origin, destinationCode: destination },
          });
          setReportData(response.data.data);
          console.log("report :", response.data.data);
          setAdultData([]);
          setChildData([]);
          break;

        case 'revenue_by_aircraft':
          response = await axios.get('http://localhost:3000/admin/report5');
          setReportData(response.data.data);
          setAdultData([]);
          setChildData([]);
          break;

        default:
          throw new Error('Invalid report type');
      }

      setError('');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to fetch report');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = () => {
    fetchReport();
  };

  // Function to generate PDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    doc.text('Report Results', 14, 16);
    const headers = Object.keys(reportData[0] || {});
    const data = reportData.map(row => Object.values(row));

    const tableColumn = headers;
    const tableRows = data;

    // Add the table to the PDF
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });

    // Save the PDF
    doc.save('report.pdf');
  };

  return (
    <div className="report-container">
      <h2 className="report-title">Report Generator</h2>

      <div className="form-group">
        <label>Report Type:</label>
        <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
          <option value="">Select Report Type</option>
          <option value="passengers_above_18_years_or_below_18_years">Passengers Above 18 or Below 18</option>
          <option value="passengers_by_destination">Passengers By Destination</option>
          <option value="bookings_by_type">Bookings By Type</option>
          <option value="flights_by_route">Flights By Route</option>
          <option value="revenue_by_aircraft">Revenue By Aircraft</option>
        </select>
      </div>

      {reportType === 'passengers_above_18_years_or_below_18_years' && (
        <>
          <div className="form-group">
            <label>Flight Number:</label>
            <input type="text" value={flightNumber} onChange={(e) => setFlightNumber(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Age Group:</label>
            <select value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)}>
              <option value="">Select Age Group</option>
              <option value="adult">Greater than 18</option>
              <option value="child">Less than 18</option>
            </select>
          </div>
        </>
      )}

      {(reportType === 'flights_by_route') && (
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

      {(reportType === 'passengers_by_destination') && (
        <div className="form-group">
          <label>Destination:</label>
          <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} />
        </div>
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

      <div className="form-group">
        <button onClick={handleGenerateReport} className="generate-button" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Report'}
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {reportData.length > 0 && (
        <div className="report-results">
          <h3>Report Results</h3>
          <table className="report-table" border="1">
            <thead>
              <tr>
                {Object.keys(reportData[0]).map((key) => (
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

          {/* Download button */}
          <button onClick={handleDownloadPDF} className="generate-button">
            Download PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default Report;
