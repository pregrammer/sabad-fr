import { Link } from "react-router-dom";

function ReportRow({ semester }: any) {
  return (
    <tr>
      <td>{semester.educationYear}</td>
      <td>
        {semester.yearPart === 1
          ? "اول"
          : semester.yearPart === 2
          ? "دوم"
          : "تابستان"}
      </td>
      <td>
        {JSON.parse(semester.semesterDate).day +
          " / " +
          JSON.parse(semester.semesterDate).month +
          " / " +
          JSON.parse(semester.semesterDate).year}
      </td>
      <td>
        {JSON.parse(semester.unitDate).day +
          " / " +
          JSON.parse(semester.unitDate).month +
          " / " +
          JSON.parse(semester.unitDate).year}
      </td>
      <td>
        {JSON.parse(semester.editUnitDate).day +
          " / " +
          JSON.parse(semester.editUnitDate).month +
          " / " +
          JSON.parse(semester.editUnitDate).year}
      </td>
      <td>
        <Link to={`/panel/weekly-schedules/${semester.id}`}>هفتگی </Link>
        <Link to={`/panel/test-schedules/${semester.id}`}>امتحانی</Link>
      </td>
    </tr>
  );
}

export default ReportRow;
