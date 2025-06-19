import ResponsableLayout from '@/Layouts/ResponsableLayout'
import { Head, Link, router } from '@inertiajs/react'
import React, { useState, useMemo } from 'react'
import {
    Card,
    CardContent,
    Typography,
    Grid,
    Box,
    TextField,
    Button,
    Stack,
    Paper,
    Divider,
    IconButton,
    Tooltip
} from '@mui/material';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip as ChartTooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import fr from 'date-fns/locale/fr';
import DownloadIcon from '@mui/icons-material/Download';
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';
import VisiteurLayout from '@/Layouts/VisiteurLayout';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    ChartTooltip,
    Legend,
    ArcElement
);

const StatCard = ({ title, value, subtitle, color = 'primary', bg='' }) => (
    <Card elevation={2} sx={{ height: '100%' }} style={{ backgroundColor: bg }}>
        <CardContent>
            <Typography color="textSecondary" gutterBottom variant="subtitle2">
                {title}
            </Typography>
            <Typography variant="h4" component="div" color={color} sx={{ mb: 1 }}>
                {value}
            </Typography>
            {subtitle && (
                <Typography variant="body2" color="textSecondary">
                    {subtitle}
                </Typography>
            )}
        </CardContent>
    </Card>
);

const DashboardVisiteur = ({ statistiques }) => {
    const [filtres, setFiltres] = useState({
        date_debut: statistiques?.filtres.date_debut,
        date_fin: statistiques?.filtres.date_fin
    });

    const handleFilterChange = (name, value) => {
        setFiltres(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFilterSubmit = () => {
        router.get(route('visiteur.dashboard'), filtres, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleExport = () => {
        window.location.href = route('statistiques.export', filtres);
    };

    const chartData = useMemo(() => ({
        labels: statistiques?.demandesParJour.map(item => item.date),
        datasets: [
            {
                label: 'Demandes par jour',
                data: statistiques?.demandesParJour.map(item => item.total),
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.4,
                fill: false,
            },
            {
                label: 'Montant total par jour',
                data: statistiques?.demandesParJour.map(item => item.montant_total),
                borderColor: 'rgb(255, 99, 132)',
                tension: 0.4,
                yAxisID: 'y1',
                fill: false,
            }
        ],
    }), [statistiques]);

    const pieData = useMemo(() => ({
        labels: ['En attente', 'Validées', 'Rejetées', 'Débloquées'],
        datasets: [{
            data: [
                statistiques?.demandesEnAttente,
                statistiques?.demandesValidees,
                statistiques?.demandesRejetees,
                statistiques?.demandesDebloquees
            ],
            backgroundColor: [
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)'
            ],
        }]
    }), [statistiques]);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Évolution des demandes et montants',
                font: {
                    size: 16
                }
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
        <VisiteurLayout header="Tableau de bord">
            <Head title="Tableau de bord" />

            <Paper elevation={0} sx={{ p: 2, mb: 3 }}>
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={2}
                    alignItems={{ xs: 'stretch', sm: 'center' }}
                    justifyContent="space-between"
                >
                    <Typography variant="h6" component="h2">
                        Filtres
                    </Typography>
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={2}
                        width={{ xs: '100%', sm: 'auto' }}
                    >
                        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
                            <DatePicker
                                label="Date de début"
                                value={filtres.date_debut}
                                onChange={(newValue) => handleFilterChange('date_debut', newValue)}
                                slotProps={{ textField: { fullWidth: true } }}
                            />
                            <DatePicker
                                label="Date de fin"
                                value={filtres.date_fin}
                                onChange={(newValue) => handleFilterChange('date_fin', newValue)}
                                slotProps={{ textField: { fullWidth: true } }}
                            />
                        </LocalizationProvider>
                        <Button
                            variant="contained"
                            startIcon={<FilterListIcon />}
                            onClick={handleFilterSubmit}
                            fullWidth
                        >
                            Filtrer
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={handleExport}
                            fullWidth
                        >
                            Exporter
                        </Button>
                    </Stack>
                </Stack>
            </Paper>

            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={4} lg={2.4}>
                    <Link href={route('visiteur.demandes.all')}>
                    <StatCard
                        title="Total des demandes"
                        value={statistiques?.totalDemandes}
                        subtitle={`Montant total: ${statistiques?.montantTotal.toLocaleString()} FCFA`}
                        bg=""
                    /></Link>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={2.4}>
                    <Link href={route('visiteur.demandes.all-en-attente')}>
                    <StatCard
                        title="Demandes en attente"
                        value={statistiques?.demandesEnAttente}
                        subtitle={`Montant: ${statistiques?.montantEnAttente.toLocaleString()} FCFA`}
                        color="warning.main"
                        bg="#FFCD56"
                    /></Link>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={2.4}>
                    <Link href={route('visiteur.demandes.all-acceptees')}>
                    <StatCard
                        title="Demandes validées"
                        value={statistiques?.demandesValidees}
                        subtitle={`Montant: ${statistiques?.montantValide.toLocaleString()} FCFA`}
                        color="success.main"
                        bg='#4bc0c0'
                    />
                    </Link>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={2.4}>
                    <Link href={route('visiteur.demandes.all-debloques')}>
                    <StatCard
                        title="Demandes débloquées"
                        value={statistiques?.demandesDebloquees}
                        subtitle={`Montant: ${statistiques?.montantDebloque.toLocaleString()} FCFA`}
                        color="info.main"
                        bg='#36A2EB'
                    /></Link>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={2.4}>
                    <Link href={route('visiteur.demandes.all-rejetees')}>
                    <StatCard
                        title="Demandes rejetées"
                        value={statistiques?.demandesRejetees}
                        subtitle={`Montant: ${statistiques?.montantRejete.toLocaleString()} FCFA`}
                        color="error.main"
                        bg='#ff6384'
                    />
                    </Link>
                </Grid>
            </Grid>

            <div className="flex gap-4  flex-row">
                <div className="w-full flex-1">
                <Line options={chartOptions} data={chartData} />
                </div>
                <div className="w-full flex-1">
                <Pie data={pieData} />
                </div>
            </div>
        </VisiteurLayout>
    );
};

export default DashboardVisiteur;