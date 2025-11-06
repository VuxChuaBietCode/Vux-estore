import React from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBagIcon, ShoppingCartIcon } from 'lucide-react'
import { useResolvedPath } from 'react-router-dom'
import ThemeSelector from './ThemeSelector'
import { useProductStore } from '../store/useProductStore'



const Navbar = () => {
    const {pathname} = useResolvedPath()
    const isHomePage = pathname === "/"

    const {products} = useProductStore();



  return (
    <div className="bg-base-100/10 backdrop-blur-lg border-b border-base-content/10 sticky top-0 z-50"
    >
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3">
            <div className="flex items-center gap-2">
                    <Link to="/" className="hover:opacity-80 transition-opacity">
                <div className="flex items-center gap-2">
                    <ShoppingCartIcon className="size-9 text-primary" />
                    <span
                    className="font-semibold font-mono tracking-widest text-2xl
                    bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
                    >
                    VUX e-STORE
                    </span>
                </div>
                </Link>
            </div>
        {/*RIGHT SECTION*/ }
            <div className="flex items-center gap-4">
                <ThemeSelector />
                {isHomePage && (
                    <div className="indicator">
                        <div className="p-2 rounded-full hover:bg-base-200 trasition-colors">
                            <ShoppingBagIcon className="size-5" />
                            <span className="badge badge-sm badge-primary indicator-item">
                                {products.length}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  )
}

export default Navbar