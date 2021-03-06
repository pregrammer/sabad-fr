import { useFormik } from "formik";
import { toast } from "react-toastify";
import LoadingModal from "./LoadingModal";
import useAxiosFunction from "../../Helpers/useAxiosFunction";
import { useState, useEffect } from "react";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthProvider";
import Swal from "sweetalert2";

function ScheduleSubmit({ setEditOpen, editData, updateRows }: any) {
  const [selectsLoading, setSelectsLoading] = useState(false);
  const [classes, setclasses]: any = useState([]);
  const [times, setTimes]: any = useState([]);
  const [courses, setCourses]: any = useState([]);
  const [professors, setProfessors]: any = useState([]);
  const [users, setUsers]: any = useState([]);
  const [fosList, setFosList]: any = useState([]);
  const [testDates, setTestDates]: any = useState();

  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();

  const [data, loading, axiosFetch]: any = useAxiosFunction();

  useEffect(() => {
    getSelectsData();
  }, []);

  function getSelectsData() {
    let endpoints = [
      "classes?forSelect=true",
      "times?forSelect=true",
      "courses?forSelect=true",
      "professors?forSelect=true",
      "users/for-select",
      "field_of_studies?forSelect=true",
      "semesters/last-test-dates",
    ];

    setSelectsLoading(true);
    Promise.all(endpoints.map((endpoint) => axios.get(endpoint)))
      .then(
        ([
          { data: classes },
          { data: times },
          { data: courses },
          { data: professors },
          { data: users },
          { data: fosList },
          { data: testDates },
        ]) => {
          setclasses(classes);
          setTimes(times);
          setCourses(courses);
          setProfessors(professors);
          setUsers(users);
          setFosList(fosList);
          const tstdts = {
            first: JSON.parse(testDates.first),
            second: JSON.parse(testDates.second),
            third: JSON.parse(testDates.third),
            fourth: JSON.parse(testDates.fourth),
            fifth: JSON.parse(testDates.fifth),
            sixth: JSON.parse(testDates.sixth),
            seventh: JSON.parse(testDates.seventh),
            eighth: JSON.parse(testDates.eighth),
            ninth: JSON.parse(testDates.ninth),
            tenth: JSON.parse(testDates.tenth),
            eleventh: JSON.parse(testDates.eleventh),
            twelfth: JSON.parse(testDates.twelfth),
            thirteenth: JSON.parse(testDates.thirteenth),
            fourteenth: JSON.parse(testDates.fourteenth),
          };
          setTestDates(tstdts);
        }
      )
      .catch((error: any) => {
        if (error.response) {
          if (error.response.status === 401) {
            if (Object.keys(auth).length !== 0) {
              setAuth({});
              navigate("/", { replace: true });
            }
          } else {
            toast.error(error.response.data.message, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          }
        }
      })
      .finally(() => setSelectsLoading(false));
  }

  const formik: any = useFormik({
    initialValues: {
      testDay: editData ? editData.testDay : "1",
      testDayPart: editData ? editData.testDayPart : "1",
      maxCapacity: editData ? editData.maxCapacity : "30",
      minCapacity: editData ? editData.minCapacity : "15",
      courseGroup: editData ? editData.courseGroup : "1",
      weekKindClass1: editData ? editData.weekKindClass1 : "1",
      weekDay1: editData ? editData.weekDay1 : "1",
      class1_id: editData ? editData.class1_id : "",
      time1_id: editData ? editData.time1_id : "",
      weekKindClass2: editData?.weekKindClass2 ? editData.weekKindClass2 : "-1",
      weekDay2: editData?.weekDay2 ? editData.weekDay2 : "-1",
      class2_id: editData?.class2_id ? editData.class2_id : "-1",
      time2_id: editData?.time2_id ? editData.time2_id : "-1",
      host_field_of_study_id: editData?.host_fos_id
        ? editData.host_fos_id
        : "-1",
      course_id: editData ? editData.course_id : "",
      professor_id: editData ? editData.professor_id : "",
      accessibleFor_user_id: "-1",
    },
    onSubmit: (values) => {
      if (!editData) {
        const postData = {
          testDay: Number(values.testDay),
          testDayPart: Number(values.testDayPart),
          maxCapacity: Number(values.maxCapacity),
          minCapacity: Number(values.minCapacity),
          courseGroup: Number(values.courseGroup),
          weekKindClass1: Number(values.weekKindClass1),
          weekDay1: Number(values.weekDay1),
          class1_id: Number(
            values.class1_id === "" ? classes[0].id : values.class1_id
          ),
          time1_id: Number(
            values.time1_id === "" ? times[0].id : values.time1_id
          ),
          weekKindClass2: Number(values.weekKindClass2),
          weekDay2: Number(values.weekDay2),
          class2_id: Number(values.class2_id),
          time2_id: Number(values.time2_id),
          host_field_of_study_id: Number(values.host_field_of_study_id),
          course_id: Number(
            values.course_id === "" ? courses[0].id : values.course_id
          ),
          professor_id: Number(
            values.professor_id === "" ? professors[0].id : values.professor_id
          ),
          accessibleFor_user_id: Number(
            values.accessibleFor_user_id === ""
              ? users[0].id
              : values.accessibleFor_user_id
          ),
        };
        axiosFetch({
          method: "POST",
          url: "/schedules",
          requestConfig: {
            headers: {
              "Content-Type": "application/json",
            },
            data: postData,
          },
        });
      } else {
        const putData = {
          id: editData.id,
          testDay: Number(values.testDay),
          testDayPart: Number(values.testDayPart),
          maxCapacity: Number(values.maxCapacity),
          minCapacity: Number(values.minCapacity),
          courseGroup: Number(values.courseGroup),
          weekKindClass1: Number(values.weekKindClass1),
          weekDay1: Number(values.weekDay1),
          class1_id: Number(
            values.class1_id === "" ? classes[0].id : values.class1_id
          ),
          time1_id: Number(
            values.time1_id === "" ? times[0].id : values.time1_id
          ),
          weekKindClass2: Number(values.weekKindClass2),
          weekDay2: Number(values.weekDay2),
          class2_id: Number(values.class2_id),
          time2_id: Number(values.time2_id),
          host_field_of_study_id: Number(values.host_field_of_study_id),
          course_id: Number(
            values.course_id === "" ? courses[0].id : values.course_id
          ),
          professor_id: Number(
            values.professor_id === "" ? professors[0].id : values.professor_id
          ),
        };
        axiosFetch({
          method: "PUT",
          url: "/schedules",
          requestConfig: {
            headers: {
              "Content-Type": "application/json",
            },
            data: putData,
          },
        });
      }
    },
  });

  useEffect(() => {
    if (Object.keys(data).length !== 0) {
      if (data.message) {
        toast.success(data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        updateRows((prev: any) => !prev);
        setEditOpen((prev: any) => !prev);
      } else {
        const days = [
          "????????",
          "????????????",
          "????????????",
          "???? ????????",
          "????????????????",
          "??????????????",
        ];
        const htmlError = data.map(
          (schedule: any) =>
            `<b>:???? ?????? ???????? ?????????? ????????</b>
          <div style="border: 1px solid gray; margin-top: 10px; border-radius: 10px; color: black; font-size: 16px">
          <div><b>?????? ??????: </b><small>${schedule.course_name}</small></div>
          <div><b>?????????? ????????: </b><small>${schedule.class_title}</small></div>
          <div><b>?????? ??????????: </b><small>${
            schedule.prof_lastName + " " + schedule.prof_firstName
          }</small></div>
          <div><b>????????: </b><small>${schedule.time_start} ???? ${
              schedule.time_end
            } (${
              schedule.weekKind === 1
                ? "????????"
                : schedule.weekKind === 2
                ? "??????"
                : "??????"
            })</small></div>
          <div><b>??????: </b><small>${days[schedule.weekDay - 1]}</small></div>
          </div>
          `
        );
        Swal.fire({
          icon: "warning",
          html: htmlError,
          showConfirmButton: false,
          showCancelButton: true,
          cancelButtonText: "????????",
        });
      }
    }
  }, [data]);

  return (
    <>
      <div
        className="bgc-modal"
        onClick={() => setEditOpen((prev: any) => !prev)}
      ></div>
      <div
        className="schedule-submit-content"
        style={editData ? { height: "590px" } : {}}
      >
        <span
          className="close"
          onClick={() => setEditOpen((prev: any) => !prev)}
        >
          &times;
        </span>
        <form onSubmit={formik.handleSubmit}>
          <h4>{editData ? "????????????" : "????????????"} ????????????</h4>
          <div className="group">
            <div>
              <label>?????? ??????:</label>
              <select
                name="course_id"
                value={formik.values.course_id}
                onChange={formik.handleChange}
              >
                {courses.map((course: any) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>?????? ??????????:</label>
              <select
                name="professor_id"
                value={formik.values.professor_id}
                onChange={formik.handleChange}
              >
                {professors.map((professor: any) => (
                  <option key={professor.id} value={professor.id}>
                    {professor.firstName} {professor.lastName} (
                    {professor.field_of_study_name})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>???????? ????????:</label>
              <input
                required
                type="number"
                name="courseGroup"
                value={formik.values.courseGroup}
                onChange={formik.handleChange}
              />
            </div>
          </div>
          <div className="group">
            <div>
              <label>?????????? ???????? ??????:</label>
              <select
                name="class1_id"
                value={formik.values.class1_id}
                onChange={formik.handleChange}
              >
                {classes.map((kelas: any) => (
                  <option key={kelas.id} value={kelas.id}>
                    {kelas.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>???????? ???????? ??????:</label>
              <select
                name="time1_id"
                value={formik.values.time1_id}
                onChange={formik.handleChange}
              >
                {times.map((time: any) => (
                  <option key={time.id} value={time.id}>
                    ???? {time.start} ???? {time.end}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>?????????? ???????? ??????:</label>
              <select
                name="weekKindClass1"
                value={formik.values.weekKindClass1}
                onChange={formik.handleChange}
              >
                <option value="1">???? ????????</option>
                <option value="2">???????? ?????? ??????</option>
                <option value="3">???????? ?????? ??????</option>
              </select>
            </div>
          </div>
          <div className="group">
            <div>
              <label>?????????? ???????? ??????:</label>
              <select
                name="class2_id"
                value={formik.values.class2_id}
                onChange={formik.handleChange}
              >
                <option value="-1">??????????</option>
                {classes.map((kelas: any) => (
                  <option key={kelas.id} value={kelas.id}>
                    {kelas.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>???????? ???????? ??????:</label>
              <select
                name="time2_id"
                value={formik.values.time2_id}
                onChange={formik.handleChange}
              >
                <option value="-1">??????????</option>
                {times.map((time: any) => (
                  <option key={time.id} value={time.id}>
                    ???? {time.start} ???? {time.end}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>?????????? ???????? ??????:</label>
              <select
                name="weekKindClass2"
                value={formik.values.weekKindClass2}
                onChange={formik.handleChange}
              >
                <option value="-1">??????????</option>
                <option value="1">???? ????????</option>
                <option value="2">???????? ?????? ??????</option>
                <option value="3">???????? ?????? ??????</option>
              </select>
            </div>
          </div>
          <div className="group">
            <div>
              <label>?????????? ?????????? ????????:</label>
              <input
                type="number"
                required
                name="minCapacity"
                value={formik.values.minCapacity}
                onChange={formik.handleChange}
              />
            </div>
            <div>
              <label>???????????? ?????????? ????????:</label>
              <input
                type="number"
                required
                name="maxCapacity"
                value={formik.values.maxCapacity}
                onChange={formik.handleChange}
              />
            </div>
            <div>
              <label>???????? ?? ????????????</label>
              <select
                name="host_field_of_study_id"
                value={formik.values.host_field_of_study_id}
                onChange={formik.handleChange}
              >
                <option value="-1">??????????</option>
                {fosList.map((fos: any) => (
                  <option key={fos.id} value={fos.id}>
                    {fos.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="group">
            <div>
              <label>?????? ???????? ??????:</label>
              <select
                name="weekDay1"
                value={formik.values.weekDay1}
                onChange={formik.handleChange}
              >
                <option value="1">????????</option>
                <option value="2">????????????</option>
                <option value="3">????????????</option>
                <option value="4">???? ????????</option>
                <option value="5">????????????????</option>
                <option value="6">??????????????</option>
              </select>
            </div>
            <div>
              <label>?????? ???????? ??????:</label>
              <select
                name="weekDay2"
                value={formik.values.weekDay2}
                onChange={formik.handleChange}
              >
                <option value="-1">??????????</option>
                <option value="1">????????</option>
                <option value="2">????????????</option>
                <option value="3">????????????</option>
                <option value="4">???? ????????</option>
                <option value="5">????????????????</option>
                <option value="6">??????????????</option>
              </select>
            </div>
            <div>
              <label>?????? ????????????</label>
              <select
                name="testDay"
                value={formik.values.testDay}
                onChange={formik.handleChange}
              >
                <option value="15">??????????</option>
                {testDates && (
                  <>
                    <option value="1">
                      ?????? ?????? ({testDates.first.year}/{testDates.first.month}/
                      {testDates.first.day})
                    </option>
                    <option value="2">
                      ?????? ?????? ({testDates.second.year}/{testDates.second.month}/
                      {testDates.second.day})
                    </option>
                    <option value="3">
                      ?????? ?????? ({testDates.third.year}/{testDates.third.month}/
                      {testDates.third.day})
                    </option>
                    <option value="4">
                      ?????? ?????????? ({testDates.fourth.year}/
                      {testDates.fourth.month}/{testDates.fourth.day})
                    </option>
                    <option value="5">
                      ?????? ???????? ({testDates.fifth.year}/{testDates.fifth.month}/
                      {testDates.fifth.day})
                    </option>
                    <option value="6">
                      ?????? ?????? ({testDates.sixth.year}/{testDates.sixth.month}/
                      {testDates.sixth.day})
                    </option>
                    <option value="7">
                      ?????? ???????? ({testDates.seventh.year}/
                      {testDates.seventh.month}/{testDates.seventh.day})
                    </option>
                    <option value="8">
                      ?????? ???????? ({testDates.eighth.year}/{testDates.eighth.month}
                      /{testDates.eighth.day})
                    </option>
                    <option value="9">
                      ?????? ?????? ({testDates.ninth.year}/{testDates.ninth.month}/
                      {testDates.ninth.day})
                    </option>
                    <option value="10">
                      ?????? ?????? ({testDates.tenth.year}/{testDates.tenth.month}/
                      {testDates.tenth.day})
                    </option>
                    <option value="11">
                      ?????? ???????????? ({testDates.eleventh.year}/
                      {testDates.eleventh.month}/{testDates.eleventh.day})
                    </option>
                    <option value="12">
                      ?????? ?????????????? ({testDates.twelfth.year}/
                      {testDates.twelfth.month}/{testDates.twelfth.day})
                    </option>
                    <option value="13">
                      ?????? ???????????? ({testDates.thirteenth.year}/
                      {testDates.thirteenth.month}/{testDates.thirteenth.day})
                    </option>
                    <option value="14">
                      ?????? ?????????????? ({testDates.fourteenth.year}/
                      {testDates.fourteenth.month}/{testDates.fourteenth.day})
                    </option>
                  </>
                )}
              </select>
            </div>
          </div>
          <div className="group">
            <div>
              <label>???????? ????????????:</label>
              <select
                name="testDayPart"
                value={formik.values.testDayPart}
                onChange={formik.handleChange}
              >
                <option value="4">??????????</option>
                <option value="1">??????</option>
                <option value="2">??????</option>
                <option value="3">??????</option>
              </select>
            </div>
            {!editData && (
              <div>
                <label>???????????? ????:</label>
                <select
                  name="accessibleFor_user_id"
                  value={formik.values.accessibleFor_user_id}
                  onChange={formik.handleChange}
                >
                  <option value="-1">??????????</option>
                  {users.map((user: any) => {
                    if (user.role === 3) {
                      return (
                        <option key={user.id} value={user.id}>
                          {user.firstName} {user.lastName} (???????? ????????{" "}
                          {user.field_of_study_name})
                        </option>
                      );
                    }
                  })}
                </select>
              </div>
            )}
          </div>

          <button
            type="submit"
            style={
              editData
                ? { position: "absolute", bottom: "55px", left: "20px" }
                : {}
            }
          >
            {editData ? "????????????" : "????????????"}
          </button>
        </form>
      </div>
      {(loading || selectsLoading) && <LoadingModal />}
    </>
  );
}

export default ScheduleSubmit;
