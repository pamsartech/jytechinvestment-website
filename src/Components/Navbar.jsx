import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaBars, FaTimes, FaUserCircle, FaChevronDown } from "react-icons/fa";
import { FiLogOut, FiUser } from "react-icons/fi";
import { useAuth } from "../Context/AuthContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showNav, setShowNav] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  const lastScrollY = useRef(0);
  const dropdownRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const navLinks = [
    { label: "Accueil", path: "/" },
    { label: "Historique ", path: "/history" },
    { label: "Abonnement ", path: "/subscription" },
    { label: "Support", path: "/support" },
  ];

  const handleNavigate = (path) => {
    navigate(path);
    setIsOpen(false);
    setIsProfileOpen(false);
  };

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll hide/show behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

      setScrolled(currentY > 10);

      if (currentY > lastScrollY.current && currentY > 80) {
        setShowNav(false);
      } else {
        setShowNav(true);
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* ============================ Navbar ============================ */}
      <header
        className={`fixed top-0 left-0 z-50 w-full transform transition-all duration-300
          ${showNav ? "translate-y-0" : "-translate-y-full"}
          ${scrolled ? "bg-[#053B33]/95 shadow-lg backdrop-blur" : "bg-[#053B33]"}
        `}
      >
        <nav className="mx-auto flex w-full items-center justify-between px-4 py-4 lg:px-15">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-white">
            <img className="h-14 w-14 md:h-18 md:w-18 rounded-full mx-2" src="/logo1.jpg" alt="Logo" />
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center gap-8 text-lg">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`transition font-medium ${
                      active
                        ? "text-white border-b-2 border-white pb-1"
                        : "text-white/80 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Desktop Profile Dropdown */}
          <div className="relative hidden lg:block" ref={dropdownRef}>
            <button
              onClick={() => setIsProfileOpen((prev) => !prev)}
              className="flex items-center gap-1 text-white hover:text-white/80"
            >
              <FaUserCircle size={26} />
              <FaChevronDown
                size={12}
                className={`transition-transform duration-200 ${
                  isProfileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 top-full mt-2 w-44 rounded-xl bg-white shadow-lg z-50">
                <button
                  onClick={() => handleNavigate("/profile")}
                  className="flex w-full items-center gap-2 px-4 py-3 text-sm hover:bg-gray-100 rounded-lg"
                >
                  <FiUser />
                  Profil
                </button>

                <button
                  onClick={logout}
                  className="flex w-full items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-gray-100 rounded-lg"
                >
                  <FiLogOut />
                   Déconnexion
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="lg:hidden text-white" onClick={() => setIsOpen(true)}>
            <FaBars size={22} />
          </button>
        </nav>
      </header>

      {/* Spacer */}
      <div className="h-20" />

      {/* ============================ Mobile Menu ============================ */}
      {/* ============================ Mobile Menu ============================ */}
<div
  className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ease-in-out
    ${isOpen ? "pointer-events-auto" : "pointer-events-none"}
  `}
>
  {/* Backdrop */}
  <div
    onClick={() => setIsOpen(false)}
    className={`absolute inset-0 bg-black/40 transition-opacity duration-300
      ${isOpen ? "opacity-100" : "opacity-0"}
    `}
  />

  {/* Drawer */}
  <div
    className={`absolute right-0 top-0 h-full w-72 bg-[#053B33] px-6 py-6
      transform transition-transform duration-300 ease-in-out
      ${isOpen ? "translate-x-0" : "translate-x-full"}
    `}
  >
    {/* Close */}
    <div className="mb-8 flex justify-end">
      <button onClick={() => setIsOpen(false)} className="text-white">
        <FaTimes size={22} />
      </button>
    </div>

    {/* Mobile Links */}
    <ul className="flex flex-col gap-6">
      {navLinks.map((link) => {
        const active = isActive(link.path);
        return (
          <li key={link.path}>
            <button
              onClick={() => handleNavigate(link.path)}
              className={`block w-full text-left text-base font-medium ${
                active ? "text-white underline" : "text-white/80"
              }`}
            >
              {link.label}
            </button>
          </li>
        );
      })}
    </ul>

    {/* Mobile Profile Actions */}
    <div className="mt-10 border-t border-white/20 pt-6 space-y-3">
      <button
        onClick={() => handleNavigate("/profile")}
        className="flex w-full items-center gap-2 rounded-lg bg-white/10 px-4 py-3 text-white"
      >
        <FiUser />
        Profil
      </button>

      <button
        onClick={logout}
        className="flex w-full items-center gap-2 rounded-lg bg-white/10 px-4 py-3 text-red-300"
      >
        <FiLogOut />
        Déconnexion
      </button>
    </div>
  </div>
</div>

    </>
  );
}
