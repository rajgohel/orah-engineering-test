import React, { useState, useEffect, useContext } from "react"
import styled from "styled-components"
import Button from "@material-ui/core/ButtonBase"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Spacing, BorderRadius, FontWeight } from "shared/styles/styles"
import { Colors } from "shared/styles/colors"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { StudentListTile } from "staff-app/components/student-list-tile/student-list-tile.component"
import { ActiveRollOverlay, ActiveRollAction } from "staff-app/components/active-roll-overlay/active-roll-overlay.component"
import { Input, Switch } from "@material-ui/core"
import { RolllStateType } from "shared/models/roll"
import { AttendanceContext } from "shared/context/AttendanceContext"

export const HomeBoardPage: React.FC = () => {
  const [isRollMode, setIsRollMode] = useState(false)
  const {
    studentsList,
    loadState,
    sortByFullName,
    sortByFirstName,
    sortByLastName,
    sortMode,
    searchByName
  } = useContext(AttendanceContext)

  const onToolbarAction = (action: ToolbarAction, value?: string) => {
    if (action === "roll") {
      setIsRollMode(true)
    }
    if (action === "sort") {
      if (value !== "lastName") {
        sortByFirstName();
      }
      else {
        sortByLastName();
      }
    }
  }

  const handleInputChange = (keyword: string) => {
    searchByName(keyword);
  };

  const handleToggleChange = () => {
    sortByFullName();
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
  onToggleChange: () => void,
  sortOrder: boolean
}
const Toolbar: React.FC<ToolbarProps> = (props) => {
  const { onItemClick, onInputChange, onToggleChange, sortOrder } = props
  return (
    <S.ToolbarContainer>
      <Switch name="sortVal" checked={sortOrder} size="small" onChange={onToggleChange} />
      <S.Button onClick={() => onItemClick("sort")}>First Name</S.Button>
      <S.Button onClick={() => onItemClick("sort", "lastName")}>Last Name</S.Button>
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
}

type ItemType = RolllStateType | "all"
