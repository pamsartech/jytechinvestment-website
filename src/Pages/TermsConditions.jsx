// import React from "react";
// import { LuLockKeyholeOpen } from "react-icons/lu";

// export default function TermsConditions() {
//   return (
//     <div className="min-h-screen bg-white text-gray-800">
     
//       <div className="bg-[#063F34] px-6 py-10 md:py-20">
//         <div className="w-full md:w-1/2 mx-auto px-4 md:px-44 flex gap-4">
//           <div className="h-13 w-13 flex items-center justify-center rounded-2xl bg-white/10 text-white">
//             <LuLockKeyholeOpen size={18} />
//           </div>
//           <div>
//             <h1 className="text-2xl heading md:text-4xl mt-1 font-semibold text-white">
//               Terms & Conditions
//             </h1>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-5xl mx-auto px-6 py-12">
       
//         <h1 className="text-3xl font-semibold mb-2">Terms &amp; Conditions:</h1>

        
//         <p className="text-sm text-gray-500 mb-8">Last updated: 25/12/2025</p>

        
//         <p className="mb-8 leading-relaxed">
//           By accessing or using JY Tech, you agree to these Terms &amp;
//           Conditions. If you do not agree, please do not use the platform.
//         </p>

        
//         <section className="mb-8">
//           <h2 className="text-lg font-semibold mb-3">1. Use of the Platform</h2>
//           <p className="mb-3">
//             JY Tech provides digital tools, services, and insights for
//             informational and operational purposes.
//           </p>
//           <p className="mb-2">You agree to:</p>
//           <ul className="list-disc pl-6 space-y-2">
//             <li>Use the platform lawfully</li>
//             <li>Provide accurate and complete information</li>
//             <li>Not misuse, copy, or exploit platform features</li>
//           </ul>
//         </section>

      
//         <section className="mb-8">
//           <h2 className="text-lg font-semibold mb-3">
//             2. Account Registration
//           </h2>
//           <p className="mb-3">Some features require account creation.</p>
//           <p className="mb-2">You are responsible for:</p>
//           <ul className="list-disc pl-6 space-y-2">
//             <li>Keeping login credentials secure</li>
//             <li>All activities conducted through your account</li>
//           </ul>
//           <p className="mt-3">
//             JY Tech is not liable for losses due to unauthorized access caused
//             by user negligence.
//           </p>
//         </section>

     
//         <section className="mb-8">
//           <h2 className="text-lg font-semibold mb-3">
//             3. Subscriptions &amp; Payments
//           </h2>
//           <ul className="list-disc pl-6 space-y-2">
//             <li>Certain features may require a paid subscription</li>
//             <li>Billing may be monthly or annually</li>
//             <li>Payments are non-refundable unless stated otherwise</li>
//           </ul>
//           <p className="mt-3">
//             JY Tech reserves the right to modify pricing with prior notice.
//           </p>
//         </section>

        
//         <section className="mb-8">
//           <h2 className="text-lg font-semibold mb-3">4. Accuracy Disclaimer</h2>
//           <ul className="list-disc pl-6 space-y-2">
//             <li>
//               Outputs, reports, or insights provided by JY Tech are
//               informational only
//             </li>
//             <li>No guarantees are made regarding outcomes or results</li>
//             <li>Users should independently verify critical decisions</li>
//           </ul>
//         </section>

     
//         <section>
//           <h2 className="text-lg font-semibold mb-3">
//             5. Intellectual Property
//           </h2>
//           <p className="mb-3">
//             All content, designs, tools, branding, and materials belong to JY
//             Tech.
//           </p>
//           <p className="mb-2">You may not:</p>
//           <ul className="list-disc pl-6 space-y-2">
//             <li>Copy or distribute content without permission</li>
//             <li>Use JY Tech branding without authorization</li>
//           </ul>
//         </section>
//       </div>
//     </div>
//   );
// }




import { useEffect, useState } from "react";
import axios from "axios";
import DOMPurIFY from "dompurify";
import { LuLockKeyholeOpen } from "react-icons/lu";

export default function TermsConditions() {
  const [terms, setTerms] = useState("");
  const [loading, setLoading] = useState(true);

   const token = localStorage.getItem("authToken");

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };


  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const res = await axios.get(
          "https://api.emibocquillon.fr/api/content/get",
          authConfig
        );

        setTerms(res.data?.content?.TermsAndConditions || "");
      } catch (error) {
        console.error("Failed to fetch terms & conditions", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTerms();
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-800">
      
      <div className="bg-[#063F34] px-6 py-10 md:py-20">
        <div className="w-full md:w-full justify-center mx-auto md:px-44 flex gap-4">
            <div className="h-13 w-13 flex items-center justify-center rounded-2xl bg-white/10 text-white">
              <LuLockKeyholeOpen size={18} />
            </div>
            <h1 className="text-2xl heading md:text-4xl mt-1 font-semibold text-white">
              Conditions générales 
            </h1>
          </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {loading ? (
          <p className="text-gray-500">Loading terms & conditions...</p>
        ) : (
         <div
  className="prose max-w-none leading-relaxed text-gray-700"
  dangerouslySetInnerHTML={{
    __html: DOMPurIFY.sanitize(terms),
  }}
/>

        )}
      </div>
    </div>
  );
}
