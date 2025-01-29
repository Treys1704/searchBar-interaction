import { useState, useEffect } from 'react';
import { Sun, Moon, Search, X, User, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Types pour les données
type Status = 'In use' | 'Maintenance' | 'Off';
//type ItemType = 'Client' | 'Vehicle';

interface Client {
    id: number;
    type: 'Client';
    name: string;
    location: string;
    avatar: string;
}

interface Vehicle {
    id: string;
    type: 'Vehicle';
    name: string;
    status: Status;
    driver?: string;
    time?: string;
}

// Données de test
const testData: (Client | Vehicle)[] = [
    {
        id: 1,
        type: 'Client',
        name: 'Tresor Manock',
        location: 'Akwa',
        avatar: 'https://cdn.jsdelivr.net/gh/alohe/memojis@master/png/memo_1.png',
    },
    {
        id: 2,
        type: 'Client',
        name: 'Mbagna Johan',
        location: 'Akwa',
        avatar: 'https://cdn.jsdelivr.net/gh/alohe/memojis@master/png/memo_9.png',
    },
    {
        id: 3,
        type: 'Client',
        name: 'Rui Silvestre',
        location: 'Bonapriso',
        avatar: 'https://cdn.jsdelivr.net/gh/alohe/memojis@master/png/memo_16.png',
    },
    {
        id: 'truck-237',
        type: 'Vehicle',
        name: 'Truck #237',
        status: 'In use',
        driver: 'Tresor Manock',
        time: '05h/08h',
    },
    {
        id: 'cargo-098',
        type: 'Vehicle',
        name: 'CargoNgola #098',
        status: 'Maintenance',
    },
    {
        id: 'rui-truck',
        type: 'Vehicle',
        name: 'Rui Silvestre',
        status: 'Off',
        driver: 'John doe',
        time: '08h/08h',
    },
];

function App() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState<'Client' | 'Vehicle' | null>(null);
    const [filteredResults, setFilteredResults] = useState<(Client | Vehicle)[]>(testData);

    // Gérer les raccourcis clavier
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setIsSearchOpen(true);
            }
            if (e.key === 'Escape' && isSearchOpen) {
                setIsSearchOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isSearchOpen]);

    // Filtrer les résultats
    useEffect(() => {
        if (!searchQuery) {
            setFilteredResults(testData);
            return;
        }

        const query = searchQuery.toLowerCase();
        const filtered = testData.filter(item => {
            if (selectedType && item.type !== selectedType) return false;

            if (item.type === 'Client') {
                return item.name.toLowerCase().includes(query) ||
                    item.location.toLowerCase().includes(query);
            } else {
                return item.name.toLowerCase().includes(query) ||
                    item.driver?.toLowerCase().includes(query);
            }
        });

        setFilteredResults(filtered);
    }, [searchQuery, selectedType]);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    const highlightText = (text: string, query: string) => {
        if (!query) return text;

        const parts = text.split(new RegExp(`(${query})`, 'gi'));
        return parts.map((part, index) =>
            part.toLowerCase() === query.toLowerCase() ?
                <span key={index} className="bg-blue-400 text-white">{part}</span> :
                part
        );
    };

    const getStatusColor = (status: Status) => {
        switch (status) {
            case 'In use': return 'bg-green-100 text-green-800';
            case 'Maintenance': return 'bg-yellow-100 text-yellow-800';
            case 'Off': return 'bg-red-100 text-red-800';
        }
    };

    const clients = filteredResults.filter(item => item.type === 'Client') as Client[];
    const vehicles = filteredResults.filter(item => item.type === 'Vehicle') as Vehicle[];

    return (
        <main className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
            {/* Header avec barre de recherche et toggle theme */}
            <div className={`${isSearchOpen ? 'blur-sm' : ''} transition-all duration-300`}>
                <header className={`p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg transition-colors duration-300`}>
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className={`flex items-center px-4 py-2 rounded-lg ${
                                isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700'
                            } hover:bg-opacity-80 transition-all duration-300 w-64`}
                        >
                            <Search className="w-5 h-5 mr-2" />
                            <span className="text-sm">Search here...</span>
                            <span className="ml-auto text-xs text-gray-500">⌘ K</span>
                        </button>

                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={toggleDarkMode}
                            className={`p-2 rounded-full ${
                                isDarkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100 text-gray-700'
                            }`}
                        >
                            <motion.div
                                initial={false}
                                animate={{ rotate: isDarkMode ? 360 : 0 }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                            >
                                {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                            </motion.div>
                        </motion.button>
                    </div>
                </header>
            </div>

            {/* Modal de recherche */}
            <AnimatePresence>
                {isSearchOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSearchOpen(false)}
                            className="fixed inset-0 bg-gray-900/20 bg-opacity-50 backdrop-blur-sm z-40"
                        />
                        <div className="fixed inset-x-0 top-20 flex flex-col items-center z-50 space-y-4">
                            {/* Bloc de recherche */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                                transition={{ duration: 0.2 }}
                                className="w-full max-w-2xl"
                            >
                                <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-2xl overflow-hidden`}>
                                    {/* En-tête de la modale */}
                                    <div className={`p-4 border-b border-gray-200 ${isDarkMode && 'border-gray-700'}`}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3 flex-1">
                                                <Search className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                                <input
                                                    type="text"
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    placeholder="Search..."
                                                    className={`flex-1 bg-transparent border-none outline-none ${
                                                        isDarkMode ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'
                                                    }`}
                                                    autoFocus
                                                />
                                            </div>
                                            <button
                                                onClick={() => setIsSearchOpen(false)}
                                                className={`p-1 rounded-md ${
                                                    isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                                                } transition-colors`}
                                            >
                                                <X className={`w-5 h-5 ${isDarkMode && 'text-gray-100'}`} />
                                            </button>
                                        </div>

                                        {/* Filtres */}
                                        <div className="flex gap-2 mt-4">
                                            <button
                                                onClick={() => setSelectedType(selectedType === 'Client' ? null : 'Client')}
                                                className={`px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm transition-colors ${
                                                    selectedType === 'Client'
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : isDarkMode
                                                            ? 'bg-gray-700 text-gray-200'
                                                            : 'bg-gray-100 text-gray-700'
                                                }`}
                                            >
                                                <User size={16} />
                                                Client
                                            </button>
                                            <button
                                                onClick={() => setSelectedType(selectedType === 'Vehicle' ? null : 'Vehicle')}
                                                className={`px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm transition-colors ${
                                                    selectedType === 'Vehicle'
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : isDarkMode
                                                            ? 'bg-gray-700 text-gray-200'
                                                            : 'bg-gray-100 text-gray-700'
                                                }`}
                                            >
                                                <Truck size={16} />
                                                Vehicle
                                            </button>
                                        </div>
                                    </div>

                                    {/* Pied de la modale */}
                                    <div className={`px-4 py-3 ${
                                        isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'
                                    }`}>
                                        <div className={`flex items-center justify-between text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            <div className="flex gap-2">
                                                <span>↑↓</span>
                                                <span>pour naviguer</span>
                                            </div>
                                            <div className="flex justify-between items-center gap-2">
                                                <span className={`bg-gray-400/20 px-1 pb-0.5 text-center rounded`}>esc</span>
                                                <span className="pb-0.5">pour fermer</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Bloc des résultats */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.2, delay: 0.1 }}
                                className="w-full max-w-2xl"
                            >
                                <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl overflow-hidden`}>
                                    {filteredResults.length === 0 ? (
                                        <div className="p-8 text-center">
                                            <p className={`text-lg font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                                Aucun Resultat
                                            </p>
                                        </div>
                                    ) : (
                                        <>
                                            {/* Section Clients */}
                                            {clients.length > 0 && (!selectedType || selectedType === 'Client') && (
                                                <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                                    <div className="flex items-center justify-start mb-4 space-x-2">
                                                        <h2 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                                            Client
                                                        </h2>
                                                        <span className="px-1.5 bg-gray-100 text-gray-600 rounded text-sm">
                              {clients.length}
                            </span>
                                                    </div>
                                                    <div className="space-y-2">
                                                        {clients.map((client) => (
                                                            <motion.div
                                                                key={client.id}
                                                                initial={{ opacity: 0, x: -10 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                exit={{ opacity: 0, x: -10 }}
                                                                className={`p-2 rounded-lg ${
                                                                    isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                                                                } cursor-pointer`}
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    <img
                                                                        src={client.avatar}
                                                                        alt={client.name}
                                                                        className={`w-8 h-8 rounded-full ${isDarkMode ? 'bg-white' : 'bg-gray-200'}`}
                                                                    />
                                                                    <div>
                                                                        <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                                                            {highlightText(client.name, searchQuery)}
                                                                        </p>
                                                                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{highlightText(client.location, searchQuery)}</p>
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Section Vehicles */}
                                            {vehicles.length > 0 && (!selectedType || selectedType === 'Vehicle') && (
                                                <div className="p-4">
                                                    <div className="flex items-center justify-start mb-4 space-x-2">
                                                        <h2 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                                            Cars
                                                        </h2>
                                                        <span className="px-1.5 bg-gray-100 text-gray-600 rounded text-sm">
                              {vehicles.length}
                            </span>
                                                    </div>
                                                    <div className="space-y-2">
                                                        {vehicles.map((vehicle) => (
                                                            <motion.div
                                                                key={vehicle.id}
                                                                initial={{ opacity: 0, x: -10 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                exit={{ opacity: 0, x: -10 }}
                                                                className={`p-2 rounded-lg ${
                                                                    isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                                                                } cursor-pointer`}
                                                            >
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex items-center gap-3">
                                                                        <Truck className={`w-5 h-5 ${isDarkMode && "text-gray-300"}`} />
                                                                        <div>
                                                                            <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                                                                {highlightText(vehicle.name, searchQuery)}
                                                                            </p>
                                                                            {vehicle.driver && (
                                                                                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                                                    Driven by {highlightText(vehicle.driver, searchQuery)}
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(vehicle.status)}`}>
                                    {vehicle.status}
                                  </span>
                                                                </div>
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>
        </main>
    );
}

export default App;
