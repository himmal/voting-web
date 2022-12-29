import React, { useEffect, useState, useContext } from "react";
import Accordion from "react-bootstrap/Accordion";
import { Candidates } from "./Candidates";
import { fetchCampaign, fetchCampaignById } from "./FetchRequest";
import { useSocket } from "../SocketContext.tsx";
import { LoginContext } from "../App";

function ListBody() {
  const { logged } = useContext(LoginContext);
  const [campaignList, setCampaignList] = useState([]);
  const [endedCampaignList, setEndedCampaignList] = useState([]);

  const io = useSocket();

  useEffect(() => {
    if (!logged) {
      getCampaign();
      getEndedCampaign();
    }
  }, []);

  useEffect(() => {
    if (logged) {
      getCampaign();
      getEndedCampaign();
      console.log("logged update");
    }
  }, [logged]); //loginToken
  // real-time update
  useEffect(() => {
    const onVoteUpdate = async (notice) => {
      // console.log("campaignList: ", campaignList);
      if (campaignList.length < 1) {
        console.log(" missing campaign list");
        getCampaign();
      }

      // console.log(" continue updating campaign list");
      const index = campaignList.findIndex((object) => {
        return object.id == notice.campaign_id;
      });
      let newCampaignList = campaignList;

      let result = await fetchCampaignById({
        campaign_id: notice.campaign_id,
        candidate_id: notice.candidate_id,
      });

      if (result.length !== 1 || !result[0].vote_count) {
        console.log("redis cache expired");
        getCampaign();
        return;
      }

      const candidateIndex = newCampaignList[index].candidates.findIndex(
        (object) => {
          return object.id == result[0].id;
        }
      );

      const diff =
        result[0].vote_count -
        campaignList[index].candidates[candidateIndex].vote_count;

      newCampaignList[index].candidates[candidateIndex].vote_count =
        result[0].vote_count;

      if (diff > 0) newCampaignList[index].vote_count += diff;

      console.log("Update: ", newCampaignList);
      setCampaignList([...newCampaignList]);
    };

    // theoretical limit is 65k connections per IP address
    io.on("vote-update", onVoteUpdate);
    return () => {
      io.off("vote-update");
    };
  }, [io, campaignList]);

  const getCampaign = async () => {
    let result = await fetchCampaign("campaign");
    if (result?.length > 0) {
      setCampaignList([...result]);
    }
  };

  const getEndedCampaign = async () => {
    let result = await fetchCampaign("endedCampaign");
    if (result?.length > 0) {
      setEndedCampaignList([...result]);
    }
  };

  return (
    <Accordion style={{ paddingLeft: 10, paddingRight: 10 }}>
      {campaignList.length > 0
        ? campaignList.map((item, index) => (
            <Accordion.Item eventKey={`${index}`} key={`campaign-${item.id}`}>
              <Accordion.Header>
                <div>
                  <h1>{item.name}</h1>
                  <p style={textStyle}>
                    Start date: {item.start_time?.substring(0, 10)}
                  </p>
                  <p style={textStyle}>
                    End date: {item.end_time?.substring(0, 10)}
                  </p>
                  <p style={textStyle}>Current vote: {item.vote_count}</p>
                </div>
              </Accordion.Header>
              <Accordion.Body>
                <Candidates
                  itemIds={[item.id, item.voted]}
                  candidates={item.candidates.sort((a, b) => {
                    return a.id - b.id;
                  })}
                  disable={false}
                />
              </Accordion.Body>
            </Accordion.Item>
          ))
        : ""}
      {endedCampaignList.length > 0
        ? endedCampaignList.map((item, index) => (
            <Accordion.Item
              eventKey={`s${index}`}
              key={`s-campaign-${item.id}`}
              style={{ opacity: 0.5 }}
            >
              <Accordion.Header>
                <div>
                  <h1>{item.name}</h1>
                  <p style={textStyle}>
                    Vote ended at: {item.end_time?.substring(0, 10)}
                  </p>
                  <p style={textStyle}>Total vote: {item.vote_count}</p>
                </div>
              </Accordion.Header>
              <Accordion.Body>
                <Candidates
                  candidates={item.candidates}
                  itemIds={[item.id, item.voted]}
                  disable={true}
                />
              </Accordion.Body>
            </Accordion.Item>
          ))
        : ""}
    </Accordion>
  );
}

const textStyle = {
  margin: "5px",
};

export default ListBody;
