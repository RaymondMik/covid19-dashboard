import { getDailyIncrement } from "./utils";

describe("should return the right number", () => {
   test("should return a string", () => {
      expect(typeof getDailyIncrement(90, 100)).toBe("string");
   });

   test("should provide the expected values", () => {
      expect(getDailyIncrement(90, 100)).toBe("+11.11%");
      expect(getDailyIncrement(100, 90)).toBe("-10.00%");
      expect(getDailyIncrement(100, 50)).toBe("-50.00%");
      expect(getDailyIncrement(500, 234)).toBe("-53.20%");
      expect(getDailyIncrement(1000, 890)).toBe("-11.00%");
      expect(getDailyIncrement(5, 2)).toBe("-60.00%");
      expect(getDailyIncrement(100, 120)).toBe("+20.00%");
      expect(getDailyIncrement(500, 500)).toBe("↔");
   });
})