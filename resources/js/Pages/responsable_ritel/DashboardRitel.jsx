import ResponsableLayout from '@/Layouts/ResponsableLayout'
import { Head, router } from '@inertiajs/react'
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

const StatCard = ({ title, value, subtitle, color = 'primary' }) => (
    <Card elevation={2} sx={{ height: '100%' }}>
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

const DashboardRitel = ({ statistiques }) => {
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
        router.get(route('responsable_ritel.dashboard'), filtres, {
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
        <ResponsableLayout header="Tableau de bord">
            <Head title="Tableau de bord" />

            <Paper elevation={0} sx={{ p: 2, mb: 3 }}>
                <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                    <Typography variant="h6" component="h2">
                        Filtres
                    </Typography>
                    <Stack direction="row" spacing={5}>
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
                            sx={{ minWidth: '100px', whiteSpace: 'nowrap' }}
                        >
                            Filtrer
                        </Button>
                        <Button
                            variant="outlined"
                            // startIcon={<DownloadIcon />}
                            onClick={handleExport}
                            sx={{ minWidth: '100px', whiteSpace: 'nowrap' }}
                        >
                            Exporter
                        </Button>
                    </Stack>
                </Stack>
            </Paper>

           <div className="flex justify-between gap-1">
              <div className="flex-1">
              <StatCard
                        title="Total des demandes"
                        value={statistiques?.totalDemandes}
                        subtitle={`Montant total: ${statistiques?.montantTotal.toLocaleString()} FCFA`}
                    />
              </div>
              <div className="flex-1">
              <StatCard
                        title="Demandes en attente"
                        value={statistiques?.demandesEnAttente}
                        subtitle={`Montant: ${statistiques?.montantEnAttente.toLocaleString()} FCFA`}
                        color="warning.main"
                    />
              </div>
              <div className="flex-1">
              <StatCard
                        title="Demandes validées"
                        value={statistiques?.demandesValidees}
                        subtitle={`Montant: ${statistiques?.montantValide.toLocaleString()} FCFA`}
                        color="success.main"
                    />
              </div>
              <div className="flex-1">
              <StatCard
                        title="Demandes rejetées"
                        value={statistiques?.demandesRejetees}
                        subtitle={`Montant: ${statistiques?.montantRejete.toLocaleString()} FCFA`}
                        color="error.main"
                    />
              </div>
           </div>
           <div className="card">
            <CardContent>
                <Box sx={{ height: 400 }}>
                    <Line options={chartOptions} data={chartData} />
                </Box>
            </CardContent>
           </div>
           <div className="card">
            <CardContent>
                <Box sx={{ height: 400 }}>
                    <Pie data={pieData} />
                </Box>
            </CardContent>
           </div>
        </ResponsableLayout>
    );
};

export default DashboardRitel;