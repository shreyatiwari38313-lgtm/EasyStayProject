import axios from "axios";

export const getAmenities = async () => {
  const res = await axios.get("/api/v1/amenities");
  return res.data;
};