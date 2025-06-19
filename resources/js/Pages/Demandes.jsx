import NavigationHome from '@/Components/NavigationHome'
import { Head, router, useForm } from '@inertiajs/react'
import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Demande = () => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [option,setOption] = useState("")
    const {data,setData,post,processing,errors} = useForm({
        first_name:"",
        last_name:"",
        email:"",
        montant:"",
        numero_compte:"",
        phone:"",
        carte:"",
        mode_paiement:"",
        files: []
    })

    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            toast.error('Veuillez corriger les erreurs dans le formulaire', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    }, [errors]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(files);
        setData(prev => ({...prev, files: files}));
    };

    const handleSubmit = (e)=>{
        e.preventDefault()

        const formData = new FormData();
        formData.append('first_name', data.first_name);
        formData.append('last_name', data.last_name);
        formData.append('email', data.email);
        formData.append('numero_compte', data.numero_compte);
        formData.append('montant', data.montant);
        formData.append('phone', data.phone);
        formData.append('mode_paiement', option);

        data.files.forEach((file, index) => {
            formData.append(`files[${index}]`, file);
        });


        post(route('demandes.store'), {
            forceFormData: true,
            onSuccess: () => {
                setData({
                    first_name: "",
                    last_name: "",
                    email: "",
                    montant: "",
                    phone: "",
                    numero_compte: "",
                    files: []
                });
                setSelectedFiles([]);
                toast.success('🎉 Félicitations ! Votre demande a été envoyée avec succès.', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    className: 'bg-green-500 text-white',
                    bodyClassName: 'font-bold',
                });
                setTimeout(() => {
                    router.visit(route('welcome'))
                }, 1500);
            },
            onError: (errors) => {
                toast.error('Une erreur est survenue lors de l\'envoi de la demande', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        });
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Head title='Demandes' />
            <NavigationHome />
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />

            <div className="max-w-2xl mx-auto p-4 sm:p-6">
                <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800 text-center sm:text-left">Nouvelle Demande CofiPharma</h1>

                <form className="bg-white shadow-md rounded-lg px-4 sm:px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nom">
                            Nom (*)
                        </label>
                        <input
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.first_name ? 'border-red-500' : ''}`}
                            id="nom"
                            type="text"
                            placeholder="Votre nom"
                            onChange={(e)=>{setData(prev => ({...prev, first_name:e.target.value}))}}
                            value={data.first_name}
                        />
                        {errors.first_name && (
                            <p className="text-red-500 text-xs italic mt-1">{errors.first_name}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="prenom">
                            Prénom
                        </label>
                        <input
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.last_name ? 'border-red-500' : ''}`}
                            id="prenom"
                            type="text"
                            placeholder="Votre prénom"
                            onChange={(e)=>{setData(prev => ({...prev, last_name: e.target.value}))}}
                            value={data.last_name}
                        />
                        {errors.last_name && (
                            <p className="text-red-500 text-xs italic mt-1">{errors.last_name}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email (*)
                        </label>
                        <input
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.email ? 'border-red-500' : ''}`}
                            id="email"
                            type="email"
                            placeholder="Votre email"
                            onChange={(e)=>{setData(prev => ({...prev, email:e.target.value}))}}
                            value={data.email}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs italic mt-1">{errors.email}</p>
                        )}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="numero_compte">
                            Numéro de compte (*)
                        </label>
                        <input
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.numero_compte ? 'border-red-500' : ''}`}
                            id="numero_compte"
                            type="text"
                            placeholder="Votre numéro de compte"
                            onChange={(e)=>{setData(prev => ({...prev, numero_compte:e.target.value}))}}
                            value={data.numero_compte}
                            required
                        />
                        {errors.numero_compte && (
                            <p className="text-red-500 text-xs italic mt-1">{errors.numero_compte}</p>
                        )}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="telephone">
                            Téléphone
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="telephone"
                            type="tel"
                            placeholder="Votre numéro de téléphone"
                            onChange={(e)=>{setData(prev => ({...prev, phone:e.target.value}))}}
                            value={data.phone}

                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="montant">
                            Mode de paiement (*)
                        </label>
                        <select name="" id=""
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.montant ? 'border-red-500' : ''}`}
                        value={data.mode_paiement}
                        onChange={(e)=>setData(prev =>({...prev,mode_paiement:e.target.value}))}
                        >
                            <option value="caisse">Caisse</option>
                            <option value="mobile">Mobile monaie</option>
                            <option value="carte">Carte prépayée</option>
                        </select>
                    </div>
                    {data.mode_paiement == "mobile" && <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="telephone">
                           Numéro de téléphone (*)
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="telephone"
                            type="tel"
                            placeholder="Votre numéro de téléphone"
                            onChange={(e)=>{setData(prev => ({...prev, phone:e.target.value}))}}
                            value={data.phone}

                        />
                    </div>}
                    {data.mode_paiement == "carte" && <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="telephone">
                            Numéro de la carte (*)
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="telephone"
                            type="tel"
                            placeholder="Votre numéro de téléphone"
                            onChange={(e)=>{setData(prev => ({...prev, carte:e.target.value}))}}
                            value={data.carte}

                        />
                    </div>}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="montant">
                            Montant (*)
                        </label>
                        <input
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.montant ? 'border-red-500' : ''}`}
                            id="montant"
                            type="number"
                            step="0.01"
                            placeholder="Montant de la demande"
                            onChange={(e)=>{setData(prev => ({...prev, montant:e.target.value}))}}
                            value={data.montant}
                        />
                        {errors.montant && (
                            <p className="text-red-500 text-xs italic mt-1">{errors.montant}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="files">
                            Documents (PDF, Images) (*)
                        </label>
                        <input
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.files ? 'border-red-500' : ''}`}
                            id="files"
                            type="file"
                            multiple
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleFileChange}
                        />
                        {errors.files && (
                            <p className="text-red-500 text-xs italic mt-1">{errors.files}</p>
                        )}
                        {selectedFiles.length > 0 && (
                            <div className="mt-2">
                                <p className="text-sm text-gray-600">Fichiers sélectionnés :</p>
                                <ul className="mt-1 text-sm text-gray-500">
                                    {selectedFiles.map((file, index) => (
                                        <li key={index} className="flex items-center">
                                            <span className="mr-2">•</span>
                                            {file.name} ({(file.size / 1024).toFixed(2)} KB)
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-center sm:justify-between">
                        <button
                            className={`w-full sm:w-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
                            type="submit"
                            disabled={processing}
                        >
                            {processing ? 'Envoi en cours...' : 'Envoyer la demande'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Demande
