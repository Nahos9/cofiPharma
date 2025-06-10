import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff, Mail, Lock, LoaderPinwheel } from 'lucide-react';
import { useState } from 'react';

import "./Login.css"
export default function Login({ status, canResetPassword, firstLogin }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onSuccess: () => {
                if (firstLogin) {
                    window.location.href = route('password.change');
                }
            },
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="h-screen  flex items-center justify-center">
            <div className="flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-2xl">
                <div className="bg-red-600 text-white p-8 md:w-1/2 flex flex-col items-center justify-center">
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center mb-6">
                            <i className="fas fa-heartbeat text-4xl mr-3 animate-pulse-slow"></i>
                            <h1 className="text-3xl font-bold">Cofi'Pharma</h1>
                        </div>
                        <p className="text-xl mb-2">La plate-forme idéale</p>
                        <p className="opacity-90"></p>
                    </div>

                    <div className="relative w-full max-w-xs">
                        <img src="/img/cofina.png" alt="Médecin" className="w-full h-auto rounded-lg shadow-lg"/>
                        <div className="absolute -bottom-4 -right-4 bg-white text-alldoc p-3 rounded-full shadow-lg">
                            <i className="fas fa-calendar-check text-2xl"></i>
                        </div>
                    </div>

                    <div className="mt-12 text-center">
                        <p className="text-sm opacity-80">Pas encore inscrit ?</p>
                        <button id="showRegister" className="mt-2 px-6 py-2 text-red-600 bg-white text-alldoc rounded-full font-medium hover:bg-gray-100 transition duration-300">
                            Créer un compte
                        </button>
                    </div>
                </div>
                <div className="bg-white p-8 md:w-1/2 flex flex-col justify-center">
                    <form onSubmit={submit}>
                    <div id="loginForm">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Connectez-vous</h2>
                        <p className="text-gray-600 mb-8">Accédez à votre espace personnel</p>

                        <div className="space-y-4">
                            <div>
                                <label for="email" className="block text-sm font-medium text-gray-700 mb-1">Adresse email</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0  left-0 pl-3 flex items-center pointer-events-none">
                                        {/* <i className="fas fa-envelope text-gray-400"></i> */}
                                        <Mail className='text-gray-400' />
                                    </div>
                                    <input type="email" id="email" className="pl-10 w-full px-1 py-3 rounded-lg border border-gray-300 focus:border-alldoc input-focus transition duration-300" placeholder="votre@email.com"
                                    onChange={(e) => setData('email', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label for="password" className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        {/* <i className="fas fa-lock text-gray-400"></i> */}
                                        <Lock className='text-gray-400' />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-alldoc input-focus transition duration-300"
                                        placeholder="••••••••"
                                        onChange={(e) => setData('password', e.target.value)}
                                    />
                                    <button
                                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                    >
                                        {showPassword ? <EyeOff /> : <Eye />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input id="remember" type="checkbox" className="h-4 w-4 text-alldoc focus:ring-alldoc border-gray-300 rounded" />
                                    <label for="remember" className="ml-2 block text-sm text-gray-700">Se souvenir de moi</label>
                                </div>
                                <a href="#" className="text-sm text-alldoc hover:underline">Mot de passe oublié ?</a>
                            </div>

                            <button type="submit" id="loginBtn" className="w-full bg-alldoc bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition duration-300 flex items-center justify-center">
                                <span id="loginText">Se connecter</span>
                                <span id="loginSpinner" className="hidden ml-2">
                                    {/* <i className="fas fa-spinner fa-spin"></i> */}
                                    <LoaderPinwheel />
                                </span>
                            </button>

                            {/* <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">Ou continuez avec</span>
                                </div>
                            </div> */}

                            {/* <div className="grid grid-cols-2 gap-4">
                                <button type="button" className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-300">
                                    <i className="fab fa-google text-red-500 mr-2"></i>
                                    <span>Google</span>
                                </button>
                                <button type="button" className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-300">
                                    <i className="fab fa-facebook-f text-red-600 mr-2"></i>
                                    <span>Facebook</span>
                                </button>
                            </div> */}
                        </div>
                    </div>
                    </form>

                    <div id="registerForm" className="hidden">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Créer un compte</h2>
                        <p className="text-gray-600 mb-8">Rejoignez notre communauté médicale</p>

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label for="firstName" className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                                    <input type="text" id="firstName" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-alldoc input-focus transition duration-300" placeholder="Votre prénom" />
                                </div>
                                <div>
                                    <label for="lastName" className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                                    <input type="text" id="lastName" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-alldoc input-focus transition duration-300" placeholder="Votre nom" />
                                </div>
                            </div>

                            <div>
                                <label for="registerEmail" className="block text-sm font-medium text-gray-700 mb-1">Adresse email</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <i className="fas fa-envelope text-gray-400"></i>
                                    </div>
                                    <input type="email" id="registerEmail" className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-alldoc input-focus transition duration-300" placeholder="votre@email.com" />
                                </div>
                            </div>

                            <div>
                                <label for="registerPassword" className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <i className="fas fa-lock text-gray-400"></i>
                                    </div>
                                    <input type="password" id="registerPassword" className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-alldoc input-focus transition duration-300" placeholder="••••••••" />
                                </div>
                                <p className="mt-1 text-xs text-gray-500">8 caractères minimum avec au moins 1 chiffre</p>
                            </div>

                            <div>
                                <label for="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <i className="fas fa-lock text-gray-400"></i>
                                    </div>
                                    <input type="password" id="confirmPassword" className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-alldoc input-focus transition duration-300" placeholder="••••••••" />
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input id="terms" type="checkbox" className="h-4 w-4 text-alldoc focus:ring-alldoc border-gray-300 rounded" />
                                </div>
                                <label for="terms" className="ml-2 block text-sm text-gray-700">
                                    J'accepte les <a href="#" className="text-alldoc hover:underline">conditions d'utilisation</a> et la <a href="#" className="text-alldoc hover:underline">politique de confidentialité</a>
                                </label>
                            </div>

                            <button type="button" id="registerBtn" className="w-full bg-alldoc text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition duration-300 flex items-center justify-center">
                                <span id="registerText">S'inscrire</span>
                                <span id="registerSpinner" className="hidden ml-2">
                                    <i className="fas fa-spinner fa-spin"></i>
                                </span>
                            </button>

                            <div className="text-center mt-4">
                                <button id="showLogin" className="text-alldoc hover:underline">Déjà un compte ? Se connecter</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
