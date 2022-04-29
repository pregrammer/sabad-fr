import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./Styles/shared.scss";
import Base from "./Pages/Panel/Base";
import Classes from "./Pages/Panel/Classes/Classes";
import ClassSchedule from "./Pages/Panel/Classes/ClassSchedule";
import Courses from "./Pages/Panel/Courses";
import Colleges from "./Pages/Panel/Management/Colleges";
import FieldOfStudies from "./Pages/Panel/Management/FieldOfStudies";
import Management from "./Pages/Panel/Management/Management";
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
import RequireAuth from "./Components/Shared/RequireAuth";
import HasRole from "./Components/Shared/HasRole";
import IsAuth from "./Components/Shared/IsAuth";
import MsgCountProvider from "./Components/Contexts/MsgCountProvider";
import Semesters from "./Pages/Panel/Management/Semesters";
import Professors from "./Pages/Panel/Professors";

/* const ROLES = {
  admin: 1,
  sgm: 2, // specialized group manager
  ggm: 3, // general group manager
  expert: 4,
}; */

function App() {
  return (
    <BrowserRouter>
      <MsgCountProvider>
        <Routes>
          <Route path="/" element={<IsAuth />} />

          {/* protected routes */}
          <Route element={<RequireAuth />}>
            <Route path="/panel" element={<Base />}>
              <Route path="messages" element={<Messages />}>
                <Route path="inbox" element={<Inbox />} />
                <Route path="saved" element={<Saved />} />
                <Route path="send" element={<Send />} />
                <Route path="sent" element={<Sent />} />
              </Route>
              <Route path="reports" element={<Reports />} />
              <Route element={<HasRole allowedRoles={[1, 2, 3, 4]} />}>
                <Route path="courses" element={<Courses />} />
              </Route>
              <Route path="classes" element={<Classes />} />
              <Route path="professors" element={<Professors />} />
              <Route path="class-schedule" element={<ClassSchedule />} />
              <Route element={<HasRole allowedRoles={[1, 2, 3, 4]} />}>
                <Route path="schedules" element={<Schedules />} />
              </Route>
              <Route path="weekly-schedules" element={<Weekly />} />
              <Route path="test-schedules" element={<Test />} />
              <Route element={<HasRole allowedRoles={[1, 2, 3, 4]} />}>
                <Route path="management" element={<Management />}>
                  <Route path="users" element={<Users />} />
                  <Route path="field-of-studies" element={<FieldOfStudies />} />
                  <Route path="colleges" element={<Colleges />} />
                  <Route path="times" element={<Times />} />
                  <Route path="semester" element={<Semesters />} />
                </Route>
              </Route>
            </Route>
          </Route>
          <Route path="*" element={<h1>صفحه ی مورد نظر پیدا نشد! 404</h1>} />
        </Routes>
      </MsgCountProvider>
    </BrowserRouter>
  );
}

export default App;

/*
courese: 2
schedule: 2, 3
semester and management: 1
*/
