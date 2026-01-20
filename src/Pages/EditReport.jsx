import { useMemo, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaHome,
  FaReceipt,
  FaPlus,
  FaBuilding,
  FaRegTrashAlt,
} from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { LuFileText } from "react-icons/lu";
import { AiOutlineBank } from "react-icons/ai";

/* ===========================
   MAIN COMPONENT
   =========================== */

export default function EditReport() {
  const navigate = useNavigate();
  const { id } = useParams();

  const token = localStorage.getItem("authToken");

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    if (!id) return;

    const fetchProject = async () => {
      try {
        const res = await axios.get(
          `https://api.emibocquillon.fr/api/project/getproject/${id}`,
          authConfig
        );

        const project = res.data.project;

        /* ===========================
         BASIC INFO
      =========================== */
        setProjectName(project.name || "");
        setProjectAddress(project.address || "");

        /* ===========================
         PURCHASE
      =========================== */
        setPurchase({
          faiPrice: project.purchase?.faiPrice?.toString() || "",
          agencyFees: project.purchase?.agencyFees?.toString() || "",
        });

        /* ===========================
         ACQUISITION
         (percentage not returned, keep empty)
      =========================== */
        setAcquisition({
          acquisitionPercentage:
            project.purchase?.acquisitionCostPercentage?.toString() || "",
        });

        /* ===========================
         LOTS
      =========================== */
        if (project.lots?.length) {
          setLots(
            project.lots.map((lot, index) => ({
              id: Date.now() + index,
              name: lot.name || `Lot ${index + 1}`,
              resale: lot.resalePrice?.toString() || "",
              area: lot.area?.toString() || "",
              vat: lot.vatType || "Exonéré de TVA",
              balance: lot.balance?.toString() || "",
            }))
          );
        }

        /* ===========================
         EXPENSES
      =========================== */
        if (project.expenses?.length) {
          setExpenses(
            project.expenses.map((e, index) => ({
              id: Date.now() + index,
              label: e.label || "",
              price: e.priceExclTax?.toString() || "",
              vatRate: e.vatRate?.toString() || "",
            }))
          );
        }

        /* ===========================
         FINANCING
      =========================== */
        if (project.financing) {
          setFinancing({
            applicationFee: project.financing.applicationFee?.toString() || "",
            downPaymentRate:
              project.financing.contributionPercentage?.toString() || "",
            loanInterestRate: project.financing.interestRate?.toString() || "",
            loanDuration: project.financing.durationMonths?.toString() || "",
            commissionRate: project.financing.commissionRate?.toString() || "",
            commissionDuration:
              project.financing.commissionDurationMonths?.toString() || "",
            mortgageRate: project.financing.montageRate?.toString() || "",
            downPaymentAuto: "",
            loanInterest: "",
            commitmentFees: "",
            mortgageFees: "",
          });
        }
      } catch (err) {
        console.error("FETCH PROJECT ERROR:", err);
        toast.error("Unable to load project data");
      }
    };

    fetchProject();
  }, [id]);

  // submit state
  const [submitting, setSubmitting] = useState(false);
  const [draftSaving, setDraftSaving] = useState(false);
  const [apiError, setApiError] = useState(null);
  const toNumber = (v) => (v === "" || v === null ? 0 : Number(v));

  function formatIndianNumber(value) {
    if (value === null || value === undefined || value === "") return "";

    value = value.toString().replace(/,/g, "");

    const num = Number(value);
    if (isNaN(num)) return "";

    return num.toLocaleString("en-IN");
  }

  // name
  const [projectName, setProjectName] = useState("");

  // address
  const [projectAddress, setProjectAddress] = useState("");

  /* ===========================
     1. PURCHASE
     =========================== */
  const [purchase, setPurchase] = useState({
    faiPrice: "",
    agencyFees: "",
  });

  const totalPurchase = useMemo(() => {
    return Number(purchase.faiPrice || 0) + Number(purchase.agencyFees || 0);
  }, [purchase]);

  /* ===========================
     2. ACQUISITION COST
     =========================== */
  const [acquisition, setAcquisition] = useState({
    acquisitionCost: "",
    notaryFees: "",
    acquisitionPercentage: "",
  });

  // Notary fees = FAI price x Percentage / 100
  const notaryFeesAuto = useMemo(() => {
    const fai = Number(purchase.faiPrice || 0);
    const pct = Number(acquisition.acquisitionPercentage || 0);
    return ((fai * pct) / 100).toFixed(0);
  }, [purchase.faiPrice, acquisition.acquisitionPercentage]);

  //Total Acquisition Cost = FAI price + Notary fees
  const acquisitionCostAuto = useMemo(() => {
    const fai = Number(purchase.faiPrice || 0);
    const notary = Number(notaryFeesAuto || 0);
    return (fai + notary).toFixed(0);
  }, [purchase.faiPrice, notaryFeesAuto]);

  /* ===========================
     3. LOTS
     =========================== */
  function createLot(id) {
    return {
      id,
      name: "",
      resale: "",
      area: "",
      price: "",
      vat: "",
      balance: "",
    };
  }

  const [lots, setLots] = useState([createLot(1), createLot(2)]);

  const addLot = () => {
    setLots((prev) => [...prev, createLot(Date.now())]);
  };

  const updateLot = (id, field, value) => {
    setLots((prev) =>
      prev.map((lot) => (lot.id === id ? { ...lot, [field]: value } : lot))
    );
  };

  const removeLot = (id) => {
    setLots((prev) => prev.filter((lot) => lot.id !== id));
  };

  const totalResale = useMemo(() => {
    return lots.reduce((sum, lot) => sum + Number(lot.resale || 0), 0);
  }, [lots]);

  const lotsWithTotals = useMemo(() => {
    return lots.map((lot) => {
      const resale = Number(lot.resale || 0);
      const area = Number(lot.area || 0);

      const pricePerM2 = area > 0 ? Number((resale / area).toFixed(0)) : "";

      const vatRate = lot.vat === "20%" ? 20 : 0;
      const vatAmount = (resale * vatRate) / 100;

      return {
        ...lot,
        pricePerM2,
        vatAmount,
        totalWithVat: resale + vatAmount,
      };
    });
  }, [lots]);

  /* ===========================
     4. EXPENSES (UNCHANGED)
     =========================== */
  const [expenses, setExpenses] = useState([
    { id: 1, label: "", price: "", vatRate: "" },
    { id: 2, label: "", price: "", vatRate: "" },
  ]);

  const updateExpense = (id, field, value) => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    );
  };

  const removeExpense = (id) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  // const totalExpenseCost = useMemo(() => {
  //   const total = expenses.reduce((sum, e) => {
  //     const price = Number(e.price || 0);
  //     const vat = (price * Number(e.vatRate || 0)) / 100;
  //     return sum + price + vat;
  //   }, 0);

  //   return Number(total.toFixed(0)); 
  // }, [expenses]);
  const totalExpenseCost = useMemo(() => {
  const total = expenses.reduce((sum, e) => {
    // Force whole numbers only
    const price = Math.floor(Number(e.price || 0));
    const vatRate = Math.floor(Number(e.vatRate || 0));

    const vat = (price * vatRate) / 100;

    return sum + price + vat;
  }, 0);

  return Math.floor(total);
}, [expenses]);


  /* ===========================
     5. FINANCING
     =========================== */
  const [financing, setFinancing] = useState({
    applicationFee: "",
    downPaymentAuto: "",
    downPaymentRate: "",
    loanInterestRate: "",
    loanInterest: "",
    loanDuration: "",
    commissionRate: "",
    commissionDuration: "",
    commitmentFees: "",
    mortgageFees: "",
  });

  const updateFinancing = (field, value) => {
    setFinancing((prev) => ({ ...prev, [field]: value }));
  };

  const totalProjectCost = useMemo(() => {
    return totalPurchase + acquisitionCostAuto + totalExpenseCost;
  }, [totalPurchase, acquisitionCostAuto, totalExpenseCost]);

  const borrowedAmount = useMemo(() => {
    return Math.max(
      totalProjectCost - Number(financing.downPaymentAuto || 0),
      0
    );
  }, [totalProjectCost, financing.downPaymentAuto]);

  const financingInterest = useMemo(() => {
    const rate = Number(financing.loanInterestRate || 0) / 100;
    const months = Number(financing.loanDuration || 0);

    return (borrowedAmount * rate * months) / 12;
  }, [borrowedAmount, financing.loanInterestRate, financing.loanDuration]);

  // AUTO Down Payment calculation
  const downPaymentAuto = useMemo(() => {
    const acquisition = Number(acquisitionCostAuto || 0);
    const expenses = Number(totalExpenseCost || 0);
    const rate = Number(financing.downPaymentRate || 0); // %

    if (rate === 0) return 0;

    return (((acquisition + expenses) * rate) / 100).toFixed(0);
  }, [acquisitionCostAuto, totalExpenseCost, financing.downPaymentRate]);

  // this is loan interest calculation
  const loanInterestAuto = useMemo(() => {
    const acquisitionCost = Number(acquisitionCostAuto || 0);
    const expenses = Number(totalExpenseCost || 0);
    const downPayment = Number(financing.downPaymentAuto || 0);
    const rate = Number(financing.loanInterestRate || 0); // %
    const months = Number(financing.loanDuration || 0); // months

    const baseAmount = acquisitionCost + expenses - downPaymentAuto;

    if (baseAmount <= 0 || rate === 0 || months === 0) return 0;

    return ((baseAmount * rate * months) / (100 * 12)).toFixed(0);
  }, [
    acquisitionCostAuto,
    totalExpenseCost,
    financing.downPaymentAuto,
    financing.loanInterestRate,
    financing.loanDuration,
  ]);

  // this is commission fees calculation
  const commitmentFeesAuto = useMemo(() => {
    const acquisitionCost = Number(acquisitionCostAuto || 0);
    const expenses = Number(totalExpenseCost || 0);
    const downPayment = Number(financing.downPaymentAuto || 0);
    const commissionRate = Number(financing.commissionRate || 0); // %
    const commissionMonths = Number(financing.commissionDuration || 0); // months

    const baseAmount = acquisitionCost + expenses - downPaymentAuto;

    if (baseAmount <= 0 || commissionRate === 0) return 0;

    return (
      (baseAmount * commissionRate * commissionMonths) /
      (100 * 12)
    ).toFixed(0);
  }, [
    acquisitionCostAuto,
    totalExpenseCost,
    financing.downPaymentAuto,
    financing.commissionRate,
    financing.commissionDuration,
  ]);

  // this is mortgage fees calculation
  const mortgageFeesAuto = useMemo(() => {
    const acquisitionCost = Number(acquisitionCostAuto || 0);
    const expenses = Number(totalExpenseCost || 0);
    const downPayment = Number(financing.downPaymentAuto || 0);
    const mortgageRate = Number(financing.mortgageRate || 0); // %

    const baseAmount = acquisitionCost + expenses - downPaymentAuto;

    if (baseAmount <= 0 || mortgageRate === 0) return 0;

    return ((baseAmount * mortgageRate) / 100).toFixed(0);
  }, [
    acquisitionCostAuto,
    totalExpenseCost,
    financing.downPaymentAuto,
    financing.mortgageRate,
  ]);

  const totalFinancing = useMemo(() => {
    return (
      Number(financing.applicationFee || 0) +
      Number(loanInterestAuto || 0) +
      Number(commitmentFeesAuto || 0) +
      Number(mortgageFeesAuto || 0)
    ).toFixed(0);
  }, [
    loanInterestAuto,
    commitmentFeesAuto,
    mortgageFeesAuto,
    financing.applicationFee,
  ]);

  // validation
  const validateForm = () => {
    /* ========= BASIC PROJECT INFO ========= */
    if (!projectName.trim()) {
      toast.info("Project name is required");
      return false;
    }

    if (!projectAddress.trim()) {
      toast.info("Project address is required");
      return false;
    }

    /* ========= PURCHASE ========= */
    if (!purchase.faiPrice) {
      toast.info("FAI price is required");
      return false;
    }

    /* ========= ACQUISITION ========= */
    if (!acquisition.acquisitionPercentage) {
      toast.info("Acquisition percentage is required");
      return false;
    }

    /* ========= LOTS ========= */
    if (!lots.length) {
      toast.info("At least one lot is required");
      return false;
    }

    for (let i = 0; i < lots.length; i++) {
      const lot = lots[i];

      if (!lot.name.trim()) {
        toast.info(`Lot ${i + 1}: name is required`);
        return false;
      }

      if (!lot.resale) {
        toast.info(`Lot ${i + 1}: resale price is required`);
        return false;
      }

      if (!lot.area) {
        toast.info(`Lot ${i + 1}: area is required`);
        return false;
      }

      if (!lot.vat) {
        toast.info(`Lot ${i + 1}: vat is required`);
        return false;
      }

      if (!lot.balance) {
        toast.info(`Lot ${i + 1}: balance is required`);
        return false;
      }
    }

    /* ========= EXPENSES ========= */
    for (let i = 0; i < expenses.length; i++) {
      const e = expenses[i];

      if (!e.label.trim()) {
        toast.info(`Expense ${i + 1}: label is required`);
        return false;
      }

      if (!e.price) {
        toast.info(`Expense ${i + 1}: price is required`);
        return false;
      }

      if (e.vatRate === "") {
        toast.info(`Expense ${i + 1}: VAT rate is required`);
        return false;
      }
    }

    /* ========= FINANCING ========= */

    if (!financing.applicationFee) {
      toast.info("Application Fees is required");
      return false;
    }

    if (!financing.downPaymentRate) {
      toast.info("Down payment rate is required");
      return false;
    }

    if (!financing.loanInterestRate) {
      toast.info("Loan interest rate is required");
      return false;
    }

    if (!financing.loanDuration) {
      toast.info("Loan duration is required");
      return false;
    }

    if (!financing.commissionRate) {
      toast.info("Commission rate is required");
      return false;
    }

    if (!financing.commissionDuration) {
      toast.info("Commission duration is required");
      return false;
    }

    if (!financing.mortgageRate) {
      toast.info("Mortgage rate is required");
      return false;
    }

    return true; // all checks passed
  };

  /* ===========================
     SUBMIT
     =========================== */

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return; // ⛔ stop submission
    }
    setSubmitting(true);
    setApiError(null);

    const payload = {
      name: projectName,
      address: projectAddress,
      purchase: {
        faiPrice: toNumber(purchase.faiPrice),
        agencyFees: toNumber(purchase.agencyFees),
        acquisitionCost: toNumber(notaryFeesAuto),
        totalAcquisitionCost: toNumber(acquisitionCostAuto),
      },
      lots: lotsWithTotals.map((lot) => ({
        id: lot.id,
        name: lot.name,
        resalePrice: toNumber(lot.resale),
        area: toNumber(lot.area),
        pricePerM2: toNumber(lot.pricePerM2),
        vatType: lot.vat,
        vatAmount: toNumber(lot.vatAmount),
        totalWithVat: toNumber(lot.totalWithVat),
        balance: toNumber(lot.balance),
      })),
      expenses: expenses.map((e) => ({
        id: e.id,
        label: e.label,
        priceExclTax: toNumber(e.price),
        vatRate: toNumber(e.vatRate),
      })),
      financing: {
        applicationFee: toNumber(financing.applicationFee),
        contributionPercentage: toNumber(financing.downPaymentRate),
        contribution: toNumber(downPaymentAuto),
        interestRate: toNumber(financing.loanInterestRate),
        durationMonths: toNumber(financing.loanDuration),
        loanInterest: toNumber(loanInterestAuto),
        commissionRate: toNumber(financing.commissionRate),
        commissionDurationMonths: toNumber(financing.commissionDuration),
        commitmentFees: toNumber(commitmentFeesAuto),
        montageRate: toNumber(financing.mortgageRate),
        mortgageFees: toNumber(mortgageFeesAuto),
        totalFinancing: toNumber(totalFinancing),
      },
    };

    console.log(payload);
    try {
      const res = await axios.post(
        "https://api.emibocquillon.fr/api/project/save",
        payload,
        authConfig
      );

      toast.success("Operation analysis submitted successfully", {
        toastId: "submit-success",
      });
      console.log("API SUCCESS:", res.data);
      // NAVIGATE ON SUCCESS
      navigate("/history");
    } catch (err) {
      console.error("API ERROR:", err);

      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Something went wrong. Please try again.";

      setApiError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  // save as draft validation
  const draftValidate = () => {
    /* ========= BASIC PROJECT INFO ========= */
    if (!projectName.trim()) {
      toast.info("Project name is required");
      return false;
    }

    /* ========= EXPENSES ========= */
    for (let i = 0; i < expenses.length; i++) {
      const e = expenses[i];

      if (!e.label.trim()) {
        toast.info(`Expense ${i + 1}: label is required`);
        return false;
      }
    }
    return true; // all checks passed
  };

  // ===========================
  // SAVE AS DRAFT (NO VALIDATION)
  // ===========================
  const handleSaveDraft = async () => {
    if (!draftValidate()) {
      return; // ⛔ stop saving draft
    }

    setDraftSaving(true);
    setApiError(null);

    // payload allows incomplete data
    const payload = {
      name: projectName || null,
      address: projectAddress || null,

      purchase: {
        faiPrice: toNumber(purchase.faiPrice),
        agencyFees: toNumber(purchase.agencyFees),
        acquisitionCost: toNumber(notaryFeesAuto),
        totalAcquisitionCost: toNumber(acquisitionCostAuto),
      },

      lots: lotsWithTotals.map((lot) => ({
        id: lot.id,
        name: lot.name || null,
        resalePrice: toNumber(lot.resale),
        area: toNumber(lot.area),
        pricePerM2: toNumber(lot.pricePerM2 || 0),
        vatType: lot.vat || null,
        vatAmount: toNumber(lot.vatAmount || 0),
        totalWithVat: toNumber(lot.totalWithVat || 0),
        balance: toNumber(lot.balance || 0),
      })),

      expenses: expenses.map((e) => ({
        id: e.id,
        label: e.label || null,
        priceExclTax: toNumber(e.price),
        vatRate: toNumber(e.vatRate),
      })),

      financing: {
        applicationFee: toNumber(financing.applicationFee),
        contributionPercentage: toNumber(financing.downPaymentRate),
        contribution: toNumber(downPaymentAuto),
        interestRate: toNumber(financing.loanInterestRate),
        durationMonths: toNumber(financing.loanDuration),
        loanInterest: toNumber(loanInterestAuto),
        commissionRate: toNumber(financing.commissionRate),
        commissionDurationMonths: toNumber(financing.commissionDuration),
        commitmentFees: toNumber(commitmentFeesAuto),
        montageRate: toNumber(financing.mortgageRate),
        mortgageFees: toNumber(mortgageFeesAuto),
        totalFinancing: toNumber(totalFinancing),
      },
    };

    try {
      const res = await axios.post(
        "https://api.emibocquillon.fr/api/project/save-draft",
        payload,
        authConfig
      );

      toast.success("Draft saved successfully", {
        toastId: "draft-success",
      });

      console.log("DRAFT SUCCESS:", res.data);

      // optional: navigate to history or stay on page
      navigate("/history");
    } catch (err) {
      console.error("DRAFT API ERROR:", err);

      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Unable to save draft. Please try again.";

      setApiError(message);
      toast.error(message);
    } finally {
      setDraftSaving(false);
    }
  };

  // discard button logic
  const handleDiscard = () => {
    setProjectName("");
    setProjectAddress("");
    setPurchase({ faiPrice: "", agencyFees: "" });
    setAcquisition({
      acquisitionCost: "",
      notaryFees: "",
      acquisitionPercentage: "",
    });
    setLots([createLot(1), createLot(2)]);
    setExpenses([
      { id: 1, label: "", price: "", vatRate: "" },
      { id: 2, label: "", price: "", vatRate: "" },
    ]);
    setFinancing({
      applicationFee: "",
      downPaymentAuto: "",
      downPaymentRate: "",
      loanInterestRate: "",
      loanInterest: "",
      loanDuration: "",
      commissionRate: "",
      commissionDuration: "",
      commitmentFees: "",
      mortgageFees: "",
    });
    toast.success("Form discarded successfully");
  };

  /* ===========================
     UI (UNCHANGED)
     =========================== */

  return (
    <section id="calculation-section">
      <form onSubmit={handleSubmit} className="max-w-7xl mx-auto px-4 py-12">
        {/* PAGE HEADER */}
        <div className="text-center mb-12">
          <h1 className="text-3xl heading font-semibold text-gray-900">
            Modifier le rapport
          </h1>
          <p className="text-xl text-gray-500 mt-3 max-w-xl mx-auto">
            Remplissez les détails de votre projet immobilier pour recevoir une analyse détaillée de sa rentabilité.
          </p>
        </div>

        {/* name */}
        <Section className="">
          <label>
            <span className="text-gray-800 text-lg font-semibold">
              Nom du projet
            </span>

            <input
              type="text"
              placeholder="enter project name"
              className="bg-gray-100 rounded-lg px-3 py-3 w-full text-sm outline-none"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </label>
        </Section>

        {/* address */}
        <Section className=" ">
          <label>
            <span className="text-gray-800 text-lg font-semibold">
              Adresse du projet
            </span>

            <input
              type="text"
              placeholder="enter project address"
              className="bg-gray-100 rounded-lg px-3 py-3 w-full text-sm outline-none"
              value={projectAddress}
              onChange={(e) => setProjectAddress(e.target.value)}
            />
          </label>
        </Section>

        {/* PURCHASE */}
        <Section>
          <SectionTitle icon={<FaHome size={16} />}>Achat </SectionTitle>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
            <label>
              <span className="text-gray-400 text-sm  font-semibold">
                Prix FAI (€)
              </span>
              <Input
                numeric
                placeholder="250,000"
                value={purchase.faiPrice}
                onChange={(v) => setPurchase({ ...purchase, faiPrice: v })}
              />
            </label>

            <label>
              <span className="text-gray-400 text-sm  font-semibold">
                Frais d’agence (€)
              </span>
              <Input
                numeric
                placeholder="10,000"
                value={purchase.agencyFees}
                onChange={(v) => setPurchase({ ...purchase, agencyFees: v })}
              />
            </label>
          </div>
        </Section>

        {/* ACQUISITION COST */}
        <Section>
          <SectionTitle icon={<FaReceipt size={16} />}>
            Frais d’acquisition 
          </SectionTitle>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
            <label>
              <span className="text-gray-400 text-sm font-semibold">
                Pourcentage d’acquisition (%)
              </span>
              <Input
                numeric
                min={0}
                max={100}
                placeholder="5"
                value={acquisition.acquisitionPercentage}
                onChange={(v) =>
                  setAcquisition({ ...acquisition, acquisitionPercentage: v })
                }
              />
            </label>

            <label>
              <span className="text-gray-400 text-sm font-semibold">
                Frais de notaire (€) 
              </span>
              <Input
                numeric
                value={notaryFeesAuto}
                placeholder="Auto-calculated"
                readOnly
              />
            </label>

            <label className=" md:col-span-2">
              <span className="text-gray-400 text-sm  font-semibold">
                Coût total d’acquisition (€)
              </span>
              <Input
                numeric
                value={acquisitionCostAuto}
                placeholder="Auto-calculated"
                readOnly
              />
            </label>
          </div>
        </Section>

        {/* LOTS */}
        <Section>
          <div className="flex items-center justify-between mb-7">
            <SectionTitle icon={<FaBuilding size={16} />}>Lots</SectionTitle>

            <button
              type="button"
              onClick={addLot}
              className="flex items-center gap-2 bg-[#0f3d2e] text-white px-4 py-2 rounded-xl text-md font-medium"
            >
              <FaPlus size={10} /> Add a batch
            </button>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="min-w-max w-full  text-xs text-gray-600">
              <thead>
                <tr className="text-left text-sm ">
                  {/* <th className="px-7 py-2">N</th> */}
                  <th className="px-4">Nom du lot </th>
                  <th className="px-4">Prix de revente</th>
                  <th className="px-4">Surface (m²)</th>
                  <th className="px-4">Prix / m²</th>
                  <th className="px-4">TVA</th>
                  <th className="px-1">Équilibre (%)</th>
                  <th />
                </tr>
              </thead>

              <tbody>
                {lotsWithTotals.map((lot) => (
                  <tr key={lot.id} className="hover:bg-gray-50">
                    {/* Lot name (TEXT INPUT) */}
                    <td className="px-4 py-4">
                      <Cell
                        type="text"
                        placeholder="Lot name"
                        value={lot.name}
                        onChange={(v) => updateLot(lot.id, "name", v)}
                      />
                    </td>

                    {/* Resale price */}
                    <td className="px-4">
                      <Cell
                        numeric
                        placeholder="250000"
                        value={lot.resale}
                        onChange={(v) => updateLot(lot.id, "resale", v)}
                      />
                    </td>

                    {/* Area */}
                    <td className="px-4">
                      <Cell
                        numeric
                        placeholder="80"
                        value={lot.area}
                        onChange={(v) => updateLot(lot.id, "area", v)}
                      />
                    </td>

                    {/* AUTO Price / m² */}
                    <td className="px-4 font-semibold text-gray-900">
                      {lot.pricePerM2 || "-"}
                    </td>

                    {/* VAT */}
                    <td className="px-4">
                      <select
                        value={lot.vat}
                        onChange={(e) =>
                          updateLot(lot.id, "vat", e.target.value)
                        }
                        className="w-full bg-gray-100 border border-gray-400 rounded-lg px-3 py-2 text-xs"
                      >
                        <option value="Exonéré de TVA">Exonéré de TVA </option> 
                        <option value="TVA Intégrale">TVA Intégrale </option>
                        <option value="TVA sur Marge">TVA sur Marge </option>
                      </select>
                    </td>

                    {/* Balance */}
                    <td>
                      <Cell
                        numeric
                        placeholder="20"
                        value={lot.balance}
                        onChange={(v) => {
                          if (v === "") {
                            updateLot(lot.id, "balance", "");
                            return;
                          }

                          // normalize comma → dot
                          let value = v.replace(",", ".");

                          // limit to one decimal place
                          if (value.includes(".")) {
                            const [intPart, decPart] = value.split(".");
                            value = intPart + "." + decPart.slice(0, 2);
                          }

                          const num = Number(value);

                          // allow intermediate state like "3."
                          if (isNaN(num)) {
                            updateLot(lot.id, "balance", value);
                            return;
                          }

                          // enforce 0–100 range
                          if (num < 0 || num > 100) return;

                          updateLot(lot.id, "balance", value);
                        }}
                      />
                    </td>

                    {/* Delete */}
                    <td className="px-4 text-right">
                      <button
                        type="button"
                        onClick={() => removeLot(lot.id)}
                        className="text-red-500"
                      >
                        <FaRegTrashAlt size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <TotalBar label="Total revente" value={`${totalResale} €`} />
        </Section>

        {/* EXPENSES */}
        <Section>
          {/* HEADER + ACTION */}
          <div className="flex items-center justify-between mb-7">
            <SectionTitle icon={<FaReceipt size={16} />}>
              <h1 className="text-xl heading">Dépenses</h1>
            </SectionTitle>

            <button
              type="button"
              onClick={() =>
                setExpenses((prev) => [
                  ...prev,
                  {
                    id: Date.now(),
                    label: "",
                    price: "",
                    vatRate: "",
                  },
                ])
              }
              className="flex items-center gap-2 bg-[#0f3d2e] text-white px-4 py-2 rounded-xl text-sm md:text-md font-medium"
            >
              <FaPlus size={10} /> Ajouter une dépense
            </button>
          </div>

          {/* TABLE */}
          <div className="w-full overflow-x-auto">
            <table className="min-w-max w-full  text-xs text-gray-600">
              <thead>
                <tr className="text-left text-sm">
                  <th className="pb-3 font-medium">Intitulé</th>
                  <th className="font-medium">Prix HT (€)</th>
                  <th className="font-medium">Taux de TVA (%)</th>
                  <th className="font-medium pr-6">TVA (€)</th>
                  <th className="font-medium ">Prix TTC (€)</th>
                  <th />
                </tr>
              </thead>

              <tbody className="">
                {expenses.map((e) => {
                  const price = Number(e.price || 0);
                  const vat = (price * Number(e.vatRate || 0)) / 100;
                  const total = price + vat;

                  return (
                    <tr
                      key={e.id}
                      className="hover:bg-gray-50 text-left text-sm transition"
                    >
                      <td className="px-1 pr-6 py-4">
                        <Cell
                          type="text"
                          placeholder="Renovation"
                          value={e.label}
                          onChange={(v) => updateExpense(e.id, "label", v)}
                        />
                      </td>

                      <td className="px-1 pr-6 py-4">
                        <Cell
                          numeric
                          placeholder="250,000"
                          value={e.price}
                          onChange={(v) => updateExpense(e.id, "price", v)}
                        />
                      </td>

                      <td className="px-4 py-4">
                        <Cell
                          numeric
                          placeholder="20"
                          value={e.vatRate}
                          onChange={(v) => {
                            if (v === "") {
                              updateExpense(e.id, "vatRate", "");
                              return;
                            }

                            // normalize comma → dot
                            let value = v.replace(",", ".");

                            // limit to one decimal place
                            if (value.includes(".")) {
                              const [intPart, decPart] = value.split(".");
                              value = intPart + "." + decPart.slice(0, 2);
                            }

                            const num = Number(value);

                            // allow intermediate state like "3."
                            if (isNaN(num)) {
                              updateExpense(e.id, "vatRate", value);
                              return;
                            }

                            // enforce 0–100 range
                            if (num < 0 || num > 100) return;

                            updateExpense(e.id, "vatRate", value);
                          }}
                        />
                      </td>

                      <td className="px-4 py-4  font-medium text-gray-900">
                        {vat.toFixed(0)}
                      </td>

                      <td className="px-4 py-4 font-medium text-gray-900">
                        {total.toFixed(0)}
                      </td>

                      <td className="px-4 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => removeExpense(e.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <FaRegTrashAlt size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* TOTAL */}
          <div className="flex items-center justify-between rounded-xl mt-5 bg-gray-100 px-6 py-4">
            <span className="text-sm font-medium text-gray-600">
              Coût total des dépenses 
            </span>

            <span className="text-xl font-semibold text-gray-900">
              {totalExpenseCost} €
            </span>
          </div>
        </Section>

        {/* FINANCING */}
        <Section>
          <SectionTitle icon={<AiOutlineBank size={18} />}>
            Financement 
          </SectionTitle>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-5">
            <label>
              <span className="text-gray-400 text-sm font-semibold">
                Frais de dossier (€)
              </span>
              <Input
                numeric
                placeholder="2000"
                value={financing.applicationFee}
                onChange={(v) => updateFinancing("applicationFee", v)}
              />
            </label>

            <label>
              <span className="text-gray-400 text-sm font-semibold">
                Taux d’apport (%)
              </span>

              <Input
                numeric
                min={0}
                max={100}
                placeholder="5"
                value={financing.downPaymentRate}
                onChange={(v) => {
                  if (v === "") {
                    updateFinancing("downPaymentRate", "");
                    return;
                  }

                  // normalize comma -> dot
                  let value = v.replace(",", ".");

                  // limit to one decimal place
                  if (value.includes(".")) {
                    const [intPart, decPart] = value.split(".");
                    value = intPart + "." + decPart.slice(0, 2);
                  }

                  const num = Number(value);

                  // allow transient states like "3."
                  if (isNaN(num)) {
                    updateFinancing("downPaymentRate", value);
                    return;
                  }

                  // enforce 0–100
                  if (num < 0 || num > 100) return;

                  updateFinancing("downPaymentRate", value);
                }}
              />
            </label>

            <label>
              <span className="text-gray-400 text-sm  font-semibold">
                Apport personnel (€)
              </span>
              <Input
                numeric
                value={downPaymentAuto}
                placeholder="Auto-calculated"
                readOnly
              />
            </label>

            <label>
              <span className="text-gray-400 text-sm font-semibold">
                Taux d’intérêt (%)
              </span>

              <Input
                numeric
                min={0}
                max={100}
                placeholder="5"
                value={financing.loanInterestRate}
                onChange={(v) => {
                  if (v === "") {
                    updateFinancing("loanInterestRate", "");
                    return;
                  }

                  // normalize comma to dot
                  let value = v.replace(",", ".");

                  // limit to one decimal place
                  if (value.includes(".")) {
                    const [intPart, decPart] = value.split(".");
                    value = intPart + "." + decPart.slice(0, 2);
                  }

                  const num = Number(value);

                  // allow temporary states like "3."
                  if (isNaN(num)) {
                    updateFinancing("loanInterestRate", value);
                    return;
                  }

                  // enforce 0–100 range
                  if (num < 0 || num > 100) return;

                  updateFinancing("loanInterestRate", value);
                }}
              />
            </label>

            <label>
              <span className="text-gray-400 text-sm  font-semibold">
                Durée du prêt (mois)
              </span>
              <Input
                numeric
                placeholder="12"
                value={financing.loanDuration}
                onChange={(v) => updateFinancing("loanDuration", v)}
              />
            </label>

            <label>
              <span className="text-gray-400 text-sm  font-semibold">
                Intérêts d’emprunt (€)
              </span>
              <Input
                numeric
                value={loanInterestAuto}
                placeholder="Auto-calculated"
                readOnly
              />
            </label>

            <label>
              <span className="text-gray-400 text-sm font-semibold">
                Taux de commission (%)
              </span>

              <Input
                numeric
                min={0}
                max={100}
                placeholder="5"
                value={financing.commissionRate}
                onChange={(v) => {
                  if (v === "") {
                    updateFinancing("commissionRate", "");
                    return;
                  }

                  // normalize comma to dot
                  let value = v.replace(",", ".");

                  // limit to one decimal place (typing-friendly)
                  if (value.includes(".")) {
                    const [intPart, decPart] = value.split(".");
                    value = intPart + "." + decPart.slice(0, 2);
                  }

                  const num = Number(value);

                  // allow intermediate states like "3."
                  if (isNaN(num)) {
                    updateFinancing("commissionRate", value);
                    return;
                  }

                  // range 0–100
                  if (num < 0 || num > 100) return;

                  updateFinancing("commissionRate", value);
                }}
              />
            </label>

            <label>
              <span className="text-gray-400 text-sm  font-semibold">
                Durée de commission (mois)
              </span>
              <Input
                numeric
                placeholder="12"
                value={financing.commissionDuration}
                onChange={(v) => updateFinancing("commissionDuration", v)}
              />
            </label>

            <label>
              <span className="text-gray-400 text-sm  font-semibold">
                Frais de commission (€)
              </span>
              <Input
                numeric
                value={commitmentFeesAuto}
                placeholder="Auto-calculated"
                readOnly
              />
            </label>

            <label>
              <span className="text-gray-400 text-sm  font-semibold">
                Taux de montage (%)
              </span>

              <Input
                numeric
                min={0}
                max={100}
                placeholder="5"
                value={financing.mortgageRate}
                onChange={(v) => {
                  if (v === "") {
                    updateFinancing("mortgageRate", "");
                    return;
                  }

                  // allow typing "." and numbers
                  let value = v.replace(",", ".");

                  // trim to one decimal place if needed
                  if (value.includes(".")) {
                    const [intPart, decPart] = value.split(".");
                    value = intPart + "." + decPart.slice(0, 1);
                  }

                  const num = Number(value);

                  // still allow unfinished input like "3."
                  if (isNaN(num)) {
                    updateFinancing("mortgageRate", value);
                    return;
                  }

                  // enforce range
                  if (num < 0 || num > 100) return;

                  updateFinancing("mortgageRate", value);
                }}
              />
            </label>

            <label>
              <span className="text-gray-400 text-sm font-semibold">
                Frais de montage (€)
              </span>
              <Input
                numeric
                value={mortgageFeesAuto}
                placeholder="Auto-calculated"
                readOnly
              />
            </label>
          </div>

          <TotalBar label="Coût total du financement " value={`${totalFinancing} €`} />
        </Section>

        {/* buttons */}
        <div className="flex flex-col md:flex-row md:justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={handleDiscard}
            disabled={submitting}
            className="w-full md:w-auto px-4 py-2 rounded-2xl hover:bg-gray-200 border-2 border-[#00332B] text-[#00332B] font-semibold text-lg"
          >
            <FaXmark className="inline-block mr-2" /> Annuler 
          </button>

          <button
            type="button"
            onClick={handleSaveDraft}
            className="w-full md:w-auto px-4 py-2 rounded-2xl hover:bg-gray-200 border-2 border-[#00332B] text-[#00332B] text-lg font-semibold"
            disabled={draftSaving}
          >
            <LuFileText className="inline-block mr-2" />
            {draftSaving ? "Saving..." : "Enregistrer en brouillon"}
          </button>

          <button
            type="submit"
            disabled={submitting}
            className={`w-full md:w-auto px-4 py-2 rounded-xl hover:bg-green-800 text-lg text-white ${
              submitting ? "bg-gray-400" : "bg-[#00332B]"
            }`}
          >
            <LuFileText className="inline-block mr-2" />
            {submitting ? "Submitting..." : "Valider l’analyse"}
          </button>
        </div>
      </form>
    </section>
  );
}

/* ===========================
   PRIMITIVES (UNCHANGED)
   =========================== */

function Section({ children }) {
  return (
    <section className="bg-white rounded-2xl border border-gray-200 shadow-sm px-4 py-5 md:px-6 md:py-7 mb-8">
      {children}
    </section>
  );
}

function SectionTitle({ icon, children }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
        {icon}
      </div>
      <h2 className="text-xl heading">{children}</h2>
    </div>
  );
}

function Input({ value, onChange, placeholder, numeric = false, min, max }) {
  const handleChange = (e) => {
    let val = e.target.value;

    if (val === "") {
      onChange("");
      return;
    }

    if (numeric) {
      // allow comma as decimal separator
      val = val.replace(",", ".");

      // allow: "12" "12." "12.3" ".5"
      const decimalPattern = /^(\d+(\.\d*)?|\.\d*)$/;
      if (!decimalPattern.test(val)) return;

      // only validate min/max when value is a real number
      if (!isNaN(Number(val))) {
        const num = Number(val);

        if (min !== undefined && num < min) return;
        if (max !== undefined && num > max) return;
      }

      onChange(val);
      return;
    }

    onChange(val);
  };

  return (
    <input
      className="w-full bg-gray-100 rounded-lg px-3 py-2 text-sm"
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      inputMode={numeric ? "decimal" : "text"}
    />
  );
}

function Cell({ value, onChange, numeric, ...props }) {
  function formatIndianNumber(value) {
    if (value === null || value === undefined || value === "") return "";

    value = value.toString().replace(/,/g, "");

    const num = Number(value);
    if (isNaN(num)) return "";

    return num.toLocaleString("en-IN");
  }

  const handleChange = (e) => {
    let val = e.target.value;

    if (numeric) {
      // remove commas
      val = val.replace(/,/g, "");

      // allow only digits
      val = val.replace(/\D/g, "");
    }

    onChange(val); // send RAW value to parent
  };

  const displayValue = numeric ? formatIndianNumber(value) : value;

  return (
    <input
      {...props}
      value={displayValue}
      onChange={handleChange}
      inputMode={numeric ? "numeric" : "text"}
      className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 w-full text-xs outline-none"
    />
  );
}

function TotalBar({ label, value }) {
  return (
    <div className="flex justify-between items-center bg-gray-100 mt-5 px-6 py-4 rounded-xl">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-xl font-semibold text-gray-900">{value}</span>
    </div>
  );
}
