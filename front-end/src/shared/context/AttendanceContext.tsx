import React, { createContext, useState, useEffect } from "react"
import { getRollCounts, getStudentsByRoll, sortByFname, sortByLname, sortByName } from "shared/helpers/context-helper"
import { useApi } from "shared/hooks/use-api"
import { ContextState, Person } from "shared/models/person"
import { RolllStateType } from "shared/models/roll"

const contextDefaultValues: ContextState = {
    studentsList: [],
    loadState: "",
    sortByFullName: () => { },
    sortByFirstName: () => { },
    sortByLastName: () => { },
    sortMode: false,
    searchByName: () => { },
    updateStudentRoll: () => { },
    filterByRoleType: () => { },
    totalStudents: 0,
    presentStudents: 0,
    lateStudents: 0,
    absentStudents: 0,
    saveStudentsRoll: () => { }
}

export const AttendanceContext = createContext<ContextState>(contextDefaultValues)

const AttendanceProvider: React.FC<React.ReactNode> = ({ children }) => {
    const [getStudents, data, loadState] = useApi<{ students: Person[] }>({ url: "get-homeboard-students" })
    const [saveStudentRolls] = useApi({ url: "save-roll" })
    const [studentsList, setStudentsList] = useState<Person[]>([])
    const [totalStudents, setTotalStudents] = useState<number>(0)
    const [presentStudents, setPresentStudents] = useState<number>(0)
    const [lateStudents, setLateStudents] = useState<number>(0)
    const [absentStudents, setAbsentStudents] = useState<number>(0)
    const [sortMode, setSortMode] = useState(false)

    useEffect(() => {
        void getStudents();
    }, [getStudents])

    useEffect(() => {
        if (data?.students) {
            setStudentsList(data?.students);
            setTotalStudents(data?.students.length);
        }
    }, [data?.students])

    const sortByFullName = (value: string) => {
        if (data?.students) {
            let sortedData = [];
            if (value === "desc") sortedData = sortByName(data.students);
            else sortedData = sortByName(data.students, false);
            setSortMode((prevState) => !prevState);
            setStudentsList(sortedData);
        }
    }

    const sortByFirstName = (value: string) => {
        setSortMode((prevState) => !prevState);
        if (data?.students) {
            let firstNameSortedData = [];
            if (value === "desc") firstNameSortedData = sortByFname(data.students);
            else firstNameSortedData = sortByFname(data.students, false);
            setStudentsList(firstNameSortedData);
        }
    }

    const sortByLastName = (value: string) => {
        setSortMode((prevState) => !prevState);
        if (data?.students) {
            let lastNameSortedData = [];
            if (value === "desc") lastNameSortedData = sortByLname(data.students);
            else lastNameSortedData = sortByLname(data.students, false);
            setStudentsList(lastNameSortedData);
        }
    }

    const searchByName = (keyword: string) => {
        if (data?.students && !keyword.trim().length) setStudentsList(data.students);
        else if (data?.students) {
            let filteredData = data.students.filter((ele) => ele.first_name.toLowerCase().indexOf(keyword) !== -1 || ele.last_name.toLowerCase().indexOf(keyword) !== -1);
            setStudentsList(filteredData);
        }
    }

    const updateStudentRoll = (newState: RolllStateType, id: number) => {
        let updatedStudentsStatus = studentsList.map((ele) => {
            if (ele.id === id) ele.roll_status = newState;
            return ele;
        });
        setStudentsList(updatedStudentsStatus);
        if (data?.students) {
            setPresentStudents(getRollCounts("present", data?.students));
            setAbsentStudents(getRollCounts("absent", data?.students));
            setLateStudents(getRollCounts("late", data?.students));
        }
    }

    const filterByRoleType = (type: ItemType) => {
        if (data?.students) {
            let filterByRollType: Person[] = [];
            if (type === "present") {
                filterByRollType = getStudentsByRoll("present", data.students);
                setPresentStudents(filterByRollType.length);
            }
            if (type === "absent") {
                filterByRollType = getStudentsByRoll("absent", data.students);
                setAbsentStudents(filterByRollType.length);
            }
            if (type === "late") {
                filterByRollType = getStudentsByRoll("late", data.students);
                setLateStudents(filterByRollType.length);
            }
            if (type === "all" && data.students) filterByRollType = data.students;
            setStudentsList(filterByRollType);
        }
    }

    const saveStudentsRoll = () => {
        if (data?.students) {
            let saveStudentsList = data.students.reduce((acc: any, curr) => {
                let saveDTO = {
                    student_id: curr.id,
                    roll_state: curr.roll_status ?? "unmark"
                }
                acc.push(saveDTO);
                return acc;
            }, []);
            let rollDTO = {
                student_roll_states: saveStudentsList
            }
            void saveStudentRolls(rollDTO);
        }
    }

    return (
        <AttendanceContext.Provider
            value={{
                studentsList,
                loadState: loadState,
                sortByFullName,
                sortByFirstName,
                sortByLastName,
                sortMode,
                searchByName,
                updateStudentRoll,
                filterByRoleType,
                totalStudents,
                presentStudents,
                lateStudents,
                absentStudents,
                saveStudentsRoll
            }}
        >
            {children}
        </AttendanceContext.Provider>
    )
}

export default AttendanceProvider

type ItemType = RolllStateType | "all"
