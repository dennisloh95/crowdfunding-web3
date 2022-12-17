import React, { useEffect, useState } from "react";
import { DisplayCampaigns } from "../components";
import { ParseCampaignType, useStateContext } from "../context";

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState<ParseCampaignType[]>([]);

  const { address, contract, getUserCampaigns, getSearchQuery } =
    useStateContext();

  const fetchCampaigns = async () => {
    setIsLoading(true);
    try {
      const data = await getUserCampaigns();
      setCampaigns(data);
    } catch (err) {
      console.log(err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (contract) fetchCampaigns();
  }, [address, contract]);

  return (
    <DisplayCampaigns
      title="My Campaigns"
      isLoading={isLoading}
      campaigns={
        getSearchQuery() && campaigns.length
          ? campaigns.filter((campaign) =>
              campaign.title
                .toLowerCase()
                .includes(getSearchQuery().toLowerCase())
            )
          : campaigns
      }
    />
  );
};

export default Profile;
