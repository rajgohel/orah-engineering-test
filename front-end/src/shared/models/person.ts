import { RolllStateType } from "./roll"

export interface Person {
  id: number
  first_name: string
  last_name: string
  photo_url?: string
  roll_status?: RolllStateType
}

export const PersonHelper = {
  getFullName: (p: Person) => `${p.first_name} ${p.last_name}`,
}

export type ContextState = {
  studentsList: Person[]
  loadState: string
  sortByFullName: () => void
  sortByFirstName: () => void
  sortByLastName: () => void
  sortMode: boolean
  searchByName: (keyword: string) => void
  updateStudentRoll: (newState: RolllStateType, id: number) => void
  filterByRoleType: (type: ItemType) => void
  totalStudents: number
  presentStudents: number
  lateStudents: number
  absentStudents: number,
  saveStudentsRoll: () => void
};

type ItemType = RolllStateType | "all"