import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Footer() {

  const navigate = useNavigate();

  return (
    <footer className="bg-[#053B33] text-white">
      <div className="mx-auto w-full px-4 lg:px-15 py-16">
        {/* Top Grid */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand / Description */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2">
              {/* <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#053B33] font-bold">
                I
              </div>
              <span className="text-lg font-semibold">ImmoRenta</span> */}
               <img className="flex h-14 w-14 items-center justify-center rounded-full " src="/logo1.jpg" alt="">
            
          </img>
            </div>

            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70">
              The premium real estate profitability simulator for demanding
              investors. Analyze, optimize and succeed in your real estate
              projects.
            </p>

            <ul className="mt-6 space-y-3 text-sm text-white/70">
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-white/60" />
                contact@immorenta.fr
              </li>
              {/* <li className="flex items-center gap-3">
                <FaPhoneAlt className="text-white/60" />
                +33 10 00 00 00
              </li> */}
              <li className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-white/60" />
                Paris, France
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="mb-4 text-sm font-semibold">About</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li>Our mission</li>
              <li>The team</li>
              <li>Careers</li>
              <li>Press</li>
            </ul>
          </div>

          {/* Product */}
          <div>
            <h4 className="mb-4 text-sm font-semibold">Product</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li>Simulator</li>
              <li>Features</li>
              <li>Prices</li>
              <li>API</li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-4 text-sm font-semibold">Legal</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li>Legal notice</li>
              <li onClick={() => navigate("/terms-conditions")} className=" cursor-pointer">Terms & Conditions</li>
              <li onClick={() => navigate("/privacy-policy")} className=" cursor-pointer" >Privacy Policy</li>
              <li>Cookies</li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="my-10 h-px w-full bg-white/20" />

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 text-sm text-white/60 sm:flex-row">
          <p>© 2025 ImmoRenta. All rights reserved.</p>

          <div className="flex items-center gap-4">
            <span>Instagram</span>
            <span>LinkedIn</span>
            <span>X (twitter)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
