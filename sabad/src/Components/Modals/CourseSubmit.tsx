import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import LoadingModal from "./LoadingModal";
import useAxiosFunction from "../../Helpers/useAxiosFunction";
import { useEffect } from "react";

function CourseSubmit({ setEditOpen, editData, updateRows }: any) {
  const [courseList, courseLoading, axiosFetch2]: any = useAxiosFunction();
  const [data, loading, axiosFetch]: any = useAxiosFunction();

  useEffect(() => {
    axiosFetch2({
      method: "GET",
      url: "/courses?forSelect=true",
    });
  }, []);

  const formik: any = useFormik({
    initialValues: {
      name: editData ? editData.name : "",
      unit: editData ? editData.unit : "",
      kind: editData ? editData.kind : "تخصصی",
      code: editData ? editData.code : "",
      grade: editData ? editData.grade : "1",
      prerequisite_id: editData ? editData.prerequisite_id : "0",
      need_id: editData ? editData.need_id : "0",
      termNumber: editData ? editData.termNumber : "1",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required("وارد کردن نام درس الزامی است")
        .max(50, "حداکثر تعداد کاراکتر 50 می باشد"),
    }),
    onSubmit: (values) => {
      if (!editData) {
        axiosFetch({
          method: "POST",
          url: "/courses",
          requestConfig: {
            headers: {
              "Content-Type": "application/json",
            },
            data: values,
          },
        });
      } else {
        axiosFetch({
          method: "PUT",
          url: "/courses",
          requestConfig: {
            headers: {
              "Content-Type": "application/json",
            },
            data: {
              id: editData.id,
              ...values
            },
          },
        });
      }
    },
  });

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
      setEditOpen((prev: any) => !prev);
    }
  }, [data]);

  return (
    <>
      <div
        className="bgc-modal"
        onClick={() => setEditOpen((prev: any) => !prev)}
      ></div>
      <div className="course-submit-content">
        <span
          className="close"
          onClick={() => setEditOpen((prev: any) => !prev)}
        >
          &times;
        </span>
        <form onSubmit={formik.handleSubmit}>
          <h4>{editData ? "ویرایش" : "افزودن"} استاد</h4>
          <div className="group">
            <div>
              <label>نام درس:</label>
              <input
                type="text"
                required
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.touched.name && formik.errors.name && (
              <span className="error">{formik.errors.name}</span>
            )}
            <div>
              <label>تعداد واحد:</label>
              <input
                type="number"
                required
                name="unit"
                value={formik.values.unit}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
          </div>
          <div className="group">
            <div>
              <label>نوع درس:</label>
              <select
                name="kind"
                onChange={formik.handleChange}
                value={formik.values.kind}
              >
                <option value="معارف">معارف</option>
                <option value="عمومی">عمومی</option>
                <option value="پایه">پایه</option>
                <option value="اصلی">اصلی</option>
                <option value="تخصصی">تخصصی</option>
                <option value="اختیاری">اختیاری</option>
                <option value="کارگاهی - آزمایشگاهی">
                  کارگاهی - آزمایشگاهی
                </option>
              </select>
            </div>

            <div>
              <label>کد درس:</label>
              <input
                type="number"
                required
                name="code"
                value={formik.values.code}
                onChange={formik.handleChange}
              />
            </div>
          </div>
          <div className="group">
            <div>
              <label>پیش نیاز:</label>
              <select
                name="prerequisite_id"
                value={formik.values.prerequisite_id}
                onChange={formik.handleChange}
              >
                <option value="0">ندارد</option>
                {!courseLoading &&
                  courseList &&
                  courseList.map((course: any) => (
                    <option value={course.id} key={course.id}>
                      {course.name}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label>هم نیاز:</label>
              <select
                name="need_id"
                value={formik.values.need_id}
                onChange={formik.handleChange}
              >
                <option value="0">ندارد</option>
                {!courseLoading &&
                  courseList &&
                  courseList.map((course: any) => (
                    <option value={course.id} key={course.id}>
                      {course.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <div className="group">
            <div>
              <label>مقطع:</label>
              <select
                name="grade"
                value={formik.values.grade}
                onChange={formik.handleChange}
              >
                <option value="1">کارشناسی</option>
                <option value="2">کارشناسی ارشد</option>
                <option value="3">دکتری</option>
              </select>
            </div>
            <div>
              <label>ورودی:</label>
              <select
                name="termNumber"
                value={formik.values.termNumber}
                onChange={formik.handleChange}
              >
                <option value="1">ترم یک</option>
                <option value="2">ترم دو</option>
                <option value="3">ترم سه</option>
                <option value="4">ترم چهار</option>
                <option value="5">ترم پنج</option>
                <option value="6">ترم شش</option>
                <option value="7">ترم هفت</option>
                <option value="8">ترم هشت</option>
              </select>
            </div>
          </div>
          <button type="submit">{editData ? "ویرایش" : "افزودن"}</button>
        </form>
      </div>
      {(loading || courseLoading) && <LoadingModal />}
    </>
  );
}

export default CourseSubmit;
