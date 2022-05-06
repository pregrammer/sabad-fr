import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import useAxiosFunction from "../../../Helpers/useAxiosFunction";
import { useEffect, useState } from "react";
import axios from "../../../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../Components/Contexts/AuthProvider";
import LoadingModal from "../../../Components/Modals/LoadingModal";

function Weekly() {
  const { semId } = useParams();
  const [schedule, scheduleLoading, axiosFetch]: any = useAxiosFunction();
  const [data, emailLoading, axiosFetch2]: any = useAxiosFunction();
  const [singleSchedule, ssLoading, axiosFetch3]: any = useAxiosFunction();
  const [update, setUpdate] = useState(false);
  const [selectsLoading, setSelectsLoading] = useState(false);
  const [professors, setProfessors]: any = useState([]);
  const [fosList, setFosList]: any = useState([]);
  const [classes, setClasses]: any = useState([]);
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    field_of_study_id: auth.field_of_study_id,
    professor_id: "all",
    termNumber: "odd",
    class_id: "all",
  });

  useEffect(() => {
    getSelectsData();
  }, []);

  function getSelectsData() {
    let endpoints = [
      "field_of_studies?forSelect=true",
      "professors?forSelect=true",
      "classes?forSelect=true",
    ];

    setSelectsLoading(true);
    Promise.all(endpoints.map((endpoint) => axios.get(endpoint)))
      .then(([{ data: fosList }, { data: professors }, { data: classes }]) => {
        setFosList(fosList);
        // if user refresh the page, auth removed. we instead use first fos.
        if (!filters.field_of_study_id) {
          setFilters((prev: any) => ({
            ...prev,
            field_of_study_id: fosList[0].id,
          }));
        }
        setProfessors(professors);
        setClasses(classes);
      })
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

  useEffect(() => {
    axiosFetch({
      method: "GET",
      url: `/schedules/weekly?field_of_study_id=${filters.field_of_study_id}&professor_id=${filters.professor_id}&termNumber=${filters.termNumber}&class_id=${filters.class_id}&semester_id=${semId}`,
    });
    // eslint-disable-next-line
  }, [update]);

  function handleEmailClick() {
    if (filters.professor_id === "all") {
      Swal.fire({
        title: "لطفا ابتدا استاد مورد نظر را از قسمت فیلتر انتخاب نمایید",
        icon: "info",
        showCancelButton: true,
        showConfirmButton: false,
        cancelButtonColor: "#888",
        cancelButtonText: "باشه",
      });
      return;
    }

    const professor = professors?.filter(
      (professor: any) => professor.id == Number(filters.professor_id)
    );
    const prof = professor
      ? `${professor[0].firstName} ${professor[0].lastName}`
      : "???";
    Swal.fire({
      title: `آیا مایلید برنامه ی هفتگی را برای ${prof} ایمیل کنید؟`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#888",
      confirmButtonText: "بله",
      cancelButtonText: "خیر",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosFetch2({
          method: "POST",
          url: `/schedules/weekly-email`,
          requestConfig: {
            data: {
              professor_id: professor[0].id,
              semester_id: semId,
            },
          },
        });
      }
    });
  }

  useEffect(() => {
    if (Object.keys(data).length !== 0) {
      toast.success(data.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }, [data]);

  function handleFilterClick() {
    setUpdate((prev: boolean) => !prev);
  }

  function handleFilterChange(e: any) {
    switch (e.target.name) {
      case "fos":
        setFilters((prev: any) => ({
          ...prev,
          field_of_study_id: e.target.value,
        }));
        break;
      case "professors":
        setFilters((prev: any) => ({ ...prev, professor_id: e.target.value }));
        break;
      case "termNumber":
        setFilters((prev: any) => ({ ...prev, termNumber: e.target.value }));
        break;
      case "classes":
        setFilters((prev: any) => ({ ...prev, class_id: e.target.value }));
        break;
      default:
        break;
    }
  }

  function handleScheduleClick(courseName: string, scheduleId: number) {
    Swal.fire({
      title: `آیا مایلید برنامه ی درس ${courseName} را مشاهده کنید؟`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#888",
      confirmButtonText: "بله",
      cancelButtonText: "خیر",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosFetch3({
          method: "GET",
          url: `/schedules/schedule?id=${scheduleId}`,
        });
      }
    });
  }

  useEffect(() => {
    if (Object.keys(singleSchedule).length !== 0) {
      const weekDays = [
        "شنبه",
        "یکشنبه",
        "دوشنبه",
        "سه شنبه ",
        "چهارشنبه",
        "پنجشنبه",
      ];
      const schedule = singleSchedule;
      const scheduleHtml = (
        <div
          className="schedule"
          style={{
            borderRadius: "5px",
            padding: "20px",
            border: "1px solid gray",
            color: "black",
            position: "relative",
            direction: "rtl",
          }}
        >
          <div className="top">
            <div
              className="group"
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "15px",
              }}
            >
              <div>
                <span>نام درس:</span>
                <span>{schedule.course_name}</span>
              </div>
              <div>
                <span>کد درس:</span>
                <span>{schedule.course_code}</span>
              </div>
              <div>
                <span>نام استاد:</span>
                <span>
                  {schedule.professor_firstName} {schedule.professor_lastName}
                </span>
              </div>
              <div>
                <span>گروه درسی:</span>
                <span>{schedule.courseGroup}</span>
              </div>
              <div>
                <span>نیمسال:</span>
                <span>
                  {schedule.yearPart === 1
                    ? "اول"
                    : schedule.yearPart === 2
                    ? "دوم"
                    : "تابستان"}
                </span>
              </div>
            </div>
          </div>
          <div className="down">
            <div
              className="group"
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "15px",
              }}
            >
              <div>
                <span>حداقل ظرفیت کلاس:</span>
                <span>{schedule.minCapacity} نفر</span>
              </div>
              <div>
                <span>حداکثر ظرفیت کلاس:</span>
                <span>{schedule.maxCapacity} نفر</span>
              </div>
              <div>
                <span>روز امتحان:</span>
                {schedule.testDayName === "ندارد" ? (
                  <span>بدون امتحان</span>
                ) : (
                  <span>
                    روز {schedule.testDayName} ({schedule.test_dates.year}/
                    {schedule.test_dates.month}/{schedule.test_dates.day})
                  </span>
                )}
              </div>
              <div>
                <span>نوبت امتحان:</span>
                <span>
                  {schedule.testDayPart === 1
                    ? "اول"
                    : schedule.testDayPart === 2
                    ? "دوم"
                    : schedule.testDayPart === 3
                    ? "سوم"
                    : "بدون امتحان"}
                </span>
              </div>
              <div>
                <span>رشته:</span>
                <span>{schedule.fos_name}</span>
              </div>
            </div>
            <div
              className="group"
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "15px",
              }}
            >
              <div>
                <span>زمان کلاس اول:</span>
                <span>
                  {schedule.time1_start} تا {schedule.time1_end} (
                  {schedule.weekKindClass1 === 1
                    ? "هر هفته"
                    : schedule.weekKindClass1 === 2
                    ? "زوج"
                    : "فرد"}
                  )
                </span>
              </div>
              <div>
                <span>عنوان کلاس اول:</span>
                <span>{schedule.class1_title}</span>
              </div>
              <div>
                <span>زمان کلاس دوم:</span>
                <span>
                  {schedule.time2_start
                    ? `${schedule.time2_start} تا ${schedule.time2_end} (
                ${
                  schedule.weekKindClass2 === 1
                    ? "هر هفته"
                    : schedule.weekKindClass2 === 2
                    ? "زوج"
                    : "فرد"
                }
                )`
                    : "ندارد"}
                </span>
              </div>
              <div>
                <span>عنوان کلاس دوم:</span>
                <span>
                  {schedule.class2_title ? schedule.class2_title : "ندارد"}
                </span>
              </div>
              <div>
                <span>رشته ی میزبان:</span>
                <span>
                  {schedule.host_fos_name ? schedule.host_fos_name : "ندارد"}
                </span>
              </div>
            </div>
            <div
              className="group"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <div>
                <span>روز کلاس اول:</span>
                <span>{weekDays[schedule.weekDay1 - 1]}</span>
              </div>
              <div>
                <span>روز کلاس دوم:</span>
                <span>
                  {schedule.weekDay2
                    ? weekDays[schedule.weekDay2 - 1]
                    : "ندارد"}
                </span>
              </div>
              <div>
                <span>آخرین تغییر توسط:</span>
                <span>
                  {schedule.submitter_firstName} {schedule.submitter_lastName}
                </span>
              </div>
            </div>
          </div>
        </div>
      );
      const MySwal = withReactContent(Swal);
      MySwal.fire({
        title: `:برنامه ی درس ${singleSchedule.course_name}`,
        html: scheduleHtml,
        icon: "info",
        width: "80%",
        showConfirmButton: false,
      });
    }
  }, [singleSchedule]);

  // 
  function makeWeekly(day: any, text: string) {
    if (day.length === 0) {
      let result = [<td>{text}</td>];
      let i = 0;
      while (i < 14) {
        result.push(<td key={i}></td>);
        i++;
      }
      result = [<tr>{result}</tr>];
      return result;
    } else {
      let rows = 1;
      let result: any = [];
      let nexRow: any = [];
      let i = 7;
      day.map((course: any, idx: any, arr: any) => {
        if (course.start < i) {
          nexRow.push(course);
        } else {
          while (i < course.start) {
            result.push(<td key={i}></td>);
            i++;
          }

          result.push(
            <td
              key={i}
              colSpan={course.end - course.start}
              className={course.weekKind !== 1 ? "not-stable" : ""}
              style={{ cursor: "pointer" }}
              onClick={() =>
                handleScheduleClick(course.course_name, course.schedule_id)
              }
            >
              {course.course_name +
                ` (${course.unit})` +
                (course.weekKind !== 1
                  ? ` (${course.weekKind === 2 ? "زوج" : "فرد"})`
                  : "")}
            </td>
          );

          i = course.end;
        }
        if (idx + 1 === arr.length) {
          while (i < 21) {
            result.push(<td key={i + 1}></td>);
            i++;
          }
        }
      });

      if (!nexRow.length) {
        return [
          <tr>
            {<td rowSpan={rows}>{text}</td>}
            {result}
          </tr>,
        ];
      } else {
        let results: any = [];
        let nextOne = nexRow;
        while (true) {
          rows++;
          const [res, next] = createRows(nextOne);
          results = [...results, ...res];
          if (next.length === 0) {
            results = [
              <tr>
                {<td rowSpan={rows}>{text}</td>}
                {result}
              </tr>,
              ...results,
            ];
            break;
          } else {
            nextOne = next;
          }
        }
        return results;
      }
    }
  }
  function createRows(day: any) {
    let result: any = [];
    let nexRow: any = [];
    let i = 7;
    day.map((course: any, idx: any, arr: any) => {
      if (course.start < i) {
        nexRow.push(course);
      } else {
        while (i < course.start) {
          result.push(<td key={i}></td>);
          i++;
        }

        result.push(
          <td
            key={i}
            colSpan={course.end - course.start}
            className={course.weekKind !== 1 ? "not-stable" : ""}
            style={{ cursor: "pointer" }}
            onClick={() =>
              handleScheduleClick(course.course_name, course.schedule_id)
            }
          >
            {course.course_name +
              ` (${course.unit})` +
              (course.weekKind !== 1
                ? ` (${course.weekKind === 2 ? "زوج" : "فرد"})`
                : "")}
          </td>
        );

        i = course.end;
      }
      if (idx + 1 === arr.length) {
        while (i < 21) {
          result.push(<td key={i + 1}></td>);
          i++;
        }
        result = [<tr>{result}</tr>];
      }
    });
    return [result, nexRow];
  }

  return (
    <>
      <div className="weekly-schedules">
        <button onClick={handleEmailClick}>ایمیل برنامه به استاد</button>
        <div className="filter-side">
          <label htmlFor="">رشته:</label>
          <select
            name="fos"
            onChange={handleFilterChange}
            value={filters.field_of_study_id}
          >
            {fosList.map((fos: any) => (
              <option key={fos.id} value={fos.id}>
                {fos.name}
              </option>
            ))}
          </select>
          <label htmlFor="">استاد:</label>
          <select
            name="professors"
            onChange={handleFilterChange}
            value={filters.professor_id}
          >
            <option value="all">همه</option>
            {professors.map((professor: any) => (
              <option key={professor.id} value={professor.id}>
                {professor.firstName} {professor.lastName} (
                {professor.field_of_study_name})
              </option>
            ))}
          </select>
          <label htmlFor="">ورودی:</label>
          <select
            name="termNumber"
            onChange={handleFilterChange}
            value={filters.termNumber}
          >
            <option value="all">همه</option>
            <option value="odd">فرد</option>
            <option value="even">زوج</option>
            <option value="1">ترم یک</option>
            <option value="2">ترم دو</option>
            <option value="3">ترم سه</option>
            <option value="4">ترم چهار</option>
            <option value="5">ترم پنج</option>
            <option value="6">ترم شش</option>
            <option value="7">ترم هفت</option>
            <option value="8">ترم هشت</option>
          </select>
          <label htmlFor="">کلاس:</label>
          <select
            name="classes"
            onChange={handleFilterChange}
            value={filters.class_id}
          >
            <option value="all">همه</option>
            {classes.map((kelas: any) => (
              <option key={kelas.id} value={kelas.id}>
                {kelas.title}
              </option>
            ))}
          </select>
          <button onClick={handleFilterClick}>
            فیلتر
            <FontAwesomeIcon icon={faFilter} />
          </button>
        </div>
        <h3>برنامه ی هفتگی:</h3>
        <table>
          <thead>
            <tr>
              <th></th>
              <th>7</th>
              <th>8</th>
              <th>9</th>
              <th>10</th>
              <th>11</th>
              <th>12</th>
              <th>13</th>
              <th>14</th>
              <th>15</th>
              <th>16</th>
              <th>17</th>
              <th>18</th>
              <th>19</th>
              <th>20</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(schedule).length
              ? makeWeekly(schedule.saturday, "شنبه")
              : makeWeekly([], "شنبه")}
            {Object.keys(schedule).length
              ? makeWeekly(schedule.sunday, "یکشنبه")
              : makeWeekly([], "یکشنبه")}
            {Object.keys(schedule).length
              ? makeWeekly(schedule.monday, "دوشنبه")
              : makeWeekly([], "دوشنبه")}
            {Object.keys(schedule).length
              ? makeWeekly(schedule.tuesday, "سه شنبه")
              : makeWeekly([], "سه شنبه")}
            {Object.keys(schedule).length
              ? makeWeekly(schedule.wednesday, "چهارشنبه")
              : makeWeekly([], "چهارشنبه")}
            {Object.keys(schedule).length
              ? makeWeekly(schedule.thursday, "پنجشنبه")
              : makeWeekly([], "پنجشنبه")}
          </tbody>
        </table>
      </div>
      {(selectsLoading || emailLoading || scheduleLoading || ssLoading) && (
        <LoadingModal />
      )}
    </>
  );
}

export default Weekly;
