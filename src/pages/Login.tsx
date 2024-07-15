import Button from "@mui/material/Button"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Container from "@mui/material/Container"
import Grid from "@mui/material/Grid"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import { useMutation } from "@tanstack/react-query"
import { AuthContext, client } from ".."
import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Box from "@mui/material/Box"

export default Login;

function Login() {
    const [name, setName] = useState("");
    const [password, setPasswd] = useState("");
    const [err, setErr] = useState("");
    const navigate = useNavigate();
    const { auth, login } = useContext(AuthContext);

    if (auth) {
        useEffect(() => { navigate("/") },[])
        return <></>
    }

    const loginAction = useMutation({
        async mutationFn() {
            setErr("");

            const { data, error } = await client.login.post({
                name, password
            });

            if (error) {
                throw error;
            }

            if (data) {
                login(data)
                navigate("/");
            } else {
                setErr("username atau password salah");
            }
        },
    })

    const handleLogin = () => {
        loginAction.mutate();
    }

    return (
        <Container
            maxWidth="md"
            sx={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
            }}
        >
            <Card sx={{ p: 4 }}>
                <CardContent>
                    <Grid container spacing={2} direction="column">
                        <Grid item>
                            <Typography variant="h3" fontWeight="500" gutterBottom>
                                Login
                            </Typography>
                        </Grid>
                        <Grid item>
                            <TextField
                                label="Username"
                                sx={{ width: "100%" }}
                                value={name}
                                onChange={(e) => setName(e.currentTarget.value)}
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                label="Password"
                                type="password"
                                sx={{ width: "100%" }}
                                value={password}
                                onChange={(e) => setPasswd(e.currentTarget.value)}
                            />
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                size="large"
                                disableElevation
                                sx={{ fontWeight: 800 }}
                                onClick={handleLogin}
                            >
                                Login
                            </Button>
                            {err && <Box sx={{ color: "red" }}>{err}</Box>}
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Container>
    );
}

