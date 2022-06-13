import React, { useEffect } from "react"
import styled from "styled-components"
import { Spacing } from "shared/styles/styles"
import { useApi } from "shared/hooks/use-api";
import { CenteredContainer } from "shared/components/centered-container/centered-container.component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Activity } from "shared/models/activity";
import { Roll } from "shared/models/roll";
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { PolarArea } from "react-chartjs-2";
ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

export const ActivityPage: React.FC = () => {
  const [getActivities, activityData, loadState] = useApi<{ activity: Activity[] }>({ url: "get-activities" });
  useEffect(() => {
    void getActivities();
  }, [])

  const graphLabels = ['Present', 'Absent', 'Late', 'Unmarked'];
  const graphDatasetsColor = [
    'rgba(255, 99, 132, 0.5)',
    'rgba(54, 162, 235, 0.5)',
    'rgba(255, 206, 86, 0.5)',
    'rgba(75, 192, 192, 0.5)'
  ];

  const getRollCount = (entity: Roll) => {
    let presentCount: number = 0;
    let absentCount: number = 0;
    let lateCount: number = 0;
    let unmarkCount: number = 0;
    entity.student_roll_states.forEach((ele) => {
      if (ele.roll_state === "present") presentCount++;
      if (ele.roll_state === "absent") absentCount++;
      if (ele.roll_state === "late") lateCount++;
      if (ele.roll_state === "unmark") unmarkCount++;
    });
    return {
      labels: graphLabels,
      datasets: [
        {
          label: '# of Votes',
          data: [presentCount, absentCount, lateCount, unmarkCount],
          backgroundColor: graphDatasetsColor,
          borderWidth: 1,
        },
      ],
    };
  }

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
        loadState === "loaded" && activityData?.activity && (
          <S.Container>
            {
              activityData.activity.map((ele, index) => (
                <Accordion key={index}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography>{ele.entity.name}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <PolarArea
                      data={getRollCount(ele.entity)}
                      height="200rem"
                      width="200rem"
                      options={{ maintainAspectRatio: false }} />
                  </AccordionDetails>
                </Accordion>
              ))
            }
          </S.Container>
        )
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
