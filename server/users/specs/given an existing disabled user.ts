import {beforeAll, describe, expect, test} from "@jest/globals";
import {CatEmployeeCredentials} from "../CatEmployeeCredentials.js";
import CatEmployee from "../CatEmployee.js";
import CatEmployeeEntry from "../CatEmployeeEntry.js";
import DisabledCatEmployee from "../DisabledCatEmployee.js";

describe("given an existing disabled user", () => {
    describe("when logging the user in", () => {
        const addedCatEmployees: CatEmployee[] = [];
        let catEmployeeCredentials: CatEmployeeCredentials;

        beforeAll(async () => {
            const catEmployeeEntry = new CatEmployeeEntry({
                findByEmail(_: string): Promise<CatEmployee | null> {
                    return Promise.resolve({
                        email: "4Z00cpZ",
                        password: "SOyRfcI",
                        isEnabled: false,
                        id: 518,
                    });
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

        test("then no employees are added", () => {
            expect(addedCatEmployees).toStrictEqual([]);
        });

        test("then the user is not authenticated", () => {
            expect(catEmployeeCredentials).toBeInstanceOf(DisabledCatEmployee);
        });
    });
});