import React from "react";
import Navbar from "../Components/Navbar";
import HeroSection from "../Components/HeroSection";
import Cards from "../Components/Cards";
import Footer from "../Components/Footer";
import AnalyseOperation from "../Components/AnalyseOperation";
import { AnalyseOperationProvider } from "../Context/AnalyseOperationContext";
import { LuFileText } from "react-icons/lu";
import { MdOutlineFileDownload } from "react-icons/md";
import { useNavigate } from "react-router-dom";


function Home () {

   const navigate = useNavigate();

    return (
      
        <div>
           {/* <Navbar /> */}
           <HeroSection />
           <Cards />  
           
           <AnalyseOperationProvider>
             <AnalyseOperation />
           </AnalyseOperationProvider>
           

               <div className="flex justify-center gap-4 my-10">
                   <button onClick={() => navigate("/history")} className="px-4 py-2 rounded-xl border">
                     <LuFileText className="inline-block mr-2" /> Voir le rapport 
                   </button>
                   {/* <button className="px-4 py-2 rounded-xl border">
                     <MdOutlineFileDownload className="inline-block mr-2" />
                     Download the PDF
                   </button> */}
                 </div>      
           {/* <Footer /> */}
        </div>
    )
}
export default Home;