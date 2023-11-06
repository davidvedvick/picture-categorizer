import {beforeAll, describe, expect, test} from "@jest/globals";
import {AuthenticatedCatEmployee} from "../AuthenticatedCatEmployee.js";
import CatEmployeeEntry from "../CatEmployeeEntry.js";
import CatEmployee from "../../users/CatEmployee.js";
import {ManageCatEmployees} from "../../users/ManageCatEmployees.js";

describe("given an existing user", () => {
    describe("when logging the user in", () => {
        let user: AuthenticatedCatEmployee;

        beforeAll(async () => {
            const catEmployeeEntry = new CatEmployeeEntry({
                findByEmail(email: string): Promise<CatEmployee | null> {
                    return Promise.resolve(email == "2l9L" ? {
                        email: "2l9L",
                        password: "zc89",
                        isEnabled: true,
                        id: 822,
                    } : null);
                }
            } as ManageCatEmployees, {
                encode(rawPassword: string): string {
                    return rawPassword == "zc89" ? "MobWbSRg" : "";
                },
                matches(rawPassword: string, encodedPassword: string): boolean {
                    return rawPassword == "zc89" && encodedPassword == "MobWbSRg";
                }
            });

            user = await catEmployeeEntry.authenticate({
                email: "2l9L",
                password: "zc89",
            });
        });

        test("then the email is correct", () => {
            expect(user.email).toBe("2l9L");
        });

        test("then the password is correct", () => {
            expect(user.password).toBe("zc89");
        });

        test("then the user is authenticated", () => {
            expect(user).toBeInstanceOf(AuthenticatedCatEmployee);
        });
    });
});