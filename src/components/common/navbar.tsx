'use client'
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Icon from "@/components/assests/icons"

export default function Navbar() {
  const [cartCount, setCartCount] = useState(1) //eslint-disable-line
  

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-200 fixed top-0 left-0 right-0 z-50 bg-white">
      {/* Logo */}
      <Link href="/" className="flex-none w-14 text-xl font-bold ml-4">
        LOGO
      </Link>

      {/* Menu */}
      <div className="flex-initial w-1/2">
        <ul className="flex space-x-4 text-sm font-medium">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/apparel">Apparel</Link>
          </li>
          <li>
            <Link href="/accessories">Accessories</Link>
          </li>
          <li>
            <Link href="/digital">Digital</Link>
          </li>
        </ul>
      </div>

      {/* Search */}
      <div className="flex-initial w-64">
        <div className="relative flex items-center">
          <Input
            type="search"
            placeholder="Search for products..."
            className="pr-10"
          />
          <Icon
            name="search"
            size={20}
            className="absolute right-3 text-gray-400"
          />
        </div>
      </div>

      {/* Cart + User icons */}
      <div className="flex-none w-14 mr-5">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" className="relative p-2">
          <Icon name="shoppingBag" size={24} />
          {cartCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 rounded-full"
            >
              {cartCount}
            </Badge>
          )}
        </Button>

        <Button variant="ghost" className="p-2">
          <Icon name="user" size={24} />
        </Button>
      </div>
      </div>
    </nav>
  )
}
