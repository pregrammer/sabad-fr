import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./Styles/shared.scss";
import Login from "./Pages/Login";
import Base from "./Pages/Panel/Base";
import Classes from "./Pages/Panel/Classes/Classes";
import ClassSchedule from "./Pages/Panel/Classes/ClassSchedule";
import Courses from "./Pages/Panel/Courses";
import Colleges from "./Pages/Panel/Management/Colleges";
import FieldOfStudies from "./Pages/Panel/Management/FieldOfStudies";
import Management from "./Pages/Panel/Management/Management";
import Professors from "./Pages/Panel/Management/Professors";
import Times from "./Pages/Panel/Management/Times";
import Users from "./Pages/Panel/Management/Users";
import Inbox from "./Pages/Panel/Messages/Inbox";
import Messages from "./Pages/Panel/Messages/Messages";
import Saved from "./Pages/Panel/Messages/Saved";
import Send from "./Pages/Panel/Messages/Send";
import Sent from "./Pages/Panel/Messages/Sent";
import Reports from "./Pages/Panel/Reports";
import Schedules from "./Pages/Panel/Schedule/Schedules";
import Test from "./Pages/Panel/Schedule/Test";
import Weekly from "./Pages/Panel/Schedule/Weekly";
import Semester from "./Pages/Panel/Semester";
import RequireAuth from "./Components/Shared/RequireAuth";

/* const ROLES = {
  admin: 1,
  sgm: 2, // specialized group manager
  ggm: 3, // general group manager
  expert: 4,
}; */

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* when you want to back to panel when you reOpen the browser and still loged in.
        <Route element={<IsAuth />}>
          <Route path="/" element={<Login />} />
        </Route> 
        */}
        <Route path="/" element={<Login />} />

        {/* protected routes */}
        <Route element={<RequireAuth allowedRoles={[1, 2, 3, 4]} />}>
          <Route path="/panel" element={<Base />}>
            <Route path="messages" element={<Messages />}>
              <Route path="inbox" element={<Inbox />} />
              <Route path="saved" element={<Saved />} />
              <Route path="send" element={<Send />} />
              <Route path="sent" element={<Sent />} />
            </Route>
            <Route path="reports" element={<Reports />} />
            <Route element={<RequireAuth allowedRoles={[1, 2, 3, 4]} />}>
              <Route path="courses" element={<Courses />} />
            </Route>
            <Route path="classes" element={<Classes />} />
            <Route path="class-schedule" element={<ClassSchedule />} />
            <Route element={<RequireAuth allowedRoles={[1, 2, 3, 4]} />}>
              <Route path="schedules" element={<Schedules />} />
            </Route>
            <Route path="weekly-schedules" element={<Weekly />} />
            <Route path="test-schedules" element={<Test />} />
            <Route element={<RequireAuth allowedRoles={[1, 2, 3, 4]} />}>
              <Route path="semester" element={<Semester />} />
              <Route path="management" element={<Management />}>
                <Route path="users" element={<Users />} />
                <Route path="professors" element={<Professors />} />
                <Route path="field-of-studies" element={<FieldOfStudies />} />
                <Route path="colleges" element={<Colleges />} />
                <Route path="times" element={<Times />} />
              </Route>
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<h1>No Page found! 404</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

/*
courese: 2
schedule: 2, 3
semester and management: 1
*/
