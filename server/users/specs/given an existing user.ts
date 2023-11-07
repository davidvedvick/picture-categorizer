import {beforeAll, describe, expect, test} from "@jest/globals";
import {AuthenticatedCatEmployee} from "../AuthenticatedCatEmployee.js";
import CatEmployeeEntry from "../CatEmployeeEntry.js";
import CatEmployee from "../CatEmployee.js";
import {ManageCatEmployees} from "../ManageCatEmployees.js";
import {UnauthenticatedCatEmployee} from "../UnauthenticatedCatEmployee.js";
import Encoder from "../../security/Encoder.js";

describe("given an existing user", () => {
    describe("when logging the user in", () => {
        let user: AuthenticatedCatEmployee;

        beforeAll(async () => {
            const catEmployeeEntry = new CatEmployeeEntry({
                findByEmail(email: string): Promise<CatEmployee | null> {
                    return Promise.resolve(email == "2l9L" ? {
                        email: "2l9L",
                        password: "MobWbSRg",
                        isEnabled: true,
                        id: 822,
                    } : null);
                }
            } as ManageCatEmployees, {
                matches(rawPassword: string, encodedPassword: string): boolean {
                    return rawPassword == "zc89" && encodedPassword == "MobWbSRg";
                }
            } as Encoder);

            user = await catEmployeeEntry.authenticate({
                email: "2l9L",
                password: "zc89",
            });
        });

        test("then the email is correct", () => {
            expect(user.email).toBe("2l9L");
        });

        test("then the password is correct", () => {
            expect(user.password).toBe("MobWbSRg");
        });

        test("then the user is authenticated", () => {
            expect(user).toBeInstanceOf(AuthenticatedCatEmployee);
        });
    });

    describe("and the password does not match", () => {
        let user: AuthenticatedCatEmployee;

        beforeAll(async () => {
            const catEmployeeEntry = new CatEmployeeEntry({
                findByEmail(email: string): Promise<CatEmployee | null> {
                    return Promise.resolve(email == "2l9L" ? {
                        email: "2l9L",
                        password: "69FM2Vw",
                        isEnabled: true,
                        id: 584,
                    } : null);
                }
            } as ManageCatEmployees, {
                matches(rawPassword: string, encodedPassword: string): boolean {
                    return rawPassword == "zc89" && encodedPassword == "MobWbSRg";
                }
            } as Encoder);

            user = await catEmployeeEntry.authenticate({
                email: "2l9L",
                password: "zc89",
            });
        });

        test("then the email is correct", () => {
            expect(user.email).toBe("2l9L");
        });

        test("then the password is correct", () => {
            expect(user.password).toBe("69FM2Vw");
        });

        test("then the user is not authenticated", () => {
            expect(user).toBeInstanceOf(UnauthenticatedCatEmployee);
        });
    });
});