import {ManageCatEmployees} from "./ManageCatEmployees.js";
import CatEmployee from "./CatEmployee.js";
import {Pool, ResultSetHeader, RowDataPacket} from "mysql2/promise";

const selectFromCatEmployees = `
SELECT
     id as id,
     email as email,
     password as password,
     is_enabled as isEnabled
FROM cat_employee`;

export default class CatEmployeeRepository implements ManageCatEmployees {

    constructor(private readonly pool: Pool) {}

    async findByEmail(email: string): Promise<CatEmployee | null> {
        const [results, _] = await this.pool.execute<RowDataPacket[]>(
            `${selectFromCatEmployees} WHERE email = ?`,
            [email]
        );

        return results.length > 0 ? results[0] as CatEmployee : null;
    }

    async save(catEmployee: CatEmployee): Promise<CatEmployee> {
        const [results, _] = await this.pool.execute<ResultSetHeader>(
            `INSERT INTO cat_employee (email, password, is_enabled) VALUES (?, ?, ?);`,
            [catEmployee.email, catEmployee.password, catEmployee.isEnabled]
        );

        catEmployee.id = results.insertId;

        return catEmployee;
    }
}