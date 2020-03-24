import { getDailyIncrement } from "./utils";

describe("should return right number", () => {
   test("should return 10", () => {
      expect(typeof getDailyIncrement(90, 100)).toBe("string");
      expect(getDailyIncrement(90, 100)).toBe("+11%");
      expect(getDailyIncrement(100, 90)).toBe("-10%");
      expect(getDailyIncrement(100, 50)).toBe("-50%");
      expect(getDailyIncrement(500, 234)).toBe("-53%");
      expect(getDailyIncrement(1000, 890)).toBe("-11%");
      expect(getDailyIncrement(5, 2)).toBe("-60%");
      expect(getDailyIncrement(100, 120)).toBe("+20%");
      expect(getDailyIncrement(500, 500)).toBe("↔");
   })
})