import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const normalizeUserRole = (apiRole) => {
  if (!apiRole) return "user";

  const role = apiRole.toLowerCase();

  if (role === "invited") return "invited";
  if (role === "user") return "user";

  // Handle all premium variants (including backend typo)
  if (
    role === "premium" ||
    role === "premium_user" ||
    role === "permium_user" || // backend typo
    role === "paid_user"
  ) {
    return "premium";
  }

  return "user";
};

export default function Profile() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
  });

  // const [profileImage, setProfileImage] = useState(
  //   "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?q=80&w=200&auto=format&fit=crop",
  // );

  const token = localStorage.getItem("authToken");

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const [userRole, setUserRole] = useState(""); // invited | user | premium

  const [subscription, setSubscription] = useState({
    planName: "",
    startDate: "",
    endDate: "",
    daysRemaining: 0,
    totalReports: 0,
  });

  const [subscriptionStatus, setSubscriptionStatus] = useState({
    label: "",
    isActive: false,
  });

  const [cancelLoading, setCancelLoading] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);

  const [continueLoading, setContinueLoading] = useState(false);

  const isInvitedUser = userRole === "invited";

  const roleBadgeClasses = {
    invited: "bg-blue-100 text-blue-700",
    user: "bg-gray-100 text-gray-700",
    premium: "bg-purple-100 text-purple-700",
  };

  const roleLabels = {
    invited: "Utilisateur invité",
    user: "Utilisateur Standard",
    premium: "Utilisateur Premium",
  };

  //confirm cancel subscription modal
  const confirmCancelSubscription = () => {
    toast.info(
      ({ closeToast }) => (
        <div className="flex flex-col gap-3">
          <p>Êtes-vous sûr de vouloir annuler votre abonnement ?</p>
          <div className="flex gap-3 justify-end">
            <button
              className="px-3 py-1 text-sm bg-gray-200 rounded"
              onClick={closeToast}
            >
              Annuler
            </button>
            <button
              className="px-3 py-1 text-sm bg-red-600 text-white rounded"
              onClick={() => {
                closeToast();
                handleCancelSubscription();
              }}
            >
              Confirmer
            </button>
          </div>
        </div>
      ),
      {
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
      },
    );
  };

  // continue subscription
  const handleContinueSubscription = async () => {
    try {
      setContinueLoading(true);

      const res = await axios.post(
        "https://api.emibocquillon.fr/api/stripe/continue-subscription",
        {},
        authConfig,
      );

      if (res.data.success) {
        toast.success(
          res.data.message || "Subscription continued successfully",
        );

        // 🔄 Refresh profile & badge in real time
        fetchProfile();

        // Optional: refresh profile/subscription data
        // fetchProfile(); (only if you extract it from useEffect)
      } else {
        toast.error("Unable to continue subscription");
      }
    } catch (error) {
      console.error("Continue subscription failed", error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to continue subscription. Please try again.",
      );
    } finally {
      setContinueLoading(false);
    }
  };

  // cancel subscription
  const handleCancelSubscription = async () => {
    try {
      setCancelLoading(true);

      const res = await axios.post(
        "https://api.emibocquillon.fr/api/stripe/cancel-subscription",
        {},
        authConfig,
      );

      if (res.data.success) {
        const { message, cancelAt } = res.data;

        // Optional: format cancel date for user clarity
        const formattedDate = cancelAt
          ? new Date(cancelAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })
          : null;

        toast.success(
          formattedDate
            ? `${message} (Effective on ${formattedDate})`
            : message,
        );

        // 🔄 Refresh profile & badge in real time
        await fetchProfile();

        // Optional UI sync
        // setIsCancelled(true);
      } else {
        toast.error("Unable to cancel subscription");
      }
    } catch (error) {
      console.error("Cancel subscription failed", error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to cancel subscription. Please try again.",
      );
    } finally {
      setCancelLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        "https://api.emibocquillon.fr/api/auth/DashBoard",
        authConfig,
      );

      if (res.data.success) {
        const user = res.data.user;

        setUserRole(normalizeUserRole(user.role));

        setFormData((prev) => ({
          ...prev,
          firstName: user.FirstName || "",
          lastName: user.LastName || "",
          email: user.Email || "",
          phone: user.PhoneNumber || "",
        }));

        // ✅ SUBSCRIPTION STATUS LOGIC (BASED ON SUBSCRIPTION STATUS)
        const subscriptionStatusApi =
          res.data.payment?.subscriptionStatus || "Inactive";

        const isSubscriptionActive =
          typeof subscriptionStatusApi === "string" &&
          subscriptionStatusApi.toLowerCase() === "active";

        setSubscriptionStatus({
          isActive: isSubscriptionActive,
          label: isSubscriptionActive
            ? "Subscription Active"
            : "Subscription Deactivated",
        });

        // Keep button state in sync
        setIsCancelled(!isSubscriptionActive);

        const start = new Date(user.startDate);
        const end = new Date(user.endDate);
        const today = new Date();

        const daysRemaining = Math.max(
          Math.ceil((end - today) / (1000 * 60 * 60 * 24)),
          0,
        );

        setSubscription({
          planName: user.plan_name || "-",
          startDate: start.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          }),
          endDate: end.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          }),
          daysRemaining,
          totalReports: user.total_report_generated || 0,
        });
      }
    } catch (error) {
      console.error("Profile prefill failed", error);

      toast.error(
        error.response?.data?.message || "Unable to fetch profile information",
      );
    }
  };

  /* ---------- Prefill API ---------- */
  useEffect(() => {
    fetchProfile();
  }, []);

  /* ---------- Handlers ---------- */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Profile Data:", formData);
    alert("Profile updated successfully");
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const imageURL = URL.createObjectURL(file);
    setProfileImage(imageURL);
  };

  const handleImageDelete = () => {
    setProfileImage("");
  };

  /* ---------- UI ---------- */

  return (
    <div className="min-h-screen w-full mt-6 p-2 sm:p-4">
      <div className="mb-6 text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl heading font-semibold text-gray-900">
          Profil
        </h1>
        <p className="text-sm text-gray-500">
          Accédez à vos rapports, abonnements et plus
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-300 mx-3 sm:mx-6 lg:mx-20 p-4 sm:p-6 md:p-8">
        <h2 className="text-xl font-medium mb-6">Mes informations </h2>
        <div >
          {/* subscription status */}
            <span
            className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full mr-2 my-4 text-xs font-semibold
        ${
          subscriptionStatus.isActive
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
          >
            {subscriptionStatus.isActive
              ? "Abonnement actif"
              : "Abonnement désactivé "}
          </span>

          {/* user type status */}
           <span
            className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs font-semibold ${
              roleBadgeClasses[userRole] || "bg-gray-100 text-gray-700"
            }`}
          >
            {roleLabels[userRole] || "Utilisateur"}
          </span>
        </div>
        

        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-5 mb-8">
          <div className="w-full">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Continue Subscription */}
              <button
                type="button"
                onClick={handleContinueSubscription}
                disabled={
                  continueLoading ||
                  subscriptionStatus.isActive ||
                  isInvitedUser
                }
                className={`px-6 py-2 rounded-lg text-sm font-semibold transition
    ${
      subscriptionStatus.isActive || isInvitedUser
        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
        : "bg-green-600 text-white hover:bg-green-700"
    }
    ${continueLoading ? "opacity-60" : ""}
  `}
              >
                {continueLoading
                  ? "Processing..."
                  : isInvitedUser
                    ? "Invited users cannot subscribe"
                    : subscriptionStatus.isActive
                      ? "Abonnement actif"
                      : "Reprendre l’abonnement"}
              </button>

              {/* Cancel Subscription */}
              <button
                type="button"
                onClick={confirmCancelSubscription}
                disabled={cancelLoading || isCancelled || isInvitedUser}
                className={`px-6 py-2 rounded-lg text-sm font-semibold transition
          ${
            isCancelled || isInvitedUser
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-red-600 text-white hover:bg-red-700"
          }`}
              >
                {cancelLoading
                  ? "Cancelling..."
                  : isInvitedUser
                    ? "Action non autorisée"
                    : isCancelled
                      ? "Abonnement annulé"
                      : "Annuler l'abonnement"}
              </button>
            </div>
          </div>
        </div>

        {/* Form */}
        {/* <form className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {["firstName", "lastName", "phone", "email"].map((field) => (
            <div key={field}>
              <label className="block text-sm mb-1 capitalize">
                {field.replace(/([A-Z])/g, " $1")}
              </label>
              <span className="w-full border border-gray-300 rounded-lg px-4 py-2 block bg-gray-50 text-gray-800">
                {formData[field] || "—"}
              </span>
            </div>
          ))}
        </form> */}
        {/* Form */}
        <form className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* First Name */}
          <div>
            <label className="block text-sm mb-1">Prénom</label>
            <span className="w-full border border-gray-300 rounded-lg px-4 py-2 block bg-gray-50 text-gray-800">
              {formData.firstName || "—"}
            </span>
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm mb-1">Nom</label>
            <span className="w-full border border-gray-300 rounded-lg px-4 py-2 block bg-gray-50 text-gray-800">
              {formData.lastName || "—"}
            </span>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm mb-1">Téléphone</label>
            <span className="w-full border border-gray-300 rounded-lg px-4 py-2 block bg-gray-50 text-gray-800">
              {formData.phone || "—"}
            </span>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm mb-1">Email</label>
            <span className="w-full border border-gray-300 rounded-lg px-4 py-2 block bg-gray-50 text-gray-800">
              {formData.email || "—"}
            </span>
          </div>
        </form>

        {/* Subscription Section */}
        <div className="mt-6 flex flex-col xl:flex-row gap-4">
          {/* Subscription Info */}
          <div className="flex-1 rounded-lg border border-gray-200 px-4 sm:px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-700 border-b border-b-gray-300 pb-3 mb-4">
              Informations d’abonnement
            </h2>

            {/* Mobile / Tablet layout */}
            <div className="space-y-3 sm:hidden">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">
                  Nom de l’offre{" "}
                </span>
                <span className="font-semibold text-gray-700">
                  {subscription.planName}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">
                  Date de début{" "}
                </span>
                <span className="font-semibold text-gray-700">
                  {subscription.startDate}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Date de fin</span>
                <span className="font-semibold text-gray-700">
                  {subscription.endDate}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">
                  Jours restants
                </span>
                <span className="font-semibold text-blue-600">
                  {subscription.daysRemaining} jours
                </span>
              </div>
            </div>

            {/* Desktop layout */}
            <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <span className="text-gray-500 font-semibold">
                Nom de l’offre{" "}
              </span>
              <span className="text-gray-500 font-semibold">
                Date de début{" "}
              </span>
              <span className="text-gray-500 font-semibold">Date de fin</span>
              <span className="text-gray-500 font-semibold">
                Jours restants
              </span>

              <span className="font-semibold text-gray-700">
                {subscription.planName}
              </span>
              <span className="font-semibold text-gray-700">
                {subscription.startDate}
              </span>
              <span className="font-semibold text-gray-700">
                {subscription.endDate}
              </span>
              <span className="font-semibold text-blue-600">
                {subscription.daysRemaining} jours
              </span>
            </div>
          </div>

          {/* Reports Card */}
          <div className="rounded-lg border border-gray-200 px-6 py-4 flex flex-col items-center justify-center text-center w-full xl:w-72">
            <h2 className="text-sm font-semibold text-gray-700 mb-2">
              Rapports téléchargés
            </h2>

            <span className="text-3xl sm:text-4xl font-semibold text-blue-600">
              {subscription.totalReports}
            </span>

            <span className="text-xs text-gray-500 mt-1">Activité totale</span>
          </div>
        </div>
      </div>
    </div>
  );
}
