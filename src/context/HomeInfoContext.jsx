'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const HomeInfoContext = createContext(null);

export const HomeInfoProvider = ({ children }) => {
    const [homeInfo, setHomeInfo] = useState(null);
    const [homeInfoLoading, setHomeInfoLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchHomeInfo = async () => {
            try {
                const data = await getHomeInfo();
                setHomeInfo(data);
            } catch (err) {
                console.error("Error fetching home info:", err);
                setError(err);
            } finally {
                setHomeInfoLoading(false);
            }
        };
        fetchHomeInfo();
    }, []);
    return (
        <HomeInfoContext.Provider value={{ homeInfo, homeInfoLoading, error }}>
            {children}
        </HomeInfoContext.Provider>
    );
};

export const useHomeInfo = () => useContext(HomeInfoContext);
