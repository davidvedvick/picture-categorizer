import {Express} from "express";
import AuthenticateCatEmployees from "./AuthenticateCatEmployees.js";
import {UnauthenticatedCatEmployee} from "./UnauthenticatedCatEmployee.js";
import BadCatEmployeeCredentials from "./BadCatEmployeeCredentials.js";
import DisabledCatEmployee from "./DisabledCatEmployee.js";
import {AuthenticatedCatEmployee} from "./AuthenticatedCatEmployee.js";

export default function(app: Express, authenticationManager: AuthenticateCatEmployees) {
    app.post("/api/login", async (req, res) => {
        const unauthenticatedCatEmployee = JSON.parse(req.body) as UnauthenticatedCatEmployee;

        try {
            const catEmployee = await authenticationManager.authenticate(unauthenticatedCatEmployee);

            if (catEmployee instanceof AuthenticatedCatEmployee) {
                res.json('json token here');
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

        // val userLoginRequest = call.receive<UserLoginRequest>()
        // val unauthenticatedCatEmployee = UnauthenticatedCatEmployee(userLoginRequest.email, userLoginRequest.password)
        //
        // when (val catEmployee = authenticationManager.authenticate(unauthenticatedCatEmployee)) {
        //     is AuthenticatedCatEmployee -> call.respond(manageJwtTokens.generateToken(catEmployee))
        //     is BadCatEmployeeCredentials -> call.respond(HttpStatusCode.BadRequest)
        //     else -> res.status(401)
        // }
    });
}