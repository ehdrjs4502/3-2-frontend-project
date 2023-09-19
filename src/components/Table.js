export default function Table({
    rows,
    setSelectRow,
    selectRow,
    totals,
    total,
    totalScore,
    handleInputChange,
    onClickOkBtn,
    getScore,
}) {
    return (
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
                    let score = getScore(total);
                    const isSelected = selectRow === idx;
                    if (row.credit !== 1) {
                        row.result = score;
                    }
                    return (
                        <>
                            {row.isSave ? (
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
                                        border: isSelected ? "2px solid red" : "1px solid black",
                                        backgroundColor: "#F8E0F1",
                                    }}
                                >
                                    <td>
                                        <span>{row.subjectType}</span>
                                    </td>
                                    <td>
                                        <span>{row.requirementType}</span>
                                    </td>
                                    <td style={{ textAlign: "left" }}>
                                        <span>{row.name}</span>
                                    </td>
                                    <td>
                                        <span>{row.credit}</span>
                                    </td>
                                    <td>
                                        <span>{row.credit !== 1 && row.attendanceScore}</span>
                                    </td>
                                    <td>
                                        <span>{row.credit !== 1 && row.projectScore}</span>
                                    </td>
                                    <td>
                                        <span>{row.credit !== 1 && row.midExamScore}</span>
                                    </td>
                                    <td>
                                        <span>{row.credit !== 1 && row.finalExamScore}</span>
                                    </td>
                                    <td>
                                        <span>{row.credit !== 1 && total}</span>
                                    </td>
                                    <td></td>
                                    <td style={{ color: score === "F" && row.credit !== 1 && "red" }}>
                                        <span>{row.result}</span>
                                    </td>
                                </tr>
                            ) : (
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
                                        border: isSelected ? "2px solid red" : "1px solid black",
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
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={row.credit}
                                            onChange={(e) => handleInputChange(idx, "credit", parseInt(e.target.value))}
                                            min="1"
                                            max="10"
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
                                                        handleInputChange(
                                                            idx,
                                                            "attendanceScore",
                                                            parseInt(e.target.value)
                                                        )
                                                    }
                                                    min="0"
                                                    max="20"
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
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    value={row.finalExamScore}
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            idx,
                                                            "finalExamScore",
                                                            parseInt(e.target.value)
                                                        )
                                                    }
                                                    min="0"
                                                    max="30"
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
                                    <td></td>
                                    <td></td>
                                    {row.credit === 1 ? (
                                        <td>
                                            <select
                                                value={row.result}
                                                defaultValue="P"
                                                onChange={(e) => handleInputChange(idx, "result", e.target.value)}
                                            >
                                                <option value="P">P</option>
                                                <option value="N">N</option>
                                            </select>
                                        </td>
                                    ) : (
                                        <td></td>
                                    )}
                                    <button onClick={() => onClickOkBtn(row.name)}>확인</button>
                                </tr>
                            )}
                        </>
                    );
                })}
            </tbody>
            <tfoot>
                <tr style={{ backgroundColor: "#F5BCA9" }}>
                    <td colSpan={3}>합계</td>
                    {rows.filter((row) => row.isSave).length !== 0 && (
                        <>
                            <td>{totals[0]}</td>
                            <td>{totals[1]}</td>
                            <td>{totals[2]}</td>
                            <td>{totals[3]}</td>
                            <td>{totals[4]}</td>
                            <td>{total}</td>
                            <td>
                                {total &&
                                    Math.round(total / rows.filter((row) => row.credit !== 1 && row.isSave).length)}
                            </td>
                            <td style={{ color: totalScore === "F" && "red" }}>{totalScore}</td>
                        </>
                    )}
                </tr>
            </tfoot>
        </table>
    );
}
