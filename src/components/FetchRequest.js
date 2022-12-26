export const fetchPost = async (route, params) => {
  const res = await fetch(process.env.REACT_APP_API_SERVER + route, {
    mode: "cors",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    body: JSON.stringify(params),
  });

  if (res.status.toString().startsWith("5")) {
    console.log("Server error");
    return "Server error";
  }

  if (res.status == 403) {
    console.log("User already voted");
    let result = await res.json();
    return ["User already voted", result.id];
  }

  if (res.status.toString().startsWith("4")) {
    console.log("Invalid login");
    return "Invalid login";
  }

  let result = await res.json();

  if (res.ok) {
    return result;
  } else {
    console.error("request failed: ", result);
    return result;
  }
};

export const fetchCampaign = async (route) => {
  const res = await fetch(process.env.REACT_APP_API_SERVER + route, {
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  });

  if (res.status.toString().startsWith("5")) {
    console.log("Server error");
    return;
  }

  let result = await res.json();
  if (res.ok) {
    return result.data;
  } else {
    console.error("request failed: ", result);
  }
};

export const fetchCampaignById = async ({ campaign_id, candidate_id }) => {
  let path = `campaign/${campaign_id}`;
  if (candidate_id) path += `?candidate_id=${candidate_id}`;
  const res = await fetch(process.env.REACT_APP_API_SERVER + path, {
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  });

  if (res.status.toString().startsWith("5")) {
    console.log("Server error");
    return;
  }

  let result = await res.json();
  if (res.ok) {
    return result.data;
  } else {
    console.error("request failed: ", result);
  }
};
