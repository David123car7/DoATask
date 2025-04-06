import { baseReward } from "./tasks.constants";

export function calculateReward(
    difficulty: string,
    score: number,
){


    const diff = difficulty.toLowerCase();
    const reward = baseReward[diff] || {coins: 5, points:10}; // Default reward if difficulty is not recognized

    const performanceFactor = (score -1) /4;
    const bonusMultiplier = 0.2; // 20% bonus for performance

    const bonusCoins = performanceFactor * bonusMultiplier * reward.coins;
    const bonusPoints = performanceFactor * bonusMultiplier * reward.points;

    return {
        totalCoins : reward.coins + bonusCoins,
        totalPoints : reward.points + bonusPoints,
    };
}