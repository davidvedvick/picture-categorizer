import {Express} from "express";
import AuthenticateCatEmployees from "./AuthenticateCatEmployees.js";
import {UnauthenticatedCatEmployee} from "./UnauthenticatedCatEmployee.js";
import BadCatEmployeeCredentials from "./BadCatEmployeeCredentials.js";
import DisabledCatEmployee from "./DisabledCatEmployee.js";
import {AuthenticatedCatEmployee} from "./AuthenticatedCatEmployee.js";
import {ManageJwtTokens} from "../security/ManageJwtTokens.js";

export default function(app: Express, authenticationManager: AuthenticateCatEmployees, manageJwtTokens: ManageJwtTokens) {
    app.post("/api/login", async (req, res) => {
        const unauthenticatedCatEmployee = JSON.parse(req.body) as UnauthenticatedCatEmployee;

        try {
            const catEmployee = await authenticationManager.authenticate(unauthenticatedCatEmployee);

            if (catEmployee instanceof AuthenticatedCatEmployee) {
                res.json(await manageJwtTokens.generateToken(catEmployee));
                return;
            }

            if (catEmployee instanceof UnauthenticatedCatEmployee || catEmployee instanceof DisabledCatEmployee) {
                res.status(401);
                return;
            }

            console.warn("Authentication ended in an unexpected state.", catEmployee);
            res.status(500).send("Authentication ended in an unexpected state.");
        } catch (error) {
            if (error instanceof BadCatEmployeeCredentials) {
                res.status(400);
                return;
            }

            console.error("An error occurred logging a user in!", error);
            res.status(500).send("An unexpected error occurred!");
            return;
        }
    });
}