import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Lock, Calendar } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';

const Home = () => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    return (
        <section className="flex flex-col items-center justify-center py-16">
            {/* Hero Section */}
            <div className="mb-16 text-center">
                <div className="mb-6 flex justify-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-black shadow-lg">
                        <Clock className="h-10 w-10 text-white" />
                    </div>
                </div>
                <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl">Time Capsule</h1>
                <p className="mx-auto max-w-md text-lg text-gray-600">
                    Preserve memories, messages, and moments for your future self or loved ones. Unlock them on a
                    special date.
                </p>
            </div>

            {/* CTA Buttons */}
            <div className="mb-16 flex flex-col gap-4 sm:flex-row">
                {isAuthenticated ? (
                    <Link
                        to="/capsules"
                        className="transform rounded-lg bg-black px-8 py-3 font-bolder text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                    >
                        Dashboard
                    </Link>
                ) : (
                    <>
                        <Link
                            to="/login"
                            className="transform rounded-lg bg-black px-8 py-3 font-bold text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                        >
                            Login
                        </Link>
                        <Link
                            to="/sign_up"
                            className="transform rounded-lg border-2 border-black bg-white px-8 py-3 font-bold text-black shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                        >
                            Create Account
                        </Link>
                    </>
                )}
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
                <div className="flex flex-col items-center text-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                        <Lock className="h-6 w-6 text-black" />
                    </div>
                    <h3 className="mb-2 font-semibold">Secure Storage</h3>
                    <p className="text-sm text-gray-600">Your capsules are safely stored until the unlock date</p>
                </div>
                <div className="flex flex-col items-center text-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                        <Calendar className="h-6 w-6 text-black" />
                    </div>
                    <h3 className="mb-2 font-semibold">Schedule Unlock</h3>
                    <p className="text-sm text-gray-600">Choose any date in the future to unlock your capsule</p>
                </div>
                <div className="flex flex-col items-center text-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                        <Clock className="h-6 w-6 text-black" />
                    </div>
                    <h3 className="mb-2 font-semibold">Time Travel</h3>
                    <p className="text-sm text-gray-600">Send messages across time to your future self</p>
                </div>
            </div>
        </section>
    );
};

export default Home;
