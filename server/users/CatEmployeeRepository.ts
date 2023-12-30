import { ManageCatEmployees } from "./ManageCatEmployees.js";
import CatEmployee from "./CatEmployee.js";
import { Database } from "better-sqlite3";

const selectFromCatEmployees = `
SELECT
     id as id,
     email as email,
     password as password,
     is_enabled as isEnabled
FROM cat_employee`;
export class CatEmployeeRepository implements ManageCatEmployees {
    constructor(private readonly db: Database) {}

    async findByEmail(email: string): Promise<CatEmployee | null> {
        const query = this.db.prepare<string>(`${selectFromCatEmployees} WHERE email = ?`);

        const result = query.get(email) as CatEmployee;

        return result ?? null;
    }

    async save(catEmployee: CatEmployee): Promise<CatEmployee> {
        const statement = this.db.prepare<[string, string, boolean]>(
            "INSERT INTO cat_employee (email, password, is_enabled) VALUES (?, ?, ?);",
        );

        const result = statement.run(catEmployee.email, catEmployee.password, catEmployee.isEnabled);

        catEmployee.id = result.lastInsertRowid as number;

        return catEmployee;
    }
}
