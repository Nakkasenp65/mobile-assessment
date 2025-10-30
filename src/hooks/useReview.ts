// src/hooks/useReview.ts

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// Define the structure of a single review from the API
interface Review {
  author: string;
  profilePhotoUrl: string;
  rating: number;
  timeDescription: string;
  text: string;
  reviewPhotoUrls: string[];
}

// Define the structure of the entire API response
interface ReviewsResponse {
  placeName: string;
  overallRating: number;
  reviews: Review[];
}

// Function to fetch the reviews from the API
const fetchReviews = async (): Promise<ReviewsResponse> => {
  const reviewApiUrl = process.env.NEXT_PUBLIC_REVIEW_API_URL;
  const { data } = await axios.get(reviewApiUrl);
  return data;
};

// Custom hook to use the reviews query
export const useReview = () => {
  return useQuery<ReviewsResponse, Error>({
    queryKey: ["googleReviews"], // A unique key to identify this query
    queryFn: fetchReviews, // The function that will fetch the data
  });
};
