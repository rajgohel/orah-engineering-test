import React, { useState, useEffect } from "react"
import styled from "styled-components"
import Button from "@material-ui/core/ButtonBase"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Spacing, BorderRadius, FontWeight } from "shared/styles/styles"
import { Colors } from "shared/styles/colors"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { Person } from "shared/models/person"
import { useApi } from "shared/hooks/use-api"
import { StudentListTile } from "staff-app/components/student-list-tile/student-list-tile.component"
import { ActiveRollOverlay, ActiveRollAction } from "staff-app/components/active-roll-overlay/active-roll-overlay.component"
import { Input, Switch } from "@material-ui/core"

export const HomeBoardPage: React.FC = () => {
  const [isRollMode, setIsRollMode] = useState(false)
  const [sortMode, setSortMode] = useState(false)
  const [getStudents, data, loadState] = useApi<{ students: Person[] }>({ url: "get-homeboard-students" })
  const [studentsData, setStudentsData] = useState(data?.students || []);

  useEffect(() => {
    void getStudents();
  }, [getStudents])

  useEffect(() => {
    if (data?.students) {
      setStudentsData(data?.students);
    }
  }, [data?.students])

  const onToolbarAction = (action: ToolbarAction, value?: string) => {
    if (action === "roll") {
      setIsRollMode(true)
    }
    if (action === "sort" && data?.students) {
      setSortMode((prevState) => !prevState);
      // Sort by first name
      if (value !== "lastName") {
        let firstNameSortedData = [];
        // Desc order
        if (sortMode) firstNameSortedData = data.students.sort((a, b) => b.first_name.localeCompare(a.first_name));
        // Asc order
        else firstNameSortedData = data.students.sort((a, b) => a.first_name.localeCompare(b.first_name));
        setStudentsData(firstNameSortedData);
      }
      // Sort by last name
      else {
        let lastNameSortedData = [];
        if (sortMode) lastNameSortedData = data.students.sort((a, b) => b.last_name.localeCompare(a.last_name));
        else lastNameSortedData = data.students.sort((a, b) => a.last_name.localeCompare(b.last_name));
        setStudentsData(lastNameSortedData);
      }
    }
  }

  const handleInputChange = (e: any) => {
    let keyword: string = e.target.value.toLowerCase();
    if (data?.students && !keyword.trim().length) setStudentsData(data.students);
    else if (data?.students) {
      let filteredData = data.students.filter((ele) => ele.first_name.toLowerCase().indexOf(keyword) !== -1 || ele.last_name.toLowerCase().indexOf(keyword) !== -1);
      setStudentsData(filteredData);
    }
  };

  const handleToggleChange = () => {
    if (data?.students) {
      let sortedData = [];
      if (sortMode) sortedData = data.students.sort((a, b) => (b.first_name + b.last_name).localeCompare(a.first_name + a.last_name));
      else sortedData = data.students.sort((a, b) => (a.first_name + a.last_name).localeCompare(b.first_name + b.last_name));
      setSortMode((prevState) => !prevState);
      setStudentsData(sortedData);
    }
  }

  const onActiveRollAction = (action: ActiveRollAction) => {
    if (action === "exit") {
      setIsRollMode(false)
    }
  }

  return (
    <>
      <S.PageContainer>
        <Toolbar onItemClick={onToolbarAction}
          onInputChange={handleInputChange}
          onToggleChange={handleToggleChange}
          sortOrder={sortMode}
        />

        {loadState === "loading" && (
          <CenteredContainer>
            <FontAwesomeIcon icon="spinner" size="2x" spin />
          </CenteredContainer>
        )}

        {loadState === "loaded" && studentsData && (
          <>
            {studentsData.map((s) => (
              <StudentListTile key={s.id} isRollMode={isRollMode} student={s} />
            ))}
          </>
        )}

        {loadState === "error" && (
          <CenteredContainer>
            <div>Failed to load</div>
          </CenteredContainer>
        )}
      </S.PageContainer>
      <ActiveRollOverlay isActive={isRollMode} onItemClick={onActiveRollAction} />
    </>
  )
}

type ToolbarAction = "roll" | "sort"
interface ToolbarProps {
  onItemClick: (action: ToolbarAction, value?: string) => void,
  onInputChange: (e: any) => void,
  onToggleChange: (e: any) => void,
  sortOrder: boolean
}
const Toolbar: React.FC<ToolbarProps> = (props) => {
  const { onItemClick, onInputChange, onToggleChange, sortOrder } = props
  return (
    <S.ToolbarContainer>
      <Switch name="sortVal" checked={sortOrder} size="small" onChange={onToggleChange} />
      <S.Button onClick={() => onItemClick("sort")}>First Name</S.Button>
      <S.Button onClick={() => onItemClick("sort", "lastName")}>Last Name</S.Button>
      <Input placeholder="Search..." style={{ color: "#fff" }} onChange={onInputChange} />
      <S.Button onClick={() => onItemClick("roll")}>Start Roll</S.Button>
    </S.ToolbarContainer>
  )
}

const S = {
  PageContainer: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 140px;
  `,
  ToolbarContainer: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    background-color: ${Colors.blue.base};
    padding: 6px 14px;
    font-weight: ${FontWeight.strong};
    border-radius: ${BorderRadius.default};
  `,
  Button: styled(Button)`
    && {
      padding: ${Spacing.u2};
      font-weight: ${FontWeight.strong};
      border-radius: ${BorderRadius.default};
    }
  `,
}
