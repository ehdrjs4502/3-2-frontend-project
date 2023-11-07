export default function Table({
    rows,
    setSelectRow,
    selectRow,
    totals,
    total,
    totalScore,
    handleInputChange,
    getScore,
    isSave,
    inputRefs,
}) {
    return (
        <>
            <table border={1} style={{ borderCollapse: "collapse", width: "100%", textAlign: "center" }}>
                <thead>
                    <tr style={{ backgroundColor: "pink", fontWeight: "bold" }}>
                        <td>이수</td>
                        <td>필수</td>
                        <td>과목명</td>
                        <td>학점</td>
                        <td>출석점수</td>
                        <td>과제점수</td>
                        <td>중간고사</td>
                        <td>기말고사</td>
                        <td>총점</td>
                        <td>평균</td>
                        <td>성적</td>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, idx) => {
                        const total = row.attendanceScore + row.projectScore + row.midExamScore + row.finalExamScore;
                        const score = getScore(total);
                        const isSelected = selectRow === idx;
                        return (
                            <tr
                                key={idx}
                                onClick={() => {
                                    if (isSelected) {
                                        setSelectRow(null);
                                    } else {
                                        setSelectRow(idx);
                                    }
                                }}
                                style={{
                                    border: isSelected ? "1.5px solid red" : "1px solid black",
                                    backgroundColor: "#F8E0F1",
                                }}
                            >
                                <td>
                                    <select
                                        value={row.subjectType}
                                        onChange={(e) => handleInputChange(idx, "subjectType", e.target.value)}
                                    >
                                        <option value="교양">교양</option>
                                        <option value="전공">전공</option>
                                    </select>
                                </td>
                                <td>
                                    <select
                                        value={row.requirementType}
                                        onChange={(e) => handleInputChange(idx, "requirementType", e.target.value)}
                                    >
                                        <option value="필수">필수</option>
                                        <option value="선택">선택</option>
                                    </select>
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={row.name}
                                        onChange={(e) => handleInputChange(idx, "name", e.target.value)}
                                        ref={(val) => (inputRefs.nameInputRef.current[idx] = val)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        value={row.credit}
                                        onChange={(e) => handleInputChange(idx, "credit", parseInt(e.target.value))}
                                        min="1"
                                        max="3"
                                        className="input-num"
                                        ref={(val) => (inputRefs.creditInputRef.current[idx] = val)}
                                    />
                                </td>

                                {/* 출석, 과제, 중간, 기말 점수 */}
                                {row.credit !== 1 ? (
                                    <>
                                        <td>
                                            <input
                                                type="number"
                                                value={row.attendanceScore}
                                                onChange={(e) =>
                                                    handleInputChange(idx, "attendanceScore", parseInt(e.target.value))
                                                }
                                                min="0"
                                                max="20"
                                                className="input-num"
                                                ref={(val) => (inputRefs.attendanceScoreInputRef.current[idx] = val)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                value={row.projectScore}
                                                onChange={(e) =>
                                                    handleInputChange(idx, "projectScore", parseInt(e.target.value))
                                                }
                                                min="0"
                                                max="20"
                                                className="input-num"
                                                ref={(val) => (inputRefs.projectScoreInputRef.current[idx] = val)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                value={row.midExamScore}
                                                onChange={(e) =>
                                                    handleInputChange(idx, "midExamScore", parseInt(e.target.value))
                                                }
                                                min="0"
                                                max="30"
                                                className="input-num"
                                                ref={(val) => (inputRefs.midExamScoreInputRef.current[idx] = val)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                value={row.finalExamScore}
                                                onChange={(e) =>
                                                    handleInputChange(idx, "finalExamScore", parseInt(e.target.value))
                                                }
                                                min="0"
                                                max="30"
                                                className="input-num"
                                                ref={(val) => (inputRefs.finalExamScoreInputRef.current[idx] = val)}
                                            />
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </>
                                )}

                                {/* 총점, 평균, 성적 */}
                                <>
                                    {row.credit === 1 ? (
                                        <>
                                            <td></td>
                                            <td></td>
                                            <td>
                                                <select
                                                    value={row.passNonPass}
                                                    defaultValue="P"
                                                    onChange={(e) =>
                                                        handleInputChange(idx, "passNonPass", e.target.value)
                                                    }
                                                >
                                                    <option value="P">P</option>
                                                    <option value="N">N</option>
                                                </select>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            {isSave ? (
                                                <>
                                                    <td>{total}</td>
                                                    <td></td>
                                                    <td style={{ color: score === "F" ? "red" : "black" }}>{score}</td>
                                                </>
                                            ) : (
                                                <>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                </>
                                            )}
                                        </>
                                    )}
                                </>
                            </tr>
                        );
                    })}
                </tbody>
                {/* 합계 영역 */}
                <tfoot>
                    <tr style={{ backgroundColor: "#F5BCA9" }}>
                        <td colSpan={3}>합계</td>
                        {rows.length !== 0 && (
                            <>
                                <td>{totals[0]}</td>
                                <td>{totals[1]}</td>
                                <td>{totals[2]}</td>
                                <td>{totals[3]}</td>
                                <td>{totals[4]}</td>
                                <td>{total}</td>
                                <td>{total && Math.round(total / rows.filter((row) => row.credit !== 1).length)}</td>
                                <td style={{ color: totalScore === "F" ? "red" : "black" }}>{totalScore}</td>
                            </>
                        )}
                    </tr>
                </tfoot>
            </table>

            <style>
                {`
                    input{
                        border: none;
                        border-bottom: 1px solid gray; 
                        background: transparent;
                    }
                    input::-webkit-inner-spin-button {
                        appearance: none;
                        -moz-appearance: none;
                        -webkit-appearance: none;
                    }

                    .input-num {
                        text-align: center;
                    }
   
                    `}
            </style>
        </>
    );
}
