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
        title: "???????? ?????????? ?????????? ???????? ?????? ???? ???? ???????? ?????????? ???????????? ????????????",
        icon: "info",
        showCancelButton: true,
        showConfirmButton: false,
        cancelButtonColor: "#888",
        cancelButtonText: "????????",
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
      title: `?????? ???????????? ???????????? ?? ?????????? ???? ???????? ${prof} ?????????? ??????????`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#888",
      confirmButtonText: "??????",
      cancelButtonText: "??????",
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
      title: `?????? ???????????? ???????????? ?? ?????? ${courseName} ???? ???????????? ??????????`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#888",
      confirmButtonText: "??????",
      cancelButtonText: "??????",
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
        "????????",
        "????????????",
        "????????????",
        "???? ???????? ",
        "????????????????",
        "??????????????",
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
                <b>?????? ??????:</b>
                <span>{schedule.course_name}</span>
              </div>
              <div>
                <b>???? ??????:</b>
                <span>{schedule.course_code}</span>
              </div>
              <div>
                <b>?????? ??????????:</b>
                <span>
                  {schedule.professor_firstName} {schedule.professor_lastName}
                </span>
              </div>
              <div>
                <b>???????? ????????:</b>
                <span>{schedule.courseGroup}</span>
              </div>
              <div>
                <b>????????????:</b>
                <span>
                  {schedule.yearPart === 1
                    ? "??????"
                    : schedule.yearPart === 2
                    ? "??????"
                    : "??????????????"}
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
                <b>?????????? ?????????? ????????:</b>
                <span>{schedule.minCapacity} ??????</span>
              </div>
              <div>
                <b>???????????? ?????????? ????????:</b>
                <span>{schedule.maxCapacity} ??????</span>
              </div>
              <div>
                <b>?????? ????????????:</b>
                {schedule.testDayName === "??????????" ? (
                  <span>???????? ????????????</span>
                ) : (
                  <span>
                    ?????? {schedule.testDayName} ({schedule.test_dates.year}/
                    {schedule.test_dates.month}/{schedule.test_dates.day})
                  </span>
                )}
              </div>
              <div>
                <b>???????? ????????????:</b>
                <span>
                  {schedule.testDayPart === 1
                    ? "??????"
                    : schedule.testDayPart === 2
                    ? "??????"
                    : schedule.testDayPart === 3
                    ? "??????"
                    : "???????? ????????????"}
                </span>
              </div>
              <div>
                <b>????????:</b>
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
                <b>???????? ???????? ??????:</b>
                <span>
                  {schedule.time1_start} ???? {schedule.time1_end} (
                  {schedule.weekKindClass1 === 1
                    ? "???? ????????"
                    : schedule.weekKindClass1 === 2
                    ? "??????"
                    : "??????"}
                  )
                </span>
              </div>
              <div>
                <b>?????????? ???????? ??????:</b>
                <span>{schedule.class1_title}</span>
              </div>
              <div>
                <b>???????? ???????? ??????:</b>
                <span>
                  {schedule.time2_start
                    ? `${schedule.time2_start} ???? ${schedule.time2_end} (
                ${
                  schedule.weekKindClass2 === 1
                    ? "???? ????????"
                    : schedule.weekKindClass2 === 2
                    ? "??????"
                    : "??????"
                }
                )`
                    : "??????????"}
                </span>
              </div>
              <div>
                <b>?????????? ???????? ??????:</b>
                <span>
                  {schedule.class2_title ? schedule.class2_title : "??????????"}
                </span>
              </div>
              <div>
                <b>???????? ?? ????????????:</b>
                <span>
                  {schedule.host_fos_name ? schedule.host_fos_name : "??????????"}
                </span>
              </div>
            </div>
            <div
              className="group"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <div>
                <b>?????? ???????? ??????:</b>
                <span>{weekDays[schedule.weekDay1 - 1]}</span>
              </div>
              <div>
                <b>?????? ???????? ??????:</b>
                <span>
                  {schedule.weekDay2
                    ? weekDays[schedule.weekDay2 - 1]
                    : "??????????"}
                </span>
              </div>
              <div>
                <b>?????????? ?????????? ????????:</b>
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
        title: `:???????????? ?? ?????? ${singleSchedule.course_name}`,
        html: scheduleHtml,
        icon: "info",
        width: "80%",
        showConfirmButton: false,
      });
    }
  }, [singleSchedule]);

  function makeWeekly(day: any, text: string) {
    // if no schedules in our day, we create and return empty tds with dayName td, in a tr.
    // else, start from i = 7 (first time) and map through the schedules.
    // in the begining, our else clause runs; because our start time at min chance is 7 (or more) and 7 < 7 is incorrect.
    // in else, until we reach schedule's start, we create empty tds and then create schedule td; and put end time in i.
    // in last if, if we have no more schedules, we just create empty tds to keep appearance.
    // in next itration in map, because our schedules sorted by start times, if we have any schedules that less than i,
    // it means a part or whole of the schedule should place on last schedule; we just put this schedule in another array,
    // and go to next itration. after map, if we have no schedules in nexRow arrays, we create our tr with created tds and return back.
    // else, until we have no schedules in our next array, we create trs and finally return back these trs.

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
                  ? ` (${course.weekKind === 2 ? "??????" : "??????"})`
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
                ? ` (${course.weekKind === 2 ? "??????" : "??????"})`
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
        {(auth.role === 2 || auth.role === 3) && (
          <button onClick={handleEmailClick}>?????????? ???????????? ???? ??????????</button>
        )}
        <div className="filter-side">
          <label htmlFor="">????????:</label>
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
          <label htmlFor="">??????????:</label>
          <select
            name="professors"
            onChange={handleFilterChange}
            value={filters.professor_id}
          >
            <option value="all">??????</option>
            {professors.map((professor: any) => (
              <option key={professor.id} value={professor.id}>
                {professor.firstName} {professor.lastName} (
                {professor.field_of_study_name})
              </option>
            ))}
          </select>
          <label htmlFor="">??????????:</label>
          <select
            name="termNumber"
            onChange={handleFilterChange}
            value={filters.termNumber}
          >
            <option value="all">??????</option>
            <option value="odd">??????</option>
            <option value="even">??????</option>
            <option value="1">?????? ????</option>
            <option value="2">?????? ????</option>
            <option value="3">?????? ????</option>
            <option value="4">?????? ????????</option>
            <option value="5">?????? ??????</option>
            <option value="6">?????? ????</option>
            <option value="7">?????? ??????</option>
            <option value="8">?????? ??????</option>
          </select>
          <label htmlFor="">????????:</label>
          <select
            name="classes"
            onChange={handleFilterChange}
            value={filters.class_id}
          >
            <option value="all">??????</option>
            {classes.map((kelas: any) => (
              <option key={kelas.id} value={kelas.id}>
                {kelas.title}
              </option>
            ))}
          </select>
          <button onClick={handleFilterClick}>
            ??????????
            <FontAwesomeIcon icon={faFilter} />
          </button>
        </div>
        <h3>???????????? ?? ??????????:</h3>
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
              ? makeWeekly(schedule.saturday, "????????")
              : makeWeekly([], "????????")}
            {Object.keys(schedule).length
              ? makeWeekly(schedule.sunday, "????????????")
              : makeWeekly([], "????????????")}
            {Object.keys(schedule).length
              ? makeWeekly(schedule.monday, "????????????")
              : makeWeekly([], "????????????")}
            {Object.keys(schedule).length
              ? makeWeekly(schedule.tuesday, "???? ????????")
              : makeWeekly([], "???? ????????")}
            {Object.keys(schedule).length
              ? makeWeekly(schedule.wednesday, "????????????????")
              : makeWeekly([], "????????????????")}
            {Object.keys(schedule).length
              ? makeWeekly(schedule.thursday, "??????????????")
              : makeWeekly([], "??????????????")}
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
