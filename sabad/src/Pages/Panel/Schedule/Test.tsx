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
      title: `آیا مایلید برنامه ی امتحانی را برای ${prof} ایمیل کنید؟`,
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
          <button onClick={handleFilterClick}>
            فیلتر
            <FontAwesomeIcon icon={faFilter} />
          </button>
        </div>
        <h3>برنامه ی امتحانی:</h3>
        <table>
          <thead>
            <tr>
              <th></th>
              <th>نوبت اول</th>
              <th>نوبت دوم</th>
              <th>نوبت سوم</th>
            </tr>
          </thead>
          <tbody>
            {generateTestTds(schedule.first ? schedule.first : [], "روز اول")}
            {generateTestTds(schedule.second ? schedule.second : [], "روز دوم")}
            {generateTestTds(schedule.third ? schedule.third : [], "روز سوم")}
            {generateTestTds(
              schedule.fourth ? schedule.fourth : [],
              "روز جهارم"
            )}
            {generateTestTds(schedule.fifth ? schedule.fifth : [], "روز پنجم")}
            {generateTestTds(schedule.sixth ? schedule.sixth : [], "روز ششم")}
            {generateTestTds(
              schedule.seventh ? schedule.seventh : [],
              "روز هفتم"
            )}
            {generateTestTds(
              schedule.eighth ? schedule.eighth : [],
              "روز هشتم"
            )}
            {generateTestTds(schedule.ninth ? schedule.ninth : [], "روز نهم")}
            {generateTestTds(schedule.tenth ? schedule.tenth : [], "روز دهم")}
            {generateTestTds(
              schedule.eleventh ? schedule.eleventh : [],
              "روز یازدهم"
            )}
            {generateTestTds(
              schedule.twelfth ? schedule.twelfth : [],
              "روز دوازدهم"
            )}
            {generateTestTds(
              schedule.thirteenth ? schedule.thirteenth : [],
              "روز سیزدهم"
            )}
            {generateTestTds(
              schedule.fourteenth ? schedule.fourteenth : [],
              "روز چهاردهم"
            )}
            {generateTestTds(
              schedule.out_of_range ? schedule.out_of_range : [],
              "خارج از بازه"
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
