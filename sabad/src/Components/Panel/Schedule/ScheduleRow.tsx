import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit, faExchange } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useMemo } from "react";
import Swal from "sweetalert2";
import useAxiosFunction from "../../../Helpers/useAxiosFunction";
import { toast } from "react-toastify";
import LoadingModal from "../../Modals/LoadingModal";
import ScheduleSubmit from "../../Modals/ScheduleSubmit";

function ScheduleRow({ schedule, setUpdate, testDates }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [data, loading, axiosFetch]: any = useAxiosFunction();
  const [testDate, setTestDate]: any = useState([]);
  const weekDays = useMemo(
    () => ["شنبه", "یکشنبه", "دوشنبه", "سه شنبه ", "چهارشنبه", "پنجشنبه"],
    []
  );

  function deleteClick(e: any) {
    e.stopPropagation();
    Swal.fire({
      title: "آیا از حذف این برنامه ی درسی مطمئن هستید؟",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "بله",
      cancelButtonText: "خیر",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosFetch({
          method: "DELETE",
          url: `/schedules`,
          requestConfig: {
            data: { id: schedule.id },
          },
        });
      }
    });
  }
  function editClick(e: any) {
    e.stopPropagation();
    setEditOpen((prev: boolean) => !prev);
  }
  function handleChangeState(e: any) {
    e.stopPropagation();
    Swal.fire({
      title: "آیا از تغییر وضعیت این برنامه ی درسی مطمئن هستید؟",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "بله",
      cancelButtonText: "خیر",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosFetch({
          method: "PUT",
          url: `/schedules/change-state`,
          requestConfig: {
            data: { id: schedule.id },
          },
        });
      }
    });
  }

  useEffect(() => {
    function sett() {
      switch (schedule.testDay) {
        case 1:
          setTestDate(["اول", JSON.parse(testDates.first)]);
          break;
        case 2:
          setTestDate(["دوم", JSON.parse(testDates.second)]);
          break;
        case 3:
          setTestDate(["سوم", JSON.parse(testDates.third)]);
          break;
        case 4:
          setTestDate(["چهارم", JSON.parse(testDates.fourth)]);
          break;
        case 5:
          setTestDate(["پنجم", JSON.parse(testDates.fifth)]);
          break;
        case 6:
          setTestDate(["ششم", JSON.parse(testDates.sixth)]);
          break;
        case 7:
          setTestDate(["هفتم", JSON.parse(testDates.seventh)]);
          break;
        case 8:
          setTestDate(["هشتم", JSON.parse(testDates.eighth)]);
          break;
        case 9:
          setTestDate(["نهم", JSON.parse(testDates.ninth)]);
          break;
        case 10:
          setTestDate(["دهم", JSON.parse(testDates.tenth)]);
          break;
        case 11:
          setTestDate(["یازدهم", JSON.parse(testDates.eleventh)]);
          break;
        case 12:
          setTestDate(["دوازدهم", JSON.parse(testDates.twelfth)]);
          break;
        case 13:
          setTestDate(["سیزدهم", JSON.parse(testDates.thirteenth)]);
          break;
        case 14:
          setTestDate(["چهاردهم", JSON.parse(testDates.fourteenth)]);
          break;
        case 15:
          setTestDate(["ندارد"]);
          break;
        default:
          break;
      }
    }
    sett();
  }, []);

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
      setUpdate((prev: boolean) => !prev);
    }
  }, [data]);

  return (
    <>
      <div
        className="schedule"
        onClick={() => setIsOpen((prev) => !prev)}
        style={
          schedule.isCertain
            ? {
                border: "1px solid green",
                backgroundColor: "rgb(231, 249, 231)",
              }
            : {}
        }
      >
        <div className="top">
          <div className="group">
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
        {isOpen && (
          <div className="down">
            <div className="group">
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
                {testDate[0] === "ندارد" ? (
                  <span>بدون امتحان</span>
                ) : (
                  <span>
                    روز {testDate[0]} ({testDate[1]?.year}/{testDate[1]?.month}/
                    {testDate[1]?.day})
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
            <div className="group">
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
            <div className="group">
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
              <div>
                <span>تغییرات:</span>
                <span>
                  <FontAwesomeIcon icon={faTrash} onClick={deleteClick} />
                  <FontAwesomeIcon icon={faEdit} onClick={editClick} />
                  <FontAwesomeIcon
                    icon={faExchange}
                    onClick={handleChangeState}
                  />
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
      {editOpen && (
        <ScheduleSubmit
          setEditOpen={setEditOpen}
          editData={schedule}
          updateRows={setUpdate}
        />
      )}
      {loading && <LoadingModal />}
    </>
  );
}

export default ScheduleRow;
