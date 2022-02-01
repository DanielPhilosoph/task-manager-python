import { useEffect, useState } from "react";
import axios from "axios";

import { Table } from "react-bootstrap";

function App() {
  const [processes, setProcesses] = useState(null);
  const [cpuPercentTotal, setCpuPercentTotal] = useState(null);
  useEffect(() => {
    async function getCpuData() {
      try {
        const response = await axios.get("http://localhost:5000/get-info");
        setProcesses(response.data["PID list"]);
        setCpuPercentTotal(response.data["cpu_percent"]);
      } catch (error) {
        console.log(error);
      }
    }
    getCpuData();

    // setTimeout(function () {
    //   window.location.reload();
    // }, 10000);
  }, []);

  const onSaveClick = async () => {
    try {
      await axios.post("http://localhost:5000/save", {
        data: processes,
      });
      alert("saved!");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="App">
      <h1>Task Manager</h1>
      <br />
      <button onClick={onSaveClick}>Save</button>
      <br />
      <br />
      <h3>Total CPU percentage: {cpuPercentTotal}</h3>
      <br />
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            {processes ? (
              Object.keys(processes[0]).map((key) => {
                return <th key={key}>{key}</th>;
              })
            ) : (
              <th></th>
            )}
          </tr>
        </thead>
        <tbody>
          {processes ? (
            processes.map((process, i) => {
              return (
                <tr key={process.name + process.cpu_percent + process.pid}>
                  <td>{i}</td>
                  <td>{process.cpu_percent}</td>
                  <td>{process.name}</td>
                  <td>{process.pid}</td>
                </tr>
              );
            })
          ) : (
            <tr></tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}

export default App;
