import React from "react";
import { FaRegFile } from "react-icons/fa";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white text-gray-800">

         {/* Header */}
             <div className="bg-[#063F34] px-6 py-10 md:py-20">
               <div className="w-full md:w-1/2 mx-auto px-4 md:px-44 flex gap-4">
                 <div className="h-13 w-13 flex items-center justify-center rounded-2xl bg-white/10 text-white">
                   <FaRegFile size={18} />
                 </div>
                 <div>
                   <h1 className="text-2xl heading md:text-4xl mt-1 font-semibold text-white">
                     Privacy Policy
                   </h1>
                 </div>
               </div>
             </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Title */}
        <h1 className="text-3xl font-semibold mb-2">Privacy Policy</h1>

        {/* Last Updated */}
        <p className="text-sm text-gray-500 mb-8">
          Last updated: 25/12/2025
        </p>

        {/* Intro */}
        <p className="mb-8 leading-relaxed">
          At jytech, we value your privacy and are committed to protecting your
          personal data. This Privacy Policy explains how we collect, use,
          store, and protect your information when you use our website,
          platform, and services.
        </p>

        {/* Section 1 */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">
            1. Information We Collect
          </h2>
          <p className="mb-3">
            We may collect the following types of information:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Personal Information:</strong> Name, email address, phone
              number, account credentials
            </li>
            <li>
              <strong>Usage Data:</strong> Pages visited, features used, reports
              generated, session duration
            </li>
            <li>
              <strong>Financial &amp; Property Data:</strong> Inputs provided for
              real estate calculations (non-sensitive)
            </li>
            <li>
              <strong>Technical Data:</strong> IP address, browser type, device
              information, cookies
            </li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">
            2. How We Use Your Information
          </h2>
          <p className="mb-3">We use your data to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide and improve jytech services</li>
            <li>
              Generate real estate profitability reports and simulations
            </li>
            <li>Manage subscriptions and user accounts</li>
            <li>
              Communicate updates, support responses, or service-related
              notifications
            </li>
            <li>Improve product performance, usability, and security</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">
            3. Data Sharing &amp; Disclosure
          </h2>
          <p className="mb-3">
            We do not sell or rent your personal data.
          </p>
          <p className="mb-3">We may share data only with:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Trusted service providers (hosting, analytics, payment gateways)
            </li>
            <li>Legal authorities if required by law</li>
            <li>Internal teams for product and customer support purposes</li>
          </ul>
          <p className="mt-3">
            All third parties are required to maintain data confidentiality.
          </p>
        </section>

        {/* Section 4 */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">4. Data Security</h2>
          <p className="mb-3">
            We implement industry-standard security measures to protect your
            data, including:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Secure servers</li>
            <li>Encrypted data transmission</li>
            <li>Controlled access to sensitive information</li>
          </ul>
          <p className="mt-3">
            However, no system is 100% secure, and we cannot guarantee absolute
            security.
          </p>
        </section>

        {/* Section 5 */}
        <section>
          <h2 className="text-lg font-semibold mb-3">
            5. Cookies &amp; Tracking
          </h2>
          <p className="mb-3">Jytech uses cookies to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Enhance user experience</li>
            <li>Analyze platform performance</li>
            <li>Remember preferences</li>
          </ul>
          <p className="mt-3">
            You may disable cookies via your browser settings, but some features
            may be affected.
          </p>
        </section>
      </div>
    </div>
  );
}
