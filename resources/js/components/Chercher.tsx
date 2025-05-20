import { Search, MapPin, ChevronDown, Grid3x3, Home, Building, LandPlot, Hotel, X } from 'lucide-react';
import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { router, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';

interface City {
  id: number | string;
  name: string;
  slug: string;
}

interface PropertyType {
  id: string;
  name: string;
  icon: React.ReactNode;
}

const propertyTypes: PropertyType[] = [
  { id: 'all', name: 'Toutes les catégories', icon: <Grid3x3 className="w-4 h-4" /> },
  { id: 'appartement', name: 'Appartements', icon: <Home className="w-4 h-4" /> },
  { id: 'maison', name: 'Maisons', icon: <Home className="w-4 h-4" /> },
  { id: 'terrain', name: 'Terrains', icon: <LandPlot className="w-4 h-4" /> },
  { id: 'bureau', name: 'Bureaux', icon: <Building className="w-4 h-4" /> },
  { id: 'hotel', name: 'Hôtels', icon: <Hotel className="w-4 h-4" /> },
];

interface Post {
  title: string;
  type: string;
  city_slug: string;
  // Ajoutez d'autres propriétés si nécessaire
  [key: string]: unknown;
}

interface SearchBarProps {
  initialFilters?: {
    query?: string;
    category?: string;
    city?: string;
  };
  posts?: {
    data: Post[];
    links: { url: string | null; label: string; active: boolean }[];
  };
}

export default function SearchBar({ initialFilters = {}, posts }: SearchBarProps) {
  // Initialisation des états
  const [searchQuery, setSearchQuery] = useState(initialFilters.query || '');
  const [selectedCategory, setSelectedCategory] = useState(
    propertyTypes.find(type => type.id === (initialFilters.category || 'all')) || propertyTypes[0]
  );
  const [selectedCity, setSelectedCity] = useState(initialFilters.city || '');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const categoryRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);

  // Récupération des données depuis Inertia
  const { cities } = usePage<PageProps>().props;

  // Gestion du clic en dehors des dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setShowCategoryDropdown(false);
      }
      if (cityRef.current && !cityRef.current.contains(event.target as Node)) {
        setShowCityDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Gestion de la recherche
  const handleSearch = () => {
    const filters: Filters = {
      query: searchQuery,
      category: selectedCategory.id !== 'all' ? selectedCategory.id : undefined,
      city: selectedCity || undefined,
    };

    // Si des posts sont fournis, on filtre côté client
    if (posts) {
      const filteredPosts = filterPostsClientSide(posts.data, filters);
      // Gérer l'affichage des résultats filtrés ici
      console.log('Posts filtrés:', filteredPosts);
    } else {
      // Sinon, on fait une requête serveur via Inertia
      router.get('/recherche', filters, {
        preserveState: true,
        replace: true
      });
    }
  };

  // Filtrage côté client
  interface Post {
    title: string;
    type: string;
    city_slug: string;
    // Ajoutez d'autres propriétés si nécessaire
    [key: string]: unknown;
  }

  interface Filters {
    query?: string;
    category?: string;
    city?: string;
  }

  const filterPostsClientSide = (posts: Post[], filters: Filters) => {
    return posts.filter(post => {
      // Filtre par texte
      if (filters.query && !post.title.toLowerCase().includes(filters.query.toLowerCase())) {
        return false;
      }

      // Filtre par catégorie
      if (filters.category && post.type !== filters.category) {
        return false;
      }

      // Filtre par ville
      if (filters.city && post.city_slug !== filters.city) {
        return false;
      }

      return true;
    });
  };

  // Recherche lors de l'appui sur Entrée
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-2 bg-white p-2 rounded-full shadow-sm w-full max-w-5xl mx-auto mt-6">
      {/* Champ de recherche */}
      <div className="flex-1 w-full">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Que recherchez-vous ?"
            className="w-full bg-gray-50 text-gray-800 placeholder:text-gray-400 rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Effacer la recherche"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Sélection de catégorie */}
      <div className="relative w-full md:w-auto" ref={categoryRef}>
        <div
          className="flex items-center justify-between gap-2 bg-gray-50 px-4 py-3 rounded-full cursor-pointer min-w-[200px] hover:bg-gray-100 transition-colors"
          onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
          aria-haspopup="listbox"
          aria-expanded={showCategoryDropdown}
        >
          <div className="flex items-center gap-2">
            {selectedCategory.icon}
            <span className="text-sm font-medium text-gray-800 truncate max-w-[120px]">
              {selectedCategory.name}
            </span>
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
        </div>

        {showCategoryDropdown && (
          <div
            className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 py-1 max-h-60 overflow-y-auto"
            role="listbox"
          >
            {propertyTypes.map((type) => (
              <div
                key={type.id}
                className={`flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer ${selectedCategory.id === type.id ? 'bg-blue-50 text-blue-600' : ''}`}
                onClick={() => {
                  setSelectedCategory(type);
                  setShowCategoryDropdown(false);
                }}
                role="option"
                aria-selected={selectedCategory.id === type.id}
              >
                {type.icon}
                <span className="text-sm">{type.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sélection de ville */}
      <div className="relative w-full md:w-auto" ref={cityRef}>
        <div
          className="flex items-center justify-between gap-2 bg-gray-50 px-4 py-3 rounded-full cursor-pointer min-w-[200px] hover:bg-gray-100 transition-colors"
          onClick={() => setShowCityDropdown(!showCityDropdown)}
          aria-haspopup="listbox"
          aria-expanded={showCityDropdown}
        >
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-800 truncate max-w-[120px]">
              {selectedCity || 'Choisir ville'}
            </span>
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showCityDropdown ? 'rotate-180' : ''}`} />
        </div>

        {showCityDropdown && (
          <div
            className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 py-1 max-h-60 overflow-y-auto"
            role="listbox"
          >
            <div
              className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
              onClick={() => {
                setSelectedCity('');
                setShowCityDropdown(false);
              }}
              role="option"
              aria-selected={!selectedCity}
            >
              <span className="text-sm">Toutes les villes</span>
            </div>
            {(Array.isArray(cities) ? cities : []).map((city: City) => (
              <div
                key={city.id}
                className={`px-4 py-2 hover:bg-gray-50 cursor-pointer ${selectedCity === city.slug ? 'bg-blue-50 text-blue-600' : ''}`}
                onClick={() => {
                  setSelectedCity(city.slug);
                  setShowCityDropdown(false);
                }}
                role="option"
                aria-selected={selectedCity === city.slug}
              >
                <span className="text-sm">{city.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bouton de recherche */}
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-sm font-medium rounded-full flex items-center gap-2 transition w-full md:w-auto justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        onClick={handleSearch}
        aria-label="Lancer la recherche"
      >
        <Search className="w-4 h-4" />
        Rechercher
      </button>
    </div>
  );
}
