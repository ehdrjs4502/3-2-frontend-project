import { useEffect, useState } from "react";
import Table from "./Table";

export default function Grade({ grade, rows, setRows, allNames }) {
    const [selectRow, setSelectRow] = useState(null); // 선택한 행
    const [totals, setTotals] = useState([]); // 합계 점수 배열
    const [total, setTotal] = useState(0); // 점수 총점
    const [totalScore, setTotalScore] = useState(""); // 합계 학점
    const [prevRowsLength, setPrevRowsLength] = useState(rows.length); // 이전 rows 배열의 길이 저장

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
            isSave: false, // 확인 버튼 눌렀는지
        };

        setRows([...rows, newRow]); // 상태 업데이트

        // 추가 되면 다시 계산해야하니 합계 초기화
        setTotal();
        setTotals([]);
        setTotalScore("");
    };

    // 값 입력 시 입력 된 값을 rows에 저장
    const handleInputChange = (index, field, value) => {
        const newRows = [...rows];
        newRows[index][field] = value;
        setRows(newRows);
    };

    // 확인 버튼 누를 시 입력창 -> span으로 변경
    const onClickOkBtn = (name) => {
        const findIndex = rows.findIndex((item) => item.name === name); // 확인 버튼 누른 열의 과목명이 rows에 몇 번 index인지 찾기
        const copiedItems = [...rows]; // rows를 새로운 배열에 저장 (useState 쓰면 set으로만 바꿀 수 있어서)
        const isNameDuplicated = new Set(allNames).size !== allNames.length; // 중복된 과목명 찾기

        // 조건에 맞게 잘 입력했는지 확인
        if (name === "") {
            return alert("과목명이 비어있습니다.");
        }
        if (isNameDuplicated) {
            return alert("중복된 과목명이 있습니다.");
        }
        if (!(copiedItems[findIndex].credit >= 1 && copiedItems[findIndex].credit <= 3)) {
            return alert("학점은 1~3까지만 입력 가능합니다.");
        }

        if (copiedItems[findIndex].credit > 1) {
            if (!(copiedItems[findIndex].attendanceScore >= 1 && copiedItems[findIndex].attendanceScore <= 20)) {
                return alert("출석점수는 1~20까지만 입력 가능합니다.");
            }

            if (!(copiedItems[findIndex].projectScore >= 1 && copiedItems[findIndex].projectScore <= 20)) {
                return alert("과제점수는 1~20까지만 입력 가능합니다.");
            }

            if (!(copiedItems[findIndex].midExamScore >= 1 && copiedItems[findIndex].midExamScore <= 30)) {
                return alert("중간고사 점수는 1~30까지만 입력 가능합니다.");
            }

            if (!(copiedItems[findIndex].finalExamScore >= 1 && copiedItems[findIndex].finalExamScore <= 30)) {
                return alert("기말고사 점수는 1~30까지만 입력 가능합니다.");
            }
        }

        copiedItems[findIndex].isSave = true; // 복사한 배열에서 확인 버튼 과목명에 isSave를 true로 바꿈
        setRows(copiedItems); // 바꾼 거 상태 업데이트
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

        rows.map((row) => (creditTotal += row.credit)); // 학점 합계 계산

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

        setRows(sortedRows);
        calcaultor();
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
                onClickOkBtn={onClickOkBtn}
                getScore={getScore}
            />
        </div>
    );
}
