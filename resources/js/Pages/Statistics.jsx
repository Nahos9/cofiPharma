import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, Typography, Grid, Box, TextField, Button, Stack } from '@mui/material';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

export default function Statistics({ auth, statistiques }) {
    const [filtres, setFiltres] = useState({
        date_debut: statistiques.filtres.date_debut,
        date_fin: statistiques.filtres.date_fin
    });

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFiltres(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFilterSubmit = () => {
        router.get(route('statistiques'), filtres, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleExport = () => {
        window.location.href = route('statistiques.export', filtres);
    };

    const chartData = {
        labels: statistiques.demandesParJour.map(item => item.date),
        datasets: [
            {
                label: 'Demandes par jour',
                data: statistiques.demandesParJour.map(item => item.total),
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
            },
            {
                label: 'Montant total par jour',
                data: statistiques.demandesParJour.map(item => item.montant_total),
                borderColor: 'rgb(255, 99, 132)',
                tension: 0.1,
                yAxisID: 'y1',
            }
        ],
    };

    const pieData = {
        labels: ['En attente', 'Validées', 'Rejetées', 'Débloquées'],
        datasets: [{
            data: [
                statistiques.demandesEnAttente,
                statistiques.demandesValidees,
                statistiques.demandesRejetees,
                statistiques.demandesDebloquees
            ],
            backgroundColor: [
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)'
            ],
        }]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Évolution des demandes et montants',
            },
        },
        scales: {
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                title: {
                    display: true,
                    text: 'Nombre de demandes'
                }
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                title: {
                    display: true,
                    text: 'Montant total'
                },
                grid: {
                    drawOnChartArea: false,
                },
            },
        },
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Statistiques</h2>}
        >
            <Head title="Statistiques" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Filtres */}
                    <Card className="mb-6">
                        <CardContent>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <TextField
                                    label="Date de début"
                                    type="date"
                                    name="date_debut"
                                    value={filtres.date_debut}
                                    onChange={handleFilterChange}
                                    InputLabelProps={{ shrink: true }}
                                />
                                <TextField
                                    label="Date de fin"
                                    type="date"
                                    name="date_fin"
                                    value={filtres.date_fin}
                                    onChange={handleFilterChange}
                                    InputLabelProps={{ shrink: true }}
                                />
                                <Button variant="contained" onClick={handleFilterSubmit}>
                                    Filtrer
                                </Button>
                                <Button variant="outlined" onClick={handleExport}>
                                    Exporter CSV
                                </Button>
                            </Stack>
                        </CardContent>
                    </Card>

                    <Grid container spacing={3}>
                        {/* Cartes des statistiques */}
                        <Grid item xs={12} sm={6} md={3}>
                            <Card>
                                <CardContent>
                                    <Typography color="textSecondary" gutterBottom>
                                        Total des demandes
                                    </Typography>
                                    <Typography variant="h4">
                                        {statistiques.totalDemandes}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Montant total: {statistiques.montantTotal.toLocaleString()} FCFA
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Moyenne: {statistiques.moyenneMontant.toLocaleString()} FCFA
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <Card>
                                <CardContent>
                                    <Typography color="textSecondary" gutterBottom>
                                        Demandes en attente
                                    </Typography>
                                    <Typography variant="h4">
                                        {statistiques.demandesEnAttente}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Montant: {statistiques.montantEnAttente.toLocaleString()} FCFA
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <Card>
                                <CardContent>
                                    <Typography color="textSecondary" gutterBottom>
                                        Demandes validées
                                    </Typography>
                                    <Typography variant="h4">
                                        {statistiques.demandesValidees}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Montant: {statistiques.montantValide.toLocaleString()} FCFA
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <Card>
                                <CardContent>
                                    <Typography color="textSecondary" gutterBottom>
                                        Demandes rejetées
                                    </Typography>
                                    <Typography variant="h4">
                                        {statistiques.demandesRejetees}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Montant: {statistiques.montantRejete.toLocaleString()} FCFA
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Graphiques */}
                        <Grid item xs={12} md={8}>
                            <Card>
                                <CardContent>
                                    <Box sx={{ height: 400 }}>
                                        <Line options={chartOptions} data={chartData} />
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Card>
                                <CardContent>
                                    <Box sx={{ height: 400 }}>
                                        <Pie data={pieData} />
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
