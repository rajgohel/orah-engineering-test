import { Person } from "shared/models/person";

export const sortByName = (students: Person[], desc = true) => {
    if (desc) return students.sort((a, b) => (b.first_name + b.last_name).localeCompare(a.first_name + a.last_name));
    return students.sort((a, b) => (a.first_name + a.last_name).localeCompare(b.first_name + b.last_name));
}

export const sortByFname = (students: Person[], desc = true) => {
    if (desc) return students.sort((a, b) => b.first_name.localeCompare(a.first_name));
    return students.sort((a, b) => a.first_name.localeCompare(b.first_name));
}

export const sortByLname = (students: Person[], desc = true) => {
    if (desc) return students.sort((a, b) => b.last_name.localeCompare(a.last_name));
    return students.sort((a, b) => a.last_name.localeCompare(b.last_name));
}

export const getRollCounts = (rollType: string, students: Person[]) => {
    return students.reduce((acc, curr) => {
        if (curr.roll_status === rollType) acc++;
        return acc;
    }, 0)
}

export const getStudentsByRoll = (rollType: string, students: Person[]) => {
    return students.filter(ele => ele.roll_status === rollType);
}