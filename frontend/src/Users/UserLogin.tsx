import {Button, Col, Container, Form, FormGroup, Input, Label} from "reactstrap";

export function UserLogin() {

    async function handleSubmit() {
        await fetch("")
    }

    return (
        <Container fluid="sm">
            <Col sm>
                <Form>
                    <FormGroup floating>
                        <Input id="user" type="text" placeholder="User Name"/>
                        <Label for="user">User Name</Label>
                    </FormGroup>
                    <FormGroup floating>
                        <Input id="password" type="password" placeholder="Password"/>
                        <Label for="password">Password</Label>
                    </FormGroup>
                    {/*<p><Button type="submit">Login</Button></p>*/}
                    <p><Button type="submit" onSubmit={handleSubmit}>Login</Button></p>
                </Form>
            </Col>
        </Container>
    );
}