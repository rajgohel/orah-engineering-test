import React, { useState, useEffect, useContext } from "react"
import styled from "styled-components"
import Button from "@material-ui/core/ButtonBase"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Spacing, BorderRadius, FontWeight, FontSize } from "shared/styles/styles"
import { Colors } from "shared/styles/colors"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { StudentListTile } from "staff-app/components/student-list-tile/student-list-tile.component"
import { ActiveRollOverlay, ActiveRollAction } from "staff-app/components/active-roll-overlay/active-roll-overlay.component"
import { Input, MenuItem, Select } from "@material-ui/core"
import { AttendanceContext } from "shared/context/AttendanceContext"
import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons"

export const HomeBoardPage: React.FC = () => {
  const [isRollMode, setIsRollMode] = useState(false)
  const [sortingMode, setSortingMode] = useState("fullName")
  const {
    studentsList,
    loadState,
    sortByFullName,
    sortByFirstName,
    sortByLastName,
    sortMode,
    searchByName,
    saveStudentsRoll
  } = useContext(AttendanceContext)

  const onToolbarAction = (action: ToolbarAction, value?: string) => {
    if (action === "roll") {
      setIsRollMode(true)
    }
    if (action === "sort" && value) {
      if (sortingMode === "firstName") sortByFirstName(value);
      if (sortingMode === "lastName") sortByLastName(value);
      if (sortingMode === "fullName") sortByFullName(value);
    }
  }

  const handleInputChange = (keyword: string) => {
    searchByName(keyword);
  };

  const onActiveRollAction = (action: ActiveRollAction) => {
    if (action === "exit") {
      setIsRollMode(false)
      saveStudentsRoll();
    }
  }

  const handleSortDropdownChange = (value: any) => {
    setSortingMode(value);
  }

  return (
    <>
      <S.PageContainer>
        <Toolbar onItemClick={onToolbarAction}
          onInputChange={handleInputChange}
          sortOrder={sortMode}
          handleDropdownChange={handleSortDropdownChange}
          sortingMode={sortingMode}
        />

        {loadState === "loading" && (
          <CenteredContainer>
            <FontAwesomeIcon icon="spinner" size="2x" spin />
          </CenteredContainer>
        )}

        {loadState === "loaded" && studentsList && (
          <>
            {studentsList.map((s) => (
              <StudentListTile
                key={s.id}
                isRollMode={isRollMode}
                student={s} />
            ))}
          </>
        )}
  
        {loadState === "error" && (
          <CenteredContainer>
            <div>Failed to load</div>
          </CenteredContainer>
        )}
      </S.PageContainer>
      <ActiveRollOverlay
        isActive={isRollMode}
        onItemClick={onActiveRollAction}
      />
    </>
  )
}

type ToolbarAction = "roll" | "sort"
interface ToolbarProps {
  onItemClick: (action: ToolbarAction, value?: string) => void,
  onInputChange: (keyword: string) => void,
  sortOrder: boolean,
  handleDropdownChange: (value: string | unknown) => void,
  sortingMode: string
}
const Toolbar: React.FC<ToolbarProps> = (props) => {
  const { onItemClick, onInputChange, sortOrder, handleDropdownChange, sortingMode } = props
  return (
    <S.ToolbarContainer>
      <S.sortWrapper>
        <S.styledSelect
          id="demo-simple-select"
          value={sortingMode}
          onChange={(e) => { handleDropdownChange(e.target.value) }}
        >
          <MenuItem value={"fullName"}>Full Name</MenuItem>
          <MenuItem value={"firstName"}>First Name</MenuItem>
          <MenuItem value={"lastName"}>Last Name</MenuItem>
        </S.styledSelect>
        <S.ButtonWrapper>
          {sortOrder ?
            <FontAwesomeIcon onClick={() => onItemClick("sort", "asc")} icon={faArrowUp} size="sm" /> :
            <FontAwesomeIcon onClick={() => onItemClick("sort", "desc")} icon={faArrowDown} size="sm" />
          }
        </S.ButtonWrapper>
      </S.sortWrapper>
      <Input placeholder="Search..." style={{ color: "#fff" }} onChange={(e) => { onInputChange(e.target.value.toLowerCase()) }} />
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
  ButtonWrapper: styled.div`
    display: flex;
    flex-direction: column;
    cursor: pointer;
  `,
  sortWrapper: styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  `,
  styledSelect: styled(Select)`
  && {
    color: #fff;
    margin: 0 10px;
    font-size: ${FontSize.u4};
    padding: 4px 0 0 0;
    width: 6rem;
  }
  `,
}
