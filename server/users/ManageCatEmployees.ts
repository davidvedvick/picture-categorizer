import CatEmployee from "./CatEmployee.js";

export interface ManageCatEmployees {

    findByEmail(email: string): Promise<CatEmployee | null>

    save(catEmployee: CatEmployee): Promise<CatEmployee>
}