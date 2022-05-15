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
          "شنبه",
          "یکشنبه",
          "دوشنبه",
          "سه شنبه",
          "چهارشنبه",
          "پنجشنبه",
        ];
        const htmlError = data.map(
          (schedule: any) =>
            `<b>:با این دروس تداخل دارد</b>
          <div style="border: 1px solid gray; margin-top: 10px; border-radius: 10px; color: black; font-size: 16px">
          <div><b>نام درس: </b><small>${schedule.course_name}</small></div>
          <div><b>عنوان کلاس: </b><small>${schedule.class_title}</small></div>
          <div><b>نام استاد: </b><small>${
            schedule.prof_lastName + " " + schedule.prof_firstName
          }</small></div>
          <div><b>زمان: </b><small>${schedule.time_start} تا ${
              schedule.time_end
            } (${
              schedule.weekKind === 1
                ? "ثابت"
                : schedule.weekKind === 2
                ? "زوج"
                : "فرد"
            })</small></div>
          <div><b>روز: </b><small>${days[schedule.weekDay - 1]}</small></div>
          </div>
          `
        );
        Swal.fire({
          icon: "warning",
          html: htmlError,
          showConfirmButton: false,
          showCancelButton: true,
          cancelButtonText: "باشه",
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
          <h4>{editData ? "ویرایش" : "افزودن"} برنامه</h4>
          <div className="group">
            <div>
              <label>نام درس:</label>
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
              <label>نام استاد:</label>
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
              <label>گروه دزسی:</label>
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
              <label>عنوان کلاس اول:</label>
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
              <label>زمان کلاس اول:</label>
              <select
                name="time1_id"
                value={formik.values.time1_id}
                onChange={formik.handleChange}
              >
                {times.map((time: any) => (
                  <option key={time.id} value={time.id}>
                    از {time.start} تا {time.end}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>تکرار کلاس اول:</label>
              <select
                name="weekKindClass1"
                value={formik.values.weekKindClass1}
                onChange={formik.handleChange}
              >
                <option value="1">هر هفته</option>
                <option value="2">هفته های زوج</option>
                <option value="3">هفته های فرد</option>
              </select>
            </div>
          </div>
          <div className="group">
            <div>
              <label>عنوان کلاس دوم:</label>
              <select
                name="class2_id"
                value={formik.values.class2_id}
                onChange={formik.handleChange}
              >
                <option value="-1">ندراد</option>
                {classes.map((kelas: any) => (
                  <option key={kelas.id} value={kelas.id}>
                    {kelas.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>زمان کلاس دوم:</label>
              <select
                name="time2_id"
                value={formik.values.time2_id}
                onChange={formik.handleChange}
              >
                <option value="-1">ندراد</option>
                {times.map((time: any) => (
                  <option key={time.id} value={time.id}>
                    از {time.start} تا {time.end}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>تکرار کلاس دوم:</label>
              <select
                name="weekKindClass2"
                value={formik.values.weekKindClass2}
                onChange={formik.handleChange}
              >
                <option value="-1">ندراد</option>
                <option value="1">هر هفته</option>
                <option value="2">هفته های زوج</option>
                <option value="3">هفته های فرد</option>
              </select>
            </div>
          </div>
          <div className="group">
            <div>
              <label>حداقل ظرفیت کلاس:</label>
              <input
                type="number"
                required
                name="minCapacity"
                value={formik.values.minCapacity}
                onChange={formik.handleChange}
              />
            </div>
            <div>
              <label>حداکثر ظرفیت کلاس:</label>
              <input
                type="number"
                required
                name="maxCapacity"
                value={formik.values.maxCapacity}
                onChange={formik.handleChange}
              />
            </div>
            <div>
              <label>رشته ی میزبان</label>
              <select
                name="host_field_of_study_id"
                value={formik.values.host_field_of_study_id}
                onChange={formik.handleChange}
              >
                <option value="-1">ندراد</option>
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
              <label>روز کلاس اول:</label>
              <select
                name="weekDay1"
                value={formik.values.weekDay1}
                onChange={formik.handleChange}
              >
                <option value="1">شنبه</option>
                <option value="2">یکشنبه</option>
                <option value="3">دوشنبه</option>
                <option value="4">سه شنبه</option>
                <option value="5">چهارشنبه</option>
                <option value="6">پنجشنبه</option>
              </select>
            </div>
            <div>
              <label>روز کلاس دوم:</label>
              <select
                name="weekDay2"
                value={formik.values.weekDay2}
                onChange={formik.handleChange}
              >
                <option value="-1">ندارد</option>
                <option value="1">شنبه</option>
                <option value="2">یکشنبه</option>
                <option value="3">دوشنبه</option>
                <option value="4">سه شنبه</option>
                <option value="5">چهارشنبه</option>
                <option value="6">پنجشنبه</option>
              </select>
            </div>
            <div>
              <label>روز امتحان</label>
              <select
                name="testDay"
                value={formik.values.testDay}
                onChange={formik.handleChange}
              >
                <option value="15">ندراد</option>
                {testDates && (
                  <>
                    <option value="1">
                      روز اول ({testDates.first.year}/{testDates.first.month}/
                      {testDates.first.day})
                    </option>
                    <option value="2">
                      روز دوم ({testDates.second.year}/{testDates.second.month}/
                      {testDates.second.day})
                    </option>
                    <option value="3">
                      روز سوم ({testDates.third.year}/{testDates.third.month}/
                      {testDates.third.day})
                    </option>
                    <option value="4">
                      روز چهارم ({testDates.fourth.year}/
                      {testDates.fourth.month}/{testDates.fourth.day})
                    </option>
                    <option value="5">
                      روز پنجم ({testDates.fifth.year}/{testDates.fifth.month}/
                      {testDates.fifth.day})
                    </option>
                    <option value="6">
                      روز ششم ({testDates.sixth.year}/{testDates.sixth.month}/
                      {testDates.sixth.day})
                    </option>
                    <option value="7">
                      روز هفتم ({testDates.seventh.year}/
                      {testDates.seventh.month}/{testDates.seventh.day})
                    </option>
                    <option value="8">
                      روز هشتم ({testDates.eighth.year}/{testDates.eighth.month}
                      /{testDates.eighth.day})
                    </option>
                    <option value="9">
                      روز نهم ({testDates.ninth.year}/{testDates.ninth.month}/
                      {testDates.ninth.day})
                    </option>
                    <option value="10">
                      روز دهم ({testDates.tenth.year}/{testDates.tenth.month}/
                      {testDates.tenth.day})
                    </option>
                    <option value="11">
                      روز یازدهم ({testDates.eleventh.year}/
                      {testDates.eleventh.month}/{testDates.eleventh.day})
                    </option>
                    <option value="12">
                      روز دوازدهم ({testDates.twelfth.year}/
                      {testDates.twelfth.month}/{testDates.twelfth.day})
                    </option>
                    <option value="13">
                      روز سیزدهم ({testDates.thirteenth.year}/
                      {testDates.thirteenth.month}/{testDates.thirteenth.day})
                    </option>
                    <option value="14">
                      روز چهاردهم ({testDates.fourteenth.year}/
                      {testDates.fourteenth.month}/{testDates.fourteenth.day})
                    </option>
                  </>
                )}
              </select>
            </div>
          </div>
          <div className="group">
            <div>
              <label>نوبت امتحان:</label>
              <select
                name="testDayPart"
                value={formik.values.testDayPart}
                onChange={formik.handleChange}
              >
                <option value="4">ندراد</option>
                <option value="1">اول</option>
                <option value="2">دوم</option>
                <option value="3">سوم</option>
              </select>
            </div>
            {!editData && (
              <div>
                <label>دسترسی به:</label>
                <select
                  name="accessibleFor_user_id"
                  value={formik.values.accessibleFor_user_id}
                  onChange={formik.handleChange}
                >
                  <option value="-1">ندارد</option>
                  {users.map((user: any) => {
                    if (user.role === 3) {
                      return (
                        <option key={user.id} value={user.id}>
                          {user.firstName} {user.lastName} (مدیر گروه{" "}
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
            {editData ? "ویرایش" : "افزودن"}
          </button>
        </form>
      </div>
      {(loading || selectsLoading) && <LoadingModal />}
    </>
  );
}

export default ScheduleSubmit;
