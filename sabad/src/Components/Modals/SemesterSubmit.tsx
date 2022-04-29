import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import LoadingModal from "./LoadingModal";
import useAxiosFunction from "../../Helpers/useAxiosFunction";
import { useEffect } from "react";
import "@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css";
import DatePicker from "@hassanmojab/react-modern-calendar-datepicker";

function SemesterSubmit({ setIsOpen, editData, updateRows }: any) {
  const [data, loading, axiosFetch]: any = useAxiosFunction();

  const formik: any = useFormik({
    initialValues: {
      educationYear: editData ? editData.educationYear : "",
      yearPart: editData ? editData.yearPart : "1",
      semesterDate: editData ? editData.semesterDate : null,
      unitDate: editData ? editData.unitDate : null,
      editUnitDate: editData ? editData.editUnitDate : null,
      first: editData ? editData.first : null,
      second: editData ? editData.second : null,
      third: editData ? editData.third : null,
      fourth: editData ? editData.fourth : null,
      fifth: editData ? editData.fifth : null,
      sixth: editData ? editData.sixth : null,
      seventh: editData ? editData.seventh : null,
      eighth: editData ? editData.eighth : null,
      ninth: editData ? editData.ninth : null,
      tenth: editData ? editData.tenth : null,
      eleventh: editData ? editData.eleventh : null,
      twelfth: editData ? editData.twelfth : null,
      thirteenth: editData ? editData.thirteenth : null,
      fourteenth: editData ? editData.fourteenth : null,
      title: editData ? "a" : "",
      body: editData ? "a" : "",
    },
    validationSchema: Yup.object({
      semesterDate: Yup.string()
        .required("وارد کردن تاریخ شروع الزامی است")
        .nullable(),
      unitDate: Yup.string()
        .required("وارد کردن تاریخ انتخاب واحد الزامی است")
        .nullable(),
      editUnitDate: Yup.string()
        .required("وارد کردن تاریخ حذف و اضافه الزامی است")
        .nullable(),
      first: Yup.string().required("وارد کردن روز اول الزامی است").nullable(),
      second: Yup.string().required("وارد کردن روز دوم الزامی است").nullable(),
      third: Yup.string().required("وارد کردن روز سوم الزامی است").nullable(),
      fourth: Yup.string()
        .required("وارد کردن روز چهارم الزامی است")
        .nullable(),
      fifth: Yup.string().required("وارد کردن روز پنجم الزامی است").nullable(),
      sixth: Yup.string().required("وارد کردن روز ششم الزامی است").nullable(),
      seventh: Yup.string()
        .required("وارد کردن روز هفتم الزامی است")
        .nullable(),
      eighth: Yup.string().required("وارد کردن روز هشتم الزامی است").nullable(),
      ninth: Yup.string().required("وارد کردن روز نهم الزامی است").nullable(),
      tenth: Yup.string().required("وارد کردن روز دهم الزامی است").nullable(),
      eleventh: Yup.string()
        .required("وارد کردن روز یازدهم الزامی است")
        .nullable(),
      twelfth: Yup.string()
        .required("وارد کردن روز دوازدهم الزامی است")
        .nullable(),
      thirteenth: Yup.string()
        .required("وارد کردن روز سیزدهم الزامی است")
        .nullable(),
      fourteenth: Yup.string()
        .required("وارد کردن روز چهاردهم الزامی است")
        .nullable(),
      title: Yup.string()
        .required("وارد کردن عنوان پیام الزامی است")
        .max(280, "حداکثر تعداد کاراکتر 280 می باشد"),
      body: Yup.string()
        .required("وارد کردن متن پیام الزامی است")
        .max(2800, "حداکثر تعداد کاراکتر 2800 می باشد"),
    }),
    onSubmit: (values) => {
      if (!editData) {
        axiosFetch({
          method: "POST",
          url: "/semesters",
          requestConfig: {
            headers: {
              "Content-Type": "application/json",
            },
            data: values,
          },
        });
      } else {
        const dataPut = {
          id: editData.id,
          test_date_id: editData.test_date_id,
          educationYear: values.educationYear,
          yearPart: values.yearPart,
          semesterDate: values.semesterDate,
          unitDate: values.unitDate,
          editUnitDate: values.editUnitDate,
          first: values.first,
          second: values.second,
          third: values.third,
          fourth: values.fourth,
          fifth: values.fifth,
          sixth: values.sixth,
          seventh: values.seventh,
          eighth: values.eighth,
          ninth: values.ninth,
          tenth: values.tenth,
          eleventh: values.eleventh,
          twelfth: values.twelfth,
          thirteenth: values.thirteenth,
          fourteenth: values.fourteenth,
        };
        axiosFetch({
          method: "PUT",
          url: "/semesters",
          requestConfig: {
            headers: {
              "Content-Type": "application/json",
            },
            data: dataPut,
          },
        });
      }
    },
  });

  // fix calender z-index
  function dateClick(e: any) {
    const children =
      e.target.parentElement.parentElement.parentElement.childNodes;
    const current = e.target.parentElement.parentElement.className;
    //e.target.name = current;
    for (let i = 0; i < children.length; i++) {
      if (current !== children[i].className) {
        children[i].style.zIndex = "1";
      } else {
        children[i].style.zIndex = "";
      }
    }
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
      updateRows((prev: any) => !prev);
      setIsOpen((prev: any) => !prev);
    }
  }, [data]);

  return (
    <>
      <div
        className="bgc-modal center-elements"
        onClick={() => setIsOpen((prev: any) => !prev)}
      ></div>
      <div className="semester-submit-content">
        <span className="close" onClick={() => setIsOpen((prev: any) => !prev)}>
          &times;
        </span>
        <form onSubmit={formik.handleSubmit}>
          <h4>{editData ? "ویرایش" : "افزودن"} نیمسال</h4>

          <div className="group firstLine">
            <div>
              <label htmlFor="">سال تحصیلی:</label>
              <input
                type="number"
                required
                name="educationYear"
                value={formik.values.educationYear}
                onChange={formik.handleChange}
              />
            </div>
            <div>
              <label htmlFor="">نیمسال:</label>
              <select
                name="yearPart"
                value={formik.values.yearPart}
                onChange={formik.handleChange}
              >
                <option value="1">اول</option>
                <option value="2">دوم</option>
                <option value="3">تابستان</option>
              </select>
            </div>
          </div>
          <div className="group topLbls">
            <label htmlFor="">تاریخ شروع:</label>
            <label htmlFor="">تاریخ انتخاب واحد:</label>
            <label htmlFor="">تاریخ حذف و اضافه:</label>
          </div>
          <h5>تاریخ امتحان ها</h5>
          <div className="lbls">
            <label htmlFor="">روز اول:</label>
            <label htmlFor="">روز دوم:</label>
            <label htmlFor="">روز سوم:</label>
          </div>
          <div className="lbls">
            <label htmlFor="">روز چهارم:</label>
            <label htmlFor="">روز پنجم:</label>
            <label htmlFor="">روز ششم:</label>
          </div>
          <div className="lbls">
            <label htmlFor="">روز هفتم:</label>
            <label htmlFor="">روز هشتم:</label>
            <label htmlFor="">روز نهم:</label>
          </div>
          <div className="lbls">
            <label htmlFor="">روز دهم:</label>
            <label htmlFor="">روز یازدهم:</label>
            <label htmlFor="">روز دوازدهم:</label>
          </div>
          <div className="lbls">
            <label htmlFor="">روز سیزدهم:</label>
            <label htmlFor="">روز چهاردهم:</label>
          </div>
          {!editData && (
            <div className="down">
              <input
                type="text"
                placeholder="عنوان پیام شروع نیمسال"
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
              />
              <textarea
                placeholder="متن پیام"
                name="body"
                value={formik.values.body}
                onChange={formik.handleChange}
              />
            </div>
          )}
          {Object.keys(formik.errors).length ? (
            <span className="semError">
              {formik.errors[Object.keys(formik.errors)[0]]}
            </span>
          ) : (
            ""
          )}
          <button type="submit">{editData ? "ویرایش" : "افزودن"}</button>
        </form>
        <div className="semDatePickers">
          <div
            className="semesterDate"
            onClick={dateClick}
            style={editData ? { top: "27.7%" } : {}}
          >
            <DatePicker
              value={
                formik.values.semesterDate &&
                JSON.parse(formik.values.semesterDate)
              }
              onChange={(value: any) =>
                formik.setFieldValue("semesterDate", JSON.stringify(value))
              }
              shouldHighlightWeekends
              locale="fa"
              inputPlaceholder="شروع..."
              calendarClassName="vazir-font"
            />
          </div>
          <div
            className="unitDate"
            onClick={dateClick}
            style={editData ? { top: "27.7%" } : {}}
          >
            <DatePicker
              value={
                formik.values.unitDate && JSON.parse(formik.values.unitDate)
              }
              onChange={(value: any) =>
                formik.setFieldValue("unitDate", JSON.stringify(value))
              }
              shouldHighlightWeekends
              locale="fa"
              inputPlaceholder="انتخاب واحد..."
              calendarClassName="vazir-font"
            />
          </div>
          <div
            className="editUnitDate"
            onClick={dateClick}
            style={editData ? { top: "27.7%" } : {}}
          >
            <DatePicker
              value={
                formik.values.editUnitDate &&
                JSON.parse(formik.values.editUnitDate)
              }
              onChange={(value: any) =>
                formik.setFieldValue("editUnitDate", JSON.stringify(value))
              }
              shouldHighlightWeekends
              locale="fa"
              inputPlaceholder="حذف و اضافه..."
              calendarClassName="vazir-font"
            />
          </div>
          <div
            className="first"
            onClick={dateClick}
            style={editData ? { top: "47.5%" } : {}}
          >
            <DatePicker
              value={formik.values.first && JSON.parse(formik.values.first)}
              onChange={(value: any) =>
                formik.setFieldValue("first", JSON.stringify(value))
              }
              shouldHighlightWeekends
              locale="fa"
              inputPlaceholder="روز اول..."
              calendarClassName="vazir-font"
            />
          </div>
          <div
            className="second"
            onClick={dateClick}
            style={editData ? { top: "47.5%" } : {}}
          >
            <DatePicker
              value={formik.values.second && JSON.parse(formik.values.second)}
              onChange={(value: any) =>
                formik.setFieldValue("second", JSON.stringify(value))
              }
              shouldHighlightWeekends
              locale="fa"
              inputPlaceholder="روز دوم..."
              calendarClassName="vazir-font"
            />
          </div>
          <div
            className="third"
            onClick={dateClick}
            style={editData ? { top: "47.5%" } : {}}
          >
            <DatePicker
              value={formik.values.third && JSON.parse(formik.values.third)}
              onChange={(value: any) =>
                formik.setFieldValue("third", JSON.stringify(value))
              }
              shouldHighlightWeekends
              locale="fa"
              inputPlaceholder="روز سوم..."
              calendarClassName="vazir-font"
            />
          </div>
          <div
            className="fourth"
            onClick={dateClick}
            style={editData ? { bottom: "40.5%" } : {}}
          >
            <DatePicker
              value={formik.values.fourth && JSON.parse(formik.values.fourth)}
              onChange={(value: any) =>
                formik.setFieldValue("fourth", JSON.stringify(value))
              }
              shouldHighlightWeekends
              locale="fa"
              inputPlaceholder="روز چهارم..."
              calendarClassName="vazir-font"
            />
          </div>
          <div
            className="fifth"
            onClick={dateClick}
            style={editData ? { bottom: "40.5%" } : {}}
          >
            <DatePicker
              value={formik.values.fifth && JSON.parse(formik.values.fifth)}
              onChange={(value: any) =>
                formik.setFieldValue("fifth", JSON.stringify(value))
              }
              shouldHighlightWeekends
              locale="fa"
              inputPlaceholder="روز پنجم..."
              calendarClassName="vazir-font"
            />
          </div>
          <div
            className="sixth"
            onClick={dateClick}
            style={editData ? { bottom: "40.5%" } : {}}
          >
            <DatePicker
              value={formik.values.sixth && JSON.parse(formik.values.sixth)}
              onChange={(value: any) =>
                formik.setFieldValue("sixth", JSON.stringify(value))
              }
              shouldHighlightWeekends
              locale="fa"
              inputPlaceholder="روز ششم..."
              calendarClassName="vazir-font"
            />
          </div>
          <div
            className="seventh"
            onClick={dateClick}
            style={editData ? { bottom: "32%" } : {}}
          >
            <DatePicker
              value={formik.values.seventh && JSON.parse(formik.values.seventh)}
              onChange={(value: any) =>
                formik.setFieldValue("seventh", JSON.stringify(value))
              }
              shouldHighlightWeekends
              locale="fa"
              inputPlaceholder="روز هفتم..."
              calendarClassName="vazir-font"
            />
          </div>
          <div
            className="eighth"
            onClick={dateClick}
            style={editData ? { bottom: "32%" } : {}}
          >
            <DatePicker
              value={formik.values.eighth && JSON.parse(formik.values.eighth)}
              onChange={(value: any) =>
                formik.setFieldValue("eighth", JSON.stringify(value))
              }
              shouldHighlightWeekends
              locale="fa"
              inputPlaceholder="روز هشتم..."
              calendarClassName="vazir-font"
            />
          </div>
          <div
            className="ninth"
            onClick={dateClick}
            style={editData ? { bottom: "32%" } : {}}
          >
            <DatePicker
              value={formik.values.ninth && JSON.parse(formik.values.ninth)}
              onChange={(value: any) =>
                formik.setFieldValue("ninth", JSON.stringify(value))
              }
              shouldHighlightWeekends
              locale="fa"
              inputPlaceholder="روز نهم..."
              calendarClassName="vazir-font"
            />
          </div>
          <div
            className="tenth"
            onClick={dateClick}
            style={editData ? { bottom: "23.8%" } : {}}
          >
            <DatePicker
              value={formik.values.tenth && JSON.parse(formik.values.tenth)}
              onChange={(value: any) =>
                formik.setFieldValue("tenth", JSON.stringify(value))
              }
              shouldHighlightWeekends
              locale="fa"
              inputPlaceholder="روز دهم..."
              calendarClassName="vazir-font"
            />
          </div>
          <div
            className="eleventh"
            onClick={dateClick}
            style={editData ? { bottom: "23.8%" } : {}}
          >
            <DatePicker
              value={
                formik.values.eleventh && JSON.parse(formik.values.eleventh)
              }
              onChange={(value: any) =>
                formik.setFieldValue("eleventh", JSON.stringify(value))
              }
              shouldHighlightWeekends
              locale="fa"
              inputPlaceholder="روز یازدهم..."
              calendarClassName="vazir-font"
            />
          </div>
          <div
            className="twelfth"
            onClick={dateClick}
            style={editData ? { bottom: "23.8%" } : {}}
          >
            <DatePicker
              value={formik.values.twelfth && JSON.parse(formik.values.twelfth)}
              onChange={(value: any) =>
                formik.setFieldValue("twelfth", JSON.stringify(value))
              }
              shouldHighlightWeekends
              locale="fa"
              inputPlaceholder="روز دوازدهم..."
              calendarClassName="vazir-font"
            />
          </div>
          <div
            className="thirteenth"
            onClick={dateClick}
            style={editData ? { bottom: "15.3%" } : {}}
          >
            <DatePicker
              value={
                formik.values.thirteenth && JSON.parse(formik.values.thirteenth)
              }
              onChange={(value: any) =>
                formik.setFieldValue("thirteenth", JSON.stringify(value))
              }
              shouldHighlightWeekends
              locale="fa"
              inputPlaceholder="روز سیزدهم..."
              calendarClassName="vazir-font"
            />
          </div>
          <div
            className="fourteenth"
            onClick={dateClick}
            style={editData ? { bottom: "15.3%" } : {}}
          >
            <DatePicker
              value={
                formik.values.fourteenth && JSON.parse(formik.values.fourteenth)
              }
              onChange={(value: any) =>
                formik.setFieldValue("fourteenth", JSON.stringify(value))
              }
              shouldHighlightWeekends
              locale="fa"
              inputPlaceholder="روز چهاردهم..."
              calendarClassName="vazir-font"
            />
          </div>
        </div>
      </div>
      {loading && <LoadingModal />}
    </>
  );
}

export default SemesterSubmit;
