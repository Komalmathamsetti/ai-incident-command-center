import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import IncidentDetais from "./pages/IncidentDetails.jsx";
function App(){
  return(
    <Routes>
      <Route path="/" element={<Dashboard />}/>
      <Route path="/incidents/:id" element={<IncidentDetais/>}/>
    </Routes>
  );
}
export default App;