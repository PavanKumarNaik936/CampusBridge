"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import CreateCompanyForm from "./CreateCompanyForm";
import { useRouter } from "next/navigation";
import Image from "next/image";
interface Company {
  id: string;
  name: string;
  logo?: string;
  website?: string;
  sector?: string;
  location?: string;
  totalOffers?: number;
}

export default function CompanyListWithForm() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [showForm, setShowForm] = useState(false);
const router=useRouter();
  const fetchCompanies = async () => {
    try {
      const { data } = await axios.get("/api/companies");
      setCompanies(data);
    } catch (err) {
      console.error("Failed to load companies");
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleCompanyCreated = (newCompany: Company) => {
    setCompanies((prev) => [newCompany, ...prev]);
    setShowForm(false); // Optional: auto-close form after submit
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-blue-800">🏢 Registered Companies</h2>

        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-medium"
        >
          {showForm ? "Close Form" : "➕ Add Company"}
        </button>
        <button
          onClick={() => router.push("/profile/jobs/post")}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold transition duration-200 shadow-md hover:shadow-lg"
        >
          Post Job
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

      </div>

      {showForm && (
        <div className="mb-6">
          <CreateCompanyForm onCompanyCreated={handleCompanyCreated} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {companies.map((company) => (
          <div key={company.id} className="bg-white shadow-md rounded-xl p-4">
            <h3 className="text-xl font-semibold text-blue-700 mb-1">{company.name}</h3>
            {company.logo && (
              

              <Image
                src={company.logo || "/default-logo.png"} // fallback if logo is missing
                alt={company.name}
                width={100} // adjust as needed
                height={48}  // adjust to match original `h-12` (48px)
                className="mb-2 w-auto h-12"
              />
              
            )}
            <p className="text-sm text-gray-600">
              {company.sector} | {company.location}
            </p>
            {company.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 text-sm underline mt-2 inline-block"
              >
                Visit Website
              </a>
            )}
            {company.totalOffers && (
              <p className="text-sm text-green-700 mt-2">🎯 {company.totalOffers} Offers</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
