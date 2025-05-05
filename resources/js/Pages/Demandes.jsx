import NavigationHome from '@/Components/NavigationHome'
import { Head, useForm } from '@inertiajs/react'
import React, { useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Demande = () => {
    const {data,setData,post,processing,errors} = useForm({
        first_name:"",
        last_name:"",
        email:"",
        montant:""
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

    const handleSubmit = (e)=>{
        e.preventDefault()
        post(route('demandes.store'), {
            onSuccess: () => {
                setData({
                    first_name: "",
                    last_name: "",
                    email: "",
                    montant: ""
                });
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
                            Nom
                        </label>
                        <input
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.first_name ? 'border-red-500' : ''}`}
                            id="nom"
                            type="text"
                            placeholder="Votre nom"
                            onChange={(e)=>{setData('first_name', e.target.value)}}
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
                            onChange={(e)=>{setData('last_name', e.target.value)}}
                            value={data.last_name}
                        />
                        {errors.last_name && (
                            <p className="text-red-500 text-xs italic mt-1">{errors.last_name}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.email ? 'border-red-500' : ''}`}
                            id="email"
                            type="email"
                            placeholder="Votre email"
                            onChange={(e)=>{setData('email', e.target.value)}}
                            value={data.email}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs italic mt-1">{errors.email}</p>
                        )}
                    </div>

                    {/* <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="telephone">
                            Téléphone
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="telephone"
                            type="tel"
                            placeholder="Votre numéro de téléphone"
                            onChange={(e)=>{setData({first_name:e.target.value})}}

                        />
                    </div> */}

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="montant">
                            Montant
                        </label>
                        <input
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.montant ? 'border-red-500' : ''}`}
                            id="montant"
                            type="number"
                            step="0.01"
                            placeholder="Montant de la demande"
                            onChange={(e)=>{setData('montant', e.target.value)}}
                            value={data.montant}
                        />
                        {errors.montant && (
                            <p className="text-red-500 text-xs italic mt-1">{errors.montant}</p>
                        )}
                    </div>

                    {/* <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">
                            Message
                        </label>
                        <textarea
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="message"
                            rows="4"
                            placeholder="Décrivez votre demande..."
                        ></textarea>
                    </div> */}

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
