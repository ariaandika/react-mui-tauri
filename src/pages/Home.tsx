import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import Container from "@mui/material/Container";
import { forwardRef, useContext, useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grow from "@mui/material/Grow";
import Skeleton from "@mui/material/Skeleton";
import Snackbar from "@mui/material/Snackbar";
import Share from "@mui/icons-material/Share";
import Star from "@mui/icons-material/Star";

import type { Tickets } from "../../server/index"
import { TransitionProps, } from "@mui/material/transitions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthContext, client } from "..";

const u = (i: number, m: any) => Array(i).fill(m);

export default function() {
    return <GridImg/>
}

function GridImg() {
    const { auth } = useContext(AuthContext);
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ["tickets"],
        queryFn: async () => {
            const { data, error } = await client.index.get();
            if (error) throw error;
            return data.toSorted(() => Math.random() - 0.5);
        },
    });

    const [dstate, setDState] = useState<Tickets | null>(null);
    const [snackState, setSnackState] = useState(false);

    const handleClose = () => {
        setDState(null)
    };

    const mutation = useMutation({
        mutationFn: async (ticket: Tickets) => await client.buy.post({ ticket_id: ticket.id, user: auth.name }),
        onSuccess: () => {
            setDState(null);
            setSnackState(true);
            queryClient.invalidateQueries({ queryKey: ["tickets"] })
        },
    })

    return (
        <Container maxWidth="xl">
            <Typography variant="h3" sx={{ py: 4 }}>
                Daftar Tiket
            </Typography>
            <Box
                sx={{
                    display: "grid",
                    width: "100%",
                    gridTemplateColumns: u(3, "1fr").join(" "),
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
                            onAboutToBuy={(ticket) => setDState(ticket)}
                            key={ticket.id}
                        />
                    ))
                }
                {(query.data?.length === 0) && <div>Tidak ada tiket</div>}
            </Box>
            <DialogComp
                handleClose={handleClose}
                ticket={dstate}
                onBuy={(ticket) => mutation.mutate(ticket)}
            />
            <Snackbar
                message="Terimakasih Sudah Membeli"
                autoHideDuration={5000}
                open={snackState}
                onClose={() => setSnackState(false)}
            />
        </Container>
    )
}

function Img({
    ticket,
    onAboutToBuy,
}:{
    ticket: Tickets,
    onAboutToBuy: (ticket: Tickets) => void,
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
                    <Button
                        variant="contained"
                        sx={{ minWidth: 90, ml: 2 }}
                        disableElevation
                        onClick={() => onAboutToBuy(ticket)}
                    >
                        Beli
                    </Button>
                </Box>
            </CardActions>
        </Card>
    )
}

function DialogComp({
    ticket,
    handleClose,
    onBuy
}: {
    ticket: Tickets | null,
    handleClose: () => void,
    onBuy: (ticket: Tickets) => void
}) {
    return (
        <Dialog
            open={Boolean(ticket)}
            onClose={handleClose}
            TransitionComponent={Transition}
            fullWidth
            maxWidth="lg"
        >
            <DialogTitle>Beli tiket ini ?</DialogTitle>
            <DialogContent sx={{ overlfow: "hidden", mb: 0 }}>
                {ticket && <>
                    <Box sx={{ overflow: "hidden", mb: 2 }}>
                        <img
                            src={ticket.img}
                            style={{
                                height: 600,
                                width: "100%",
                                objectFit: "cover",
                                objectPosition: "center",
                            }}
                        />
                    </Box>
                    <Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Chip size="small" color="primary" variant="outlined" label={ticket.studio}/>
                            <Box>{new Date(ticket.time).toLocaleString()}</Box>
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography variant="h5">
                                {ticket.name}
                            </Typography>
                            <Typography variant="h5" sx={{
                                color: ticket?.price! > 400000 ? "#D50000" : ticket?.price! > 300000 ? "#FFD600" : "#64DD17"
                            }}>
                                Rp. {new Intl.NumberFormat().format(ticket?.price ?? 0)}
                            </Typography>
                        </Box>
                    </Box>
                </>}
            </DialogContent>
            <DialogActions sx={{ justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Box>
                    <IconButton sx={{ justifySelf: "flex-start" }}>
                        <Star />
                    </IconButton>
                    <IconButton>
                        <Share />
                    </IconButton>
                </Box>
                <Box>
                    <Button
                        onClick={handleClose}
                        size="large"
                    >
                        batal
                    </Button>
                    <Button
                        autoFocus
                        variant="contained"
                        size="large"
                        sx={{ minWidth: 90, mx: 2, }}
                        disableElevation
                        onClick={() => onBuy(ticket!)}
                    >
                        Beli
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
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

const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Grow ref={ref} {...props} />;
});

