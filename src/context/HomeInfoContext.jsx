'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const HomeInfoContext = createContext(null);

// Mock data function
const getHomeInfo = async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return mock data
    return {
        spotlights: [
            {
                id: 1,
                title: "Featured Anime",
                image: "/api/placeholder/800/450",
                description: "Amazing anime series",
                rating: 4.8,
                episodes: 24
            }
        ],
        genres: [
            { id: 1, name: "Action", count: 150 },
            { id: 2, name: "Romance", count: 120 },
            { id: 3, name: "Comedy", count: 200 },
            { id: 4, name: "Drama", count: 180 }
        ],
        latest_episode: [
            {
                id: 1,
                title: "Latest Episode 1",
                image: "/api/placeholder/200/300",
                episode: 12,
                rating: 4.5
            },
            {
                id: 2,
                title: "Latest Episode 2",
                image: "/api/placeholder/200/300",
                episode: 8,
                rating: 4.2
            }
        ],
        top_airing: [
            {
                id: 1,
                title: "Top Airing 1",
                image: "/api/placeholder/200/300",
                episode: 15,
                rating: 4.7
            }
        ],
        most_favorite: [
            {
                id: 1,
                title: "Most Favorite 1",
                image: "/api/placeholder/200/300",
                episode: 24,
                rating: 4.9
            }
        ],
        latest_completed: [
            {
                id: 1,
                title: "Latest Completed 1",
                image: "/api/placeholder/200/300",
                episode: 12,
                rating: 4.6
            }
        ],
        trending: [
            {
                id: 1,
                title: "Trending 1",
                image: "/api/placeholder/150/200",
                rank: 1
            }
        ],
        topten: [
            {
                id: 1,
                title: "Top Ten 1",
                image: "/api/placeholder/150/200",
                rank: 1,
                rating: 4.8
            }
        ]
    };
};

export const HomeInfoProvider = ({ children }) => {
    const [homeInfo, setHomeInfo] = useState(null);
    const [homeInfoLoading, setHomeInfoLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        // Only run on client side
        if (typeof window !== 'undefined') {
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
        } else {
            // Set loading to false on server side
            setHomeInfoLoading(false);
        }
    }, []);
    
    return (
        <HomeInfoContext.Provider value={{ homeInfo, homeInfoLoading, error }}>
            {children}
        </HomeInfoContext.Provider>
    );
};

export const useHomeInfo = () => {
    const context = useContext(HomeInfoContext);
    if (!context) {
        throw new Error('useHomeInfo must be used within a HomeInfoProvider');
    }
    return context;
};
