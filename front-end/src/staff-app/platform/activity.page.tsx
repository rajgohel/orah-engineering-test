import React, { useEffect } from "react"
import styled from "styled-components"
import { Spacing } from "shared/styles/styles"
import { useApi } from "shared/hooks/use-api";
import { CenteredContainer } from "shared/components/centered-container/centered-container.component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const ActivityPage: React.FC = () => {
  const [getActivities, activityData, loadState] = useApi({ url: "get-activities" });
  useEffect(() => {
    void getActivities();
  }, [])

  useEffect(() => {
    console.log("activityData...", activityData);
    console.log("loadState...", loadState);
  }, [activityData]);
  return (
    <>
      {
        loadState === "loading" && (
          <CenteredContainer>
            <FontAwesomeIcon icon="spinner" size="2x" spin />
          </CenteredContainer>
        )
      }

      {
        loadState === "loaded" &&
        (<S.Container>Activity Page</S.Container>)
      }
    </>
  )
}

const S = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 0;
  `,
}
