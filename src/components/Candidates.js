import React, { useEffect, useState, useContext } from "react";
import { Form, Button, Table } from "react-bootstrap";
import { fetchPost } from "./FetchRequest";
import { LoginContext } from "../App";

export const Candidates = React.memo(function Candidates({
  itemIds,
  candidates,
  disable,
}) {
  const { loginToken, toggleLogin, logged } = useContext(LoginContext);

  const [item, setItem] = useState(null);
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    if (itemIds[1]) {
      setVoted(true);
      setItem(itemIds[1] - candidates[0].id);
    }
  }, [candidates]);

  const handleChange = (e, index) => {
    e.persist();
    if (disable || voted) {
      return;
    }
    setItem(index);
  };

  useEffect(() => {
    if (!logged) {
      setItem(null);
      setVoted(false);
    }
  }, [logged]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (disable || voted) {
      return;
    }
    if (item != null) {
      let result = await fetchPost("vote", {
        campaign_id: itemIds[0],
        candidate_id: candidates[item].id,
      });
      if (result == "Invalid login") {
        alert("Please login before voting");
        toggleLogin();
      } else if (result[0] == "User already voted") {
        console.log("User already voted for ", result[1]);
        setVoted(true);
        alert("You have already voted for this campaign");
        setItem(result[1] - candidates[0].id);
      }

      if (result.data) {
        setVoted(true);
        setItem(result[1] - candidates[0].id);
      }
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <div className="mb-3">
        <Table hover responsive>
          <tbody>
            {candidates.map((candidate, index) => (
              <tr
                onClick={(event) => handleChange(event, index)}
                key={`list-${candidate.id}`}
              >
                <td colSpan={2}>
                  <Form.Check
                    label={candidate.name}
                    name={`group-${candidate.campaign_id}`}
                    type={"radio"}
                    id={`candidate-${candidate.id}`}
                    checked={item == index}
                    readOnly
                  >
                    {disable && !itemIds[1] ? (
                      <Form.Check.Label>{candidate.name}</Form.Check.Label>
                    ) : (
                      ""
                    )}
                  </Form.Check>
                </td>
                <td>
                  <label> vote: {candidate.vote_count}</label>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <Button
        variant="primary"
        type="submit"
        disabled={disable || voted}
        style={{ backgroundColor: disable ? "grey" : voted ? "green" : "" }}
      >
        {!disable ? (voted ? "Voted" : "Submit your choice") : "Vote ended"}
      </Button>
    </Form>
  );
});

//export default Candidates;
