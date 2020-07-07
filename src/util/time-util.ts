export class TimeUtility {

    public static getBeginTodayUTC(): number {
        const now = new Date();
        return Date.UTC(now.getUTCFullYear(),now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), 0, 0, 0);
    }

    public static getBeginEpochTime(): number {
        const now = new Date();
        return Date.UTC(1970,0, 1, 0, 0, 0, 0);
    }
}