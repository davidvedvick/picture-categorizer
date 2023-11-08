import {beforeAll, describe, expect, test} from "@jest/globals";
import BCryptEncoder from "../BCryptEncoder.js";

const bCryptEncoder = new BCryptEncoder({ saltGenerations: 10 });

describe("given a password", () => {
    describe("and a hashed password", () => {
        describe("when comparing the passwords", () => {
            let result = false;

            beforeAll(async () => {
                result = await bCryptEncoder.matches(`k2H2hM\`LlV46b>y\\ND>Q`, `$2a$10$lfKDiuqC2o/iyg5f6.bUOOOZarDQtZ97rmhkOqRQGVV2Ib2nIGMpO`);
            });

            test("then result matches", () => {
                expect(result).toBeTruthy();
            });
        });
    });
});