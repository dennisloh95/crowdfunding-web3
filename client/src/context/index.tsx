import {
  useAddress,
  useContract,
  useMetamask,
  useContractWrite,
} from "@thirdweb-dev/react";
import { SmartContract } from "@thirdweb-dev/sdk";
import { ethers } from "ethers";
import { useContext, createContext, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FormType } from "../pages/CreateCampaign";

export interface ParseCampaignType {
  amountCollected: string;
  deadline: number;
  description: string;
  image: string;
  owner: string;
  pId: number;
  target: string;
  title: string;
}

export interface DonatorsType {
  donator: string;
  donation: string;
}

interface ContextType {
  address: string | undefined;
  contract: SmartContract<ethers.BaseContract> | undefined;
  connect: () => void;
  createCampaign: any;
  getCampaigns: () => Promise<ParseCampaignType[]>;
  getUserCampaigns: () => Promise<ParseCampaignType[]>;
  donate: (pId: number, amount: string) => Promise<any>;
  getDonations: (pId: number) => Promise<DonatorsType[]>;
  updateSearchQuery: (keywords: string) => void;
  getSearchQuery: () => string;
}

interface CampaignType {
  owner: string;
  title: string;
  description: string;
  target: BigInt;
  deadline: BigInt;
  amountCollected: BigInt;
  image: string;
  searchKeyword: string;
}

const StateContext = createContext<ContextType>({} as ContextType);

export const StateContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { contract } = useContract(
    "0x0809b1Fe09c5145329E1c653f94bff42aA43E6Ed"
  );
  const { mutateAsync: createCampaign } = useContractWrite(
    contract,
    "createCampaign"
  );

  const address = useAddress();
  const connect = useMetamask();
  const [searchParams, setSearchParams] = useSearchParams();

  const publishCampaign = async (form: FormType) => {
    try {
      const data = await createCampaign([
        address,
        form.title,
        form.description,
        form.target,
        new Date(form.deadline).getTime(),
        form.image,
      ]);
    } catch (err) {
      console.log("contract call failure ", err);
    }
  };

  const getCampaigns = async () => {
    const campaigns = await contract?.call("getCampaigns");
    const parsedCampaigns = campaigns.map(
      (campaign: CampaignType, i: number) => ({
        owner: campaign.owner,
        title: campaign.title,
        description: campaign.description,
        target: ethers.utils.formatEther(campaign.target.toString()),
        deadline: Number(campaign.deadline),
        amountCollected: ethers.utils.formatEther(
          campaign.amountCollected.toString()
        ),
        image: campaign.image,
        pId: i,
      })
    );
    return parsedCampaigns.length ? parsedCampaigns : [];
  };

  const getUserCampaigns = async () => {
    const allCampaigns = await getCampaigns();
    const filteredCampaigns = allCampaigns.filter(
      (campaign: ParseCampaignType) => campaign.owner === address
    );

    return filteredCampaigns;
  };

  const donate = async (pId: number, amount: any) => {
    const data = await contract?.call("donateToCampaign", pId, {
      value: ethers.utils.parseEther(amount),
    });
    return data;
  };

  const getDonations = async (pId: number) => {
    const donations = await contract?.call("getDonators", pId);
    const numberOfDonations = donations[0].length;

    const parsedDonations = [];

    for (let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        donator: donations[0][i],
        donation: ethers.utils.formatEther(donations[1][i].toString()),
      });
    }

    return parsedDonations;
  };

  const updateSearchQuery = (keyword: string) => {
    setSearchParams({ search: keyword });
  };

  const getSearchQuery = () => {
    return searchParams.get("search") || "";
  };

  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        connect,
        createCampaign: publishCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations,
        updateSearchQuery,
        getSearchQuery,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
