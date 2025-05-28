import axios from "axios";

export const getAllProducts = async () => {
    const response = await axios.get(process.env.NEXT_PUBLIC_API_URL || '')
    return response.data;
}
