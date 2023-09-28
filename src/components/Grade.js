import { createRef, useEffect, useRef, useState } from "react";
import Table from "./Table";

export default function Grade({ grade, rows, setRows, allNames }) {
    const [selectRow, setSelectRow] = useState(null); // 선택한 행
    const [totals, setTotals] = useState([]); // 합계 점수 배열
    const [total, setTotal] = useState(0); // 점수 총점
    const [totalScore, setTotalScore] = useState(""); // 합계 학점
    const [prevRowsLength, setPrevRowsLength] = useState(rows.length); // 이전 rows 배열의 길이 저장
    const [isSave, setIsSave] = useState(false);

    const nameInputRef = useRef([]); // 과목명 인풋창
    const creditInputRef = useRef([]); // 학점 인풋창
    const attendanceScoreInputRef = useRef([]); // 출석 점수 인풋창
    const projectScoreInputRef = useRef([]); // 과제 점수 인풋창
    const midExamScoreInputRef = useRef([]); // 중간 점수 인풋창
    const finalExamScoreInputRef = useRef([]); // 기말 점수 인풋창

    // 추가 버튼 누를시 열 추가 하는 함수
    const onClickAddRowBtn = () => {
        const newRow = {
            grade: grade, // 학년
            subjectType: "교양", // 교양 or 전공
            requirementType: "필수", // 필수 or 선택
            name: "", // 과목명
            credit: 0, // 학점
            attendanceScore: 0, // 출석 점수
            projectScore: 0, // 과제 점수
            midExamScore: 0, // 중간 점수
            finalExamScore: 0, // 기말 점수
            passNonPass: "P", // 패스/논패스
        };

        setRows([...rows, newRow]); // 상태 업데이트

        // 추가 되면 다시 계산해야하니 합계 초기화
        setIsSave(false);
        setTotal();
        setTotals([]);
        setTotalScore("");
    };

    // 값 입력 시 입력 된 값을 rows에 저장
    const handleInputChange = (index, field, value) => {
        const newRows = [...rows];
        newRows[index][field] = value;
        setRows(newRows);

        // 값 입력 시 합계 초기화
        setIsSave(false);
        setTotal();
        setTotals([]);
        setTotalScore("");
    };

    // 삭제 버튼 누를 시 해당 열 삭제
    const onClickDeleteBtn = (selectRow) => {
        // 행 선택 안하고 삭제 버튼 누를 시
        if (selectRow === null) {
            return alert("삭제할 열을 선택해주세요");
        }
        const newRows = [...rows]; // useState 배열 복사
        newRows.splice(selectRow, 1); // 복사한 배열에서 선택한 행 삭제
        setRows(newRows); // useState에 상태 저장
        setSelectRow(null); // 클릭한 행 초기화
    };

    useEffect(() => {
        // rows 배열의 길이가 줄어들었을 때만 calcaultor 함수 호출
        if (rows.length < prevRowsLength) {
            calcaultor();
        }

        setPrevRowsLength(rows.length); // rows 배열의 길이 업데이트
    }, [rows]);

    // 합계 계산하는 함수
    const calcaultor = () => {
        let creditTotal = 0; // 학점 합계
        let attendanceTotal = 0; // 출석 점수 합계
        let projectTotal = 0; // 과제 점수 합계
        let midExamTotal = 0; // 중간고사 점수 합계
        let finalExamTotal = 0; // 기말고사 점수 합계

        rows.filter((row) => row.credit !== 1).map((row) => (creditTotal += row.credit)); // 학점 합계 계산 (1학점은 P인 경우만)

        // 1학점 아닌 과목 점수 합계 계산
        const arr = rows
            .filter((row) => row.credit !== 1)
            .map((row) => {
                attendanceTotal += row.attendanceScore;
                projectTotal += row.projectScore;
                midExamTotal += row.midExamScore;
                finalExamTotal += row.finalExamScore;
            });
        const totalArr = [creditTotal, attendanceTotal, projectTotal, midExamTotal, finalExamTotal]; // 학점, 출석, 과제, 중간, 기말 점수 각 합계 저장
        const total = attendanceTotal + projectTotal + midExamTotal + finalExamTotal; // 출석 + 과제 + 중간 + 기말 점수 합계
        setTotals(totalArr);
        setTotal(total);
        setTotalScore(getScore(total / arr.length)); // 토탈 학점 계산
    };

    // 저장 버튼 누를 시 합계 상태 저장 및 정렬
    const onClickSaveBtn = () => {
        const result = [...new Set(allNames.filter((item, index) => allNames.indexOf(item) !== index))];
        const myGradeDuplicate = rows
            .map((item, idx) => ({ ...item, idx: idx }))
            .filter((item) => result.includes(item.name)); // 내 학년에 중복되는 과목명 있는지 확인
        const nameBlank = rows.map((item, idx) => ({ ...item, idx: idx })).filter((item) => item.name === ""); // 과목명 비었는지 확인
        const invalidCredit = rows
            .map((item, idx) => ({ ...item, idx: idx }))
            .filter((item) => item.credit < 1 || item.credit > 3 || isNaN(item.credit)); // 학점 1~3까지 입력했는지 확인
        const invalidAttendanceScore = rows
            .map((item, idx) => ({ ...item, idx: idx }))
            .filter((item) => item.attendanceScore < 0 || item.attendanceScore > 20 || isNaN(item.attendanceScore)); // 출석 점수 확인
        const invalidProjectScore = rows
            .map((item, idx) => ({ ...item, idx: idx }))
            .filter((item) => item.projectScore < 0 || item.projectScore > 20 || isNaN(item.projectScore)); // 과제 점수 확인
        const invalidMidExamScore = rows
            .map((item, idx) => ({ ...item, idx: idx }))
            .filter((item) => item.midExamScore < 0 || item.midExamScore > 30 || isNaN(item.midExamScore)); // 중간 점수 확인
        const invalidFinalExamScore = rows
            .map((item, idx) => ({ ...item, idx: idx }))
            .filter((item) => item.finalExamScore < 0 || item.finalExamScore > 30 || isNaN(item.finalExamScore)); // 기말 점수 확인

        console.log(invalidCredit);

        if (nameBlank.length !== 0) {
            alert("과목명을 입력해주세요");
            nameInputRef.current[nameBlank[0].idx].focus();
            return;
        }

        if (myGradeDuplicate.length !== 0) {
            alert(`과목명 '${myGradeDuplicate[0].name}'이 중복되었습니다.`);
            nameInputRef.current[myGradeDuplicate[0].idx].focus();
            return;
        }

        if (invalidCredit.length !== 0) {
            alert("학점은 1 ~ 3점까지 입력 가능합니다.");
            creditInputRef.current[invalidCredit[0].idx].focus();
            return;
        }

        if (invalidAttendanceScore.length !== 0) {
            alert("출석 점수는 0 ~ 20점까지 입력 가능합니다.");
            attendanceScoreInputRef.current[invalidAttendanceScore[0].idx].focus();
            return;
        }

        if (invalidProjectScore.length !== 0) {
            alert("과제 점수는 0 ~ 20점까지 입력 가능합니다.");
            projectScoreInputRef.current[invalidProjectScore[0].idx].focus();
            return;
        }

        if (invalidMidExamScore.length !== 0) {
            alert("중간 점수는 0 ~ 30점까지 입력 가능합니다.");
            midExamScoreInputRef.current[invalidMidExamScore[0].idx].focus();
            return;
        }

        if (invalidFinalExamScore.length !== 0) {
            alert("기말 점수는 0 ~ 30점까지 입력 가능합니다.");
            finalExamScoreInputRef.current[invalidFinalExamScore[0].idx].focus();
            return;
        }

        //이수, 필수, 과목명 순으로 오름차순 정렬
        const sortedRows = rows.sort((a, b) => {
            if (a.subjectType < b.subjectType) return -1;
            if (a.subjectType > b.subjectType) return 1;

            if (a.requirementType < b.requirementType) return -1;
            if (a.requirementType > b.requirementType) return 1;

            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;

            return 0;
        });

        setIsSave(true);
        setRows(sortedRows);
        calcaultor();
        console.log(rows);
    };

    // 점수 구하는 함수
    const getScore = (total) => {
        if (total >= 95) {
            return "A+";
        } else if (total >= 90) {
            return "A";
        } else if (total >= 85) {
            return "B+";
        } else if (total >= 80) {
            return "B";
        } else if (total >= 75) {
            return "C+";
        } else if (total >= 70) {
            return "C";
        } else if (total >= 65) {
            return "D+";
        } else if (total >= 60) {
            return "D";
        } else {
            return "F";
        }
    };

    const btnStyle = {
        width: "50px",
        height: "28px",
        fontSize: "14px",
        backgroundColor: "gray",
        color: "white",
        border: "none",
        cursor: "pointer",
        marginLeft: "5px",
        marginBottom: "5px",
        marginTop: "10px",
    };

    return (
        <div style={{ width: "80%", marginBottom: "50px", marginLeft: "30px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "24px" }}>{grade}학년</span>
                <div>
                    <button style={btnStyle} onClick={onClickAddRowBtn}>
                        추가
                    </button>
                    <button style={btnStyle} onClick={() => onClickDeleteBtn(selectRow)}>
                        삭제
                    </button>
                    <button style={btnStyle} onClick={onClickSaveBtn}>
                        저장
                    </button>
                </div>
            </div>
            <Table
                rows={rows}
                grade={grade}
                selectRow={selectRow}
                setSelectRow={setSelectRow}
                totals={totals}
                total={total}
                totalScore={totalScore}
                handleInputChange={handleInputChange}
                getScore={getScore}
                isSave={isSave}
                inputRefs={{
                    nameInputRef,
                    creditInputRef,
                    attendanceScoreInputRef,
                    projectScoreInputRef,
                    midExamScoreInputRef,
                    finalExamScoreInputRef,
                }}
            />
        </div>
    );
}
