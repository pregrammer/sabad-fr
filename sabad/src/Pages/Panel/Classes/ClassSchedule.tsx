import { useEffect } from "react";
import { useParams } from "react-router-dom";
import LoadingModal from "../../../Components/Modals/LoadingModal";
import useAxiosFunction from "../../../Helpers/useAxiosFunction";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

function ClassSchedule() {
  const { classId } = useParams();
  const [data, loading, axiosFetch]: any = useAxiosFunction();
  const [schedule, scheduleLoading, axiosFetch2]: any = useAxiosFunction();

  useEffect(() => {
    axiosFetch({
      method: "GET",
      url: `/schedules/class-schedules?class_id=${classId}`,
    });
    // eslint-disable-next-line
  }, []);

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
        axiosFetch2({
          method: "GET",
          url: `/schedules/schedule?id=${scheduleId}`,
        });
      }
    });
  }

  useEffect(() => {
    if (Object.keys(schedule).length !== 0) {
      const weekDays = [
        "شنبه",
        "یکشنبه",
        "دوشنبه",
        "سه شنبه ",
        "چهارشنبه",
        "پنجشنبه",
      ];
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
                <b>نام درس:</b>
                <span>{schedule.course_name}</span>
              </div>
              <div>
                <b>کد درس:</b>
                <span>{schedule.course_code}</span>
              </div>
              <div>
                <b>نام استاد:</b>
                <span>
                  {schedule.professor_firstName} {schedule.professor_lastName}
                </span>
              </div>
              <div>
                <b>گروه درسی:</b>
                <span>{schedule.courseGroup}</span>
              </div>
              <div>
                <b>نیمسال:</b>
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
                <b>حداقل ظرفیت کلاس:</b>
                <span>{schedule.minCapacity} نفر</span>
              </div>
              <div>
                <b>حداکثر ظرفیت کلاس:</b>
                <span>{schedule.maxCapacity} نفر</span>
              </div>
              <div>
                <b>روز امتحان:</b>
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
                <b>نوبت امتحان:</b>
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
                <b>رشته:</b>
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
                <b>زمان کلاس اول:</b>
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
                <b>عنوان کلاس اول:</b>
                <span>{schedule.class1_title}</span>
              </div>
              <div>
                <b>زمان کلاس دوم:</b>
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
                <b>عنوان کلاس دوم:</b>
                <span>
                  {schedule.class2_title ? schedule.class2_title : "ندارد"}
                </span>
              </div>
              <div>
                <b>رشته ی میزبان:</b>
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
                <b>روز کلاس اول:</b>
                <span>{weekDays[schedule.weekDay1 - 1]}</span>
              </div>
              <div>
                <b>روز کلاس دوم:</b>
                <span>
                  {schedule.weekDay2
                    ? weekDays[schedule.weekDay2 - 1]
                    : "ندارد"}
                </span>
              </div>
              <div>
                <b>آخرین تغییر توسط:</b>
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
        title: `:برنامه ی درس ${schedule.course_name}`,
        html: scheduleHtml,
        icon: "info",
        width: "80%",
        showConfirmButton: false,
      });
    }
  }, [schedule]);

  function generateWeeklyTds(day: any) {
    // at first, if our input(day) is empty (we have no schedules at that day) we just create empty td to fix the row(keep appearance);
    // else, map through schedules and until reach the course.start, create empty tds; then create td with data.
    // if we are in last element in map, then create empty td to fix the row(keep appearance).

    if (day.length === 0) {
      let result = [];
      let i = 0;
      while (i < 14) {
        result.push(<td key={i}></td>);
        i++;
      }
      return result;
    } else {
      let result: any = [];
      let i = 7;
      day.map((course: any, idx: any, arr: any) => {
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
        if (idx + 1 === arr.length) {
          while (i < 21) {
            result.push(<td key={i + 1}></td>);
            i++;
          }
        }
      });
      return result;
    }
  }

  return (
    <>
      <div className="class-schedule">
        <h3>برنامه ی کلاس {data.class_title}:</h3>
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
            <tr>
              <td>شنبه</td>
              {!loading && Object.keys(data).length
                ? generateWeeklyTds(data.class_schedule.saturday)
                : generateWeeklyTds([])}
            </tr>
            <tr>
              <td>یکشنبه</td>
              {!loading && Object.keys(data).length
                ? generateWeeklyTds(data.class_schedule.sunday)
                : generateWeeklyTds([])}
            </tr>
            <tr>
              <td>دوشنبه</td>
              {!loading && Object.keys(data).length
                ? generateWeeklyTds(data.class_schedule.monday)
                : generateWeeklyTds([])}
            </tr>
            <tr>
              <td>سه شنبه</td>
              {!loading && Object.keys(data).length
                ? generateWeeklyTds(data.class_schedule.tuesday)
                : generateWeeklyTds([])}
            </tr>
            <tr>
              <td>چهارشنبه</td>
              {!loading && Object.keys(data).length
                ? generateWeeklyTds(data.class_schedule.wednesday)
                : generateWeeklyTds([])}
            </tr>
            <tr>
              <td>پنجشنبه</td>
              {!loading && Object.keys(data).length
                ? generateWeeklyTds(data.class_schedule.thursday)
                : generateWeeklyTds([])}
            </tr>
          </tbody>
        </table>
      </div>
      {(loading || scheduleLoading) && <LoadingModal />}
    </>
  );
}

export default ClassSchedule;
