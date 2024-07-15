import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import Container from "@mui/material/Container";
import { useContext } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { useQuery } from "@tanstack/react-query";
import { AuthContext, client } from "..";
import type { Tickets } from "../../server";
import Skeleton from "@mui/material/Skeleton";
import Chip from "@mui/material/Chip";
import Share from "@mui/icons-material/Share";
import Star from "@mui/icons-material/Star";

const u = (i: number, m: any) => Array(i).fill(m);

export default function() {
    return <GridImg/>
}

function GridImg() {
    const { auth } = useContext(AuthContext);

    const query = useQuery({
        queryKey: [auth.name + "-tickets"],
        queryFn: async () => {
            const { data, error } = await client.tickets({ name: auth.name }).get()
            if (error) throw error;
            return data
        }
    })

    return (
        <Container maxWidth="xl">
            <Typography variant="h3" sx={{ py: 4 }}>
                Tiket dibeli oleh {auth.name}
            </Typography>
            <Box
                sx={{
                    display: "grid",
                    width: "100%",
                    gridTemplateColumns: u(4, "1fr").join(" "),
                    gap: 2
                }}
            >
                {query.isLoading ? 
                    Array(8).fill(0).map((_, key) => (
                        <Box key={key}>
                            <SkeletonCard/>
                        </Box>
                    )) :
                    (query.data ?? []).map((ticket) => (
                        <Img
                            ticket={ticket}
                            key={ticket.id}
                        />
                    ))
                }
                {(query.data?.length === 0) && <div>Tidak ada tiket</div>}
            </Box>
        </Container>
    )
}

function Img({
    ticket,
}:{
    ticket: Tickets,
}) {
    return (
        <Card>
            <CardHeader
                avatar={<Avatar>{ticket.studio.slice(0,1).toUpperCase()}</Avatar>}
                title={ticket.name}
                subheader={new Date(ticket.time).toLocaleString()}
            />
            <CardMedia
                component="img"
                sx={{ aspectRatio: "5 / 3" }}
                image={ticket.img}
            />
            <CardContent>
                <Chip size="small" color="primary" variant="outlined" label={ticket.studio}/>
                <Typography variant="h5">
                    {ticket.name}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Dibeli pada {new Date(ticket.buyed_at).toLocaleString()}
                </Typography>
            </CardContent>
            <CardActions disableSpacing sx={{ justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="h5" sx={{
                        color: ticket.price > 400000 ? "#D50000" : ticket.price > 300000 ? "#FFD600" : "#64DD17"
                    }}>
                        Rp. {new Intl.NumberFormat().format(ticket.price)}
                    </Typography>
                </Box>
                <Box>
                    <IconButton sx={{ justifySelf: "flex-start" }}>
                        <Star />
                    </IconButton>
                    <IconButton>
                        <Share />
                    </IconButton>
                </Box>
            </CardActions>
        </Card>
    )
}


function SkeletonCard() {
    return (
        <Card>
            <CardHeader avatar={<Avatar></Avatar>}/>
            <Skeleton variant="rectangular" height={280}/>
            <CardActions disableSpacing sx={{ justifyContent: "end" }}>
                <Skeleton variant="rectangular" height={32}/>
            </CardActions>
        </Card>
    )
}
