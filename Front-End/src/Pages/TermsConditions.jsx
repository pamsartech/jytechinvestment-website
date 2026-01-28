import { useEffect, useState } from "react";
import axios from "axios";
import DOMPurIFY from "dompurify";
import { LuLockKeyholeOpen } from "react-icons/lu";
import { Skeleton } from "@mui/material";
import { BsArrowLeft } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const TermsHeaderSkeleton = () => (
  <div className="bg-[#063F34] px-6 py-10 md:py-20">
    <div className="w-full justify-center mx-auto md:px-44 flex gap-4">
      <Skeleton
        variant="circular"
        width={44}
        height={44}
        sx={{ bgcolor: "rgba(255,255,255,0.2)" }}
      />
      <Skeleton
        variant="text"
        width={260}
        height={36}
        sx={{ bgcolor: "rgba(255,255,255,0.2)" }}
      />
    </div>
  </div>
);

const TermsContentSkeleton = () => (
  <div className="space-y-4">
    <Skeleton variant="text" width="60%" height={32} />
    <Skeleton variant="text" width="30%" />

    {Array.from({ length: 10 }).map((_, i) => (
      <Skeleton key={i} variant="text" width="100%" />
    ))}

    <Skeleton variant="text" width="80%" />
    <Skeleton variant="text" width="90%" />
  </div>
);

export default function TermsConditions() {
  const [terms, setTerms] = useState("");
  const [loading, setLoading] = useState(true);
   const navigate = useNavigate();

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
          authConfig,
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
          <button
            onClick={() => navigate("/")}
            className="text-white  border-white px-3 py-2 md:ml-10 rounded-xl"
          >
            <BsArrowLeft size={20} />
          </button>
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
          <TermsContentSkeleton />
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
