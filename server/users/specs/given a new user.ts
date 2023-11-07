import {beforeAll, describe, expect, test} from "@jest/globals";
import {CatEmployeeCredentials} from "../CatEmployeeCredentials.js";
import CatEmployee from "../CatEmployee.js";
import CatEmployeeEntry from "../CatEmployeeEntry.js";
import DisabledCatEmployee from "../DisabledCatEmployee.js";

describe("given a new user", () => {
    describe("when logging the user in", () => {
        const addedCatEmployees: CatEmployee[] = [];
        let catEmployeeCredentials: CatEmployeeCredentials;

        beforeAll(async () => {
            const catEmployeeEntry = new CatEmployeeEntry({
                findByEmail(_: string): Promise<CatEmployee | null> {
                    return Promise.resolve(null);
                },
                save(catEmployee: CatEmployee): Promise<CatEmployee> {
                    addedCatEmployees.push(catEmployee);
                    return Promise.resolve(catEmployee);
                }
            }, {
                encode(rawPassword: string): string {
                    return rawPassword == "SOyRfcI" ? "eOLdjk" : "";
                },
                matches(rawPassword: string, encodedPassword: string): boolean {
                    return rawPassword == "SOyRfcI" && encodedPassword == "eOLdjk";
                }
            });

            catEmployeeCredentials = await catEmployeeEntry.authenticate({
                email: "4Z00cpZ",
                password: "SOyRfcI",
            });
        });

        test("then the email is correct", () => {
            expect(addedCatEmployees.map(e => e.email)).toStrictEqual(["4Z00cpZ"]);
        });

        test("then the password is correct", () => {
            expect(addedCatEmployees.map(e => e.password)).toStrictEqual(["eOLdjk"]);
        });

        test("then the user is not authenticated", () => {
           expect(catEmployeeCredentials).toBeInstanceOf(DisabledCatEmployee);
        });
    });
});