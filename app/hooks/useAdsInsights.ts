"use client";
import { useState, useEffect } from "react";
import { request, gql } from "graphql-request";

const GRAPHQL_ENDPOINT = "http://localhost:8080/graphql"; // Update if needed

const QUERY = gql`
  query {
    getAdsInsights {
      data {
        impressions
        date_start
        date_stop
      }
    }
  }
`;

export const useAdsInsights = () => {
  const [adsData, setAdsData] = useState<
    { impressions: number; date_start: string; date_stop: string }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: any = await request(GRAPHQL_ENDPOINT, QUERY);
        setAdsData(response.getAdsInsights.data);
      } catch (error) {
        console.error("GraphQL fetch error:", error);
      }
    };

    fetchData();
  }, []);

  return { adsData };
};
