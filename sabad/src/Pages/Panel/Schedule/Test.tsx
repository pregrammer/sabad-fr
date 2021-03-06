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

function Test() {
  const { semId } = useParams();
  const [schedule, scheduleLoading, axiosFetch]: any = useAxiosFunction();
  const [data, emailLoading, axiosFetch2]: any = useAxiosFunction();
  const [singleSchedule, ssLoading, axiosFetch3]: any = useAxiosFunction();
  const [update, setUpdate] = useState(false);
  const [selectsLoading, setSelectsLoading] = useState(false);
  const [professors, setProfessors]: any = useState([]);
  const [fosList, setFosList]: any = useState([]);
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    field_of_study_id: auth.field_of_study_id,
    professor_id: "all",
    termNumber: "odd",
  });

  useEffect(() => {
    getSelectsData();
  }, []);

  function getSelectsData() {
    let endpoints = [
      "field_of_studies?forSelect=true",
      "professors?forSelect=true",
    ];

    setSelectsLoading(true);
    Promise.all(endpoints.map((endpoint) => axios.get(endpoint)))
      .then(([{ data: fosList }, { data: professors }]) => {
        setFosList(fosList);
        // if user refresh the page, auth removed. we instead use first fos.
        if (!filters.field_of_study_id) {
          setFilters((prev: any) => ({
            ...prev,
            field_of_study_id: fosList[0].id,
          }));
        }
        setProfessors(professors);
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
      url: `/schedules/test?field_of_study_id=${filters.field_of_study_id}&professor_id=${filters.professor_id}&termNumber=${filters.termNumber}&semester_id=${semId}`,
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
      title: `?????? ???????????? ???????????? ?? ?????????????? ???? ???????? ${prof} ?????????? ??????????`,
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
          url: `/schedules/test-email`,
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

  function generateTestTds(testDayArr: any, text: string) {
    // if we have no test at that day, we just return empty tds to keep appearance;
    // if we have more than one test in a day, first we create rows after first test; then we create first test.
    // at last, we append first test to result; if we have more tests, we append them too.

    if (testDayArr.length === 0) {
      return (
        <tr>
          <td>{text}</td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      );
    }

    let tr = [];
    if (testDayArr.length > 1) {
      // create rows after first test
      for (let i = 1; i < testDayArr.length; i++) {
        switch (testDayArr[i].testDayPart) {
          case 1:
            tr.push(
              <tr key={i}>
                <td
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    handleScheduleClick(
                      testDayArr[i].course_name,
                      testDayArr[i].schedule_id
                    )
                  }
                >
                  {testDayArr[i].course_name}
                </td>
                <td></td>
                <td></td>
              </tr>
            );
            break;
          case 2:
            tr.push(
              <tr key={i}>
                <td></td>
                <td
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    handleScheduleClick(
                      testDayArr[i].course_name,
                      testDayArr[i].schedule_id
                    )
                  }
                >
                  {testDayArr[i].course_name}
                </td>
                <td></td>
              </tr>
            );
            break;
          case 3:
            tr.push(
              <tr key={i}>
                <td></td>
                <td></td>
                <td
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    handleScheduleClick(
                      testDayArr[i].course_name,
                      testDayArr[i].schedule_id
                    )
                  }
                >
                  {testDayArr[i].course_name}
                </td>
              </tr>
            );
            break;
          default:
            break;
        }
      }
    }

    let result: any = [];

    // create first test row
    // if we have more test (created above) we bring it after first row.
    switch (testDayArr[0].testDayPart) {
      case 1:
        result = [
          <tr key={0}>
            <td rowSpan={testDayArr.length}>{text}</td>
            <td
              style={{ cursor: "pointer" }}
              onClick={() =>
                handleScheduleClick(
                  testDayArr[0].course_name,
                  testDayArr[0].schedule_id
                )
              }
            >
              {testDayArr[0].course_name}
            </td>
            <td></td>
            <td></td>
          </tr>,
          ...tr,
        ];
        break;
      case 2:
        result = [
          <tr key={0}>
            <td rowSpan={testDayArr.length}>{text}</td>
            <td></td>
            <td
              style={{ cursor: "pointer" }}
              onClick={() =>
                handleScheduleClick(
                  testDayArr[0].course_name,
                  testDayArr[0].schedule_id
                )
              }
            >
              {testDayArr[0].course_name}
            </td>
            <td></td>
          </tr>,
          ...tr,
        ];
        break;
      case 3:
        result = [
          <tr key={0}>
            <td rowSpan={testDayArr.length}>{text}</td>
            <td></td>
            <td></td>
            <td
              style={{ cursor: "pointer" }}
              onClick={() =>
                handleScheduleClick(
                  testDayArr[0].course_name,
                  testDayArr[0].schedule_id
                )
              }
            >
              {testDayArr[0].course_name}
            </td>
          </tr>,
          ...tr,
        ];
        break;
      default:
        break;
    }

    return result;
  }

  return (
    <>
      <div className="test-schedules">
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
          <button onClick={handleFilterClick}>
            ??????????
            <FontAwesomeIcon icon={faFilter} />
          </button>
        </div>
        <h3>???????????? ?? ??????????????:</h3>
        <table>
          <thead>
            <tr>
              <th></th>
              <th>???????? ??????</th>
              <th>???????? ??????</th>
              <th>???????? ??????</th>
            </tr>
          </thead>
          <tbody>
            {generateTestTds(schedule.first ? schedule.first : [], "?????? ??????")}
            {generateTestTds(schedule.second ? schedule.second : [], "?????? ??????")}
            {generateTestTds(schedule.third ? schedule.third : [], "?????? ??????")}
            {generateTestTds(
              schedule.fourth ? schedule.fourth : [],
              "?????? ??????????"
            )}
            {generateTestTds(schedule.fifth ? schedule.fifth : [], "?????? ????????")}
            {generateTestTds(schedule.sixth ? schedule.sixth : [], "?????? ??????")}
            {generateTestTds(
              schedule.seventh ? schedule.seventh : [],
              "?????? ????????"
            )}
            {generateTestTds(
              schedule.eighth ? schedule.eighth : [],
              "?????? ????????"
            )}
            {generateTestTds(schedule.ninth ? schedule.ninth : [], "?????? ??????")}
            {generateTestTds(schedule.tenth ? schedule.tenth : [], "?????? ??????")}
            {generateTestTds(
              schedule.eleventh ? schedule.eleventh : [],
              "?????? ????????????"
            )}
            {generateTestTds(
              schedule.twelfth ? schedule.twelfth : [],
              "?????? ??????????????"
            )}
            {generateTestTds(
              schedule.thirteenth ? schedule.thirteenth : [],
              "?????? ????????????"
            )}
            {generateTestTds(
              schedule.fourteenth ? schedule.fourteenth : [],
              "?????? ??????????????"
            )}
            {generateTestTds(
              schedule.out_of_range ? schedule.out_of_range : [],
              "???????? ???? ????????"
            )}
          </tbody>
        </table>
      </div>
      {(selectsLoading || emailLoading || scheduleLoading || ssLoading) && (
        <LoadingModal />
      )}
    </>
  );
}

export default Test;
