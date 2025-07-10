import { useGetAddressQuery } from "@/tanstack/address";
import { useMemo } from "react";

export const useAddressByCityStats = () => {
    const { data: addresses, isLoading } = useGetAddressQuery();

    const stats = useMemo(() => {
        const cityMap = new Map<
            string,
            { count: number; users: { fullName: string; phone: string }[] }
        >();

        addresses?.forEach((addr: any) => {
            const city = addr.city?.trim() || "Khác";
            const userInfo = {
                fullName: addr.fullName,
                phone: addr.phone,
            };

            if (!cityMap.has(city)) {
                cityMap.set(city, { count: 1, users: [userInfo] });
            } else {
                const current = cityMap.get(city)!;
                current.count += 1;
                current.users.push(userInfo);
            }
        });

        return Array.from(cityMap.entries()).map(([city, data]) => ({
            city,
            count: data.count,
            users: data.users,
        }));
    }, [addresses]);

    return { stats, isLoading };
};
