import { getDailyIncrement } from "./utils";
// import { mockData } from "../mockData.js"

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

// describe("formatVaccineData()", () => {
//    test("should calculate total vaccines given by date", () => {
//       expect(formatVaccineData(mockData)).toEqual({
//          "2021-04-16": 3000, "2021-04-18": 5000, "2021-04-20": 939, "2021-04-22": 5062, "2021-06-21": 1000, "2021-08-15": 4423
//       });
//    })
// })