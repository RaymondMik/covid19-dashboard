import { getDailyIncrement } from "./utils";

describe("getDailyIncrement()", () => {
   test("should return a string", () => {
      expect(typeof getDailyIncrement({ prevData: 90, currData: 100 })).toBe("string");
   });

   test("should return '↔' if no differences", () => {
      expect(getDailyIncrement({ prevData: 500, currData: 500 })).toBe("↔");
      expect(getDailyIncrement({ prevData: 100, currData: 90, showNegative: false })).toBe("↔");
      expect(getDailyIncrement({ prevData: 100, currData: 90, showPercentage: false, showPlusSign: false, showNegative: false })).toBe("↔");
   });

   test("should add a %", () => {
      expect(getDailyIncrement({ prevData: 100, currData: 120 })).toBe("+20.00%");
      expect(getDailyIncrement({ prevData: 90, currData: 100 })).toBe("+11.11%");
      expect(getDailyIncrement({ prevData: 73604, currData: 74159 })).toBe("+0.75%");
      expect(getDailyIncrement({ prevData: 100, currData: 90 })).toBe("-10.00%");
      expect(getDailyIncrement({ prevData: 5, currData: 2 })).toBe("-60.00%");
      expect(getDailyIncrement({ prevData: 1000, currData: 890 })).toBe("-11.00%");
   })

   test("should add a + sign", () => {
      expect(getDailyIncrement({ prevData: 90, currData: 100, showPercentage: false })).toBe("+10");
   });

   test("should add a - sign", () => {
      expect(getDailyIncrement({ prevData: 100, currData: 90, showPercentage: false })).toBe("-10");
      expect(getDailyIncrement({ prevData: 100, currData: 90, showPercentage: false, showPlusSign: false })).toBe("-10");
   });

   test("should add no signs", () => {
      expect(getDailyIncrement({ prevData: 90, currData: 100, showPercentage: false, showPlusSign: false })).toBe("10");
      expect(getDailyIncrement({ prevData: 73604, currData: 74159, showPercentage: false, showPlusSign: false })).toBe("555");
   })
})