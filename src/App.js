import React, { useState } from "react";
import Grade from "./components/Grade";

function App() {
    const [grade1Rows, setGrade1Rows] = useState([]); // 1학년 수강 과목 배열
    const [grade2Rows, setGrade2Rows] = useState([]); // 2학년 수강 과목 배열
    const [grade3Rows, setGrade3Rows] = useState([]); // 3학년 수강 과목 배열
    const allRows = [...grade1Rows, ...grade2Rows, ...grade3Rows]; // 1~3학년 전체 배열
    const allNames = allRows.filter((row) => row.isSave == true).map((row) => row.name); // 전체 배열에서 isSave가 true인 이름만 저장

    return (
        <div>
            <Grade grade="1" rows={grade1Rows} setRows={setGrade1Rows} allNames={allNames} />
            <Grade grade="2" rows={grade2Rows} setRows={setGrade2Rows} allNames={allNames} />
            <Grade grade="3" rows={grade3Rows} setRows={setGrade3Rows} allNames={allNames} />
        </div>
    );
}

export default App;
