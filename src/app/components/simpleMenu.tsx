'use client'; 
import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function SimpleMenu() {
    const [open, setOpen] = useState(false);

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">

                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="text-xl font-bold">
                            Violet
                        </Link>
                    </div>

                    {/* Desktop Links */}
                    <div className="hidden md:flex md:space-x-6 md:items-center">
                        <Link href="/" className="hover:text-blue-600">Lista de agricultores</Link>
                        <Link href="/agricultor" className="hover:text-blue-600">Novo cadastro</Link>
                    </div>

                </div>
            </div>
        </nav>
    );
}
