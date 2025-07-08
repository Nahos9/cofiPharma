import NavigationHome from '@/Components/NavigationHome'
import React, { useEffect } from 'react'
import { Head, router, useForm } from '@inertiajs/react'
import InputLabel from '@/Components/InputLabel'
import TextInput from '@/Components/TextInput'
import InputError from '@/Components/InputError'
import PrimaryButton from '@/Components/PrimaryButton'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const AvSalaire = ({ auth, flash }) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        numero_compte: '',
        phone: '',
        email: '',
        nom: '',
        prenom: '',
        status: '',
        montant: '',
        fichiers: [],
    })

    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success, {
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
            reset();
            setTimeout(() => {
                router.visit(route('welcome'));
            }, 1500);
        }

        if (flash.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const submit = (e) => {
        e.preventDefault();
        post(route('av_salaire.store'));
    };

    return (
        <div>
            <NavigationHome user={auth?.user} />
            <Head title='demande avance ' />
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
            <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Demande d'Avance sur Salaire</h1>
                <form onSubmit={submit} className='border p-2 shadow-lg'>
                <div className="flex justify-between gap-2 mt-1">
                   <div className='flex-1'>
                        <InputLabel htmlFor="nom" value="Votre nom" />
                        <TextInput
                            id="nom"
                            type="text"
                            name="nom"
                            value={data.nom}
                            className="mt-1 block w-full"
                            onChange={(e) => setData('nom', e.target.value)}

                        />
                        <InputError message={errors.nom} className="mt-2" />
                    </div>
                    <div className='flex-1' >
                        <InputLabel htmlFor="prenom" value="Votre prénom" />
                        <TextInput
                            id="prenom"
                            type="text"
                            name="prenom"
                            value={data.prenom}
                            className="mt-1 block w-full"
                            onChange={(e) => setData('prenom', e.target.value)}

                        />
                        <InputError message={errors.prenom} className="mt-2" />
                    </div>
                </div>
                <div className="flex justify-between gap-2 mt-1">
                   <div className='flex-1'>
                        <InputLabel htmlFor="email" value="Votre email" />
                        <TextInput
                            id="email"
                            type="text"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full"
                            onChange={(e) => setData('email', e.target.value)}

                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>
                    <div className='flex-1' >
                        <InputLabel htmlFor="phone" value="Numéro de téléphone" />
                        <TextInput
                            id="phone"
                            type="text"
                            name="phone"
                            value={data.phone}
                            className="mt-1 block w-full"
                            onChange={(e) => setData('phone', e.target.value)}

                        />
                        <InputError message={errors.phone} className="mt-2" />
                    </div>
                </div>
                <div className="flex justify-between gap-2 mt-1">
                   <div className='flex-1'>
                        <InputLabel htmlFor="numero_compte" value="Numéro de compte" />
                        <TextInput
                            id="numero_compte"
                            type="text"
                            name="numero_compte"
                            value={data.numero_compte}
                            className="mt-1 block w-full"
                            onChange={(e) => setData('numero_compte', e.target.value)}

                        />
                        <InputError message={errors.numero_compte} className="mt-2" />
                    </div>
                    <div className='flex-1' >
                        <InputLabel htmlFor="montant" value="Montant" />
                        <TextInput
                            id="montant"
                            type="text"
                            name="montant"
                            value={data.montant}
                            className="mt-1 block w-full"
                            onChange={(e) => setData('montant', e.target.value)}

                        />
                        <InputError message={errors.montant} className="mt-2" />
                    </div>
                </div>
                <div className="mt-1">
                    <InputLabel htmlFor="fichiers" value="Joindre des fichiers (*)" />
                    <input
                        id="fichiers"
                        type="file"
                        name="fichiers"
                        multiple
                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                        onChange={e => setData('fichiers', e.target.files)}
                    />
                    <InputError message={errors.fichiers} className="mt-2" />
                </div>
                    <div className="flex items-center justify-end mt-4">
                        <PrimaryButton disabled={processing}>
                            Soumettre la demande
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AvSalaire