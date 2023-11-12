import {beforeAll, describe, expect, test} from "@jest/globals";
import CatEmployeeEntry from "../CatEmployeeEntry.js";
import CatEmployee from "../CatEmployee.js";
import {ManageCatEmployees} from "../ManageCatEmployees.js";
import Encoder from "../../security/Encoder.js";
import BadCatEmployeeCredentials from "../BadCatEmployeeCredentials.js";

describe("given an existing user without a password", () => {
    describe("when logging the user in", () => {
        let error: BadCatEmployeeCredentials;

        beforeAll(async () => {
            const catEmployeeEntry = new CatEmployeeEntry({
                findByEmail(email: string): Promise<CatEmployee | null> {
                    return Promise.resolve(email == "ZtyPVt" ? {
                        email: email,
                        password: "",
                        isEnabled: true,
                        id: 315,
                    } : null);
                }
            } as ManageCatEmployees, {} as Encoder);

            try {
                await catEmployeeEntry.authenticate({
                    email: "ZtyPVt",
                    password: "MnI875",
                });
            } catch (e) {
                if (e instanceof BadCatEmployeeCredentials)
                    error = e;
            }
        });

        test("then the email is correct", () => {
            expect(error.email).toBe("ZtyPVt");
        });

        test("then the password is correct", () => {
            expect(error.password).toBe("MnI875");
        });
    });
});