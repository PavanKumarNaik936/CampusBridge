"use client";

import { useEffect, useState ,useRef} from "react";
import { useSession } from "next-auth/react";
import { usePathname,useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";
import axios from "axios";
import { User } from "@/generated/prisma";
import { ProfileImageUpload, ResumeUpload } from "@/components/FileUpload";
import Image from "next/image";



export default function EditProfilePage() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
    const router = useRouter();
  const sessionUser = session?.user;

  const prevPathRef = useRef(pathname);

  
  const [form, setForm] = useState<Partial<User>>({});
  const [loading, setLoading] = useState(false);
  const [dbUser, setDbUser] = useState<Partial<User> | null>(null);
  const [skills, setSkills] = useState<string[]>(form.skills || []);
  const [achievements, setAchievements] = useState<string[]>(form.achievements || []);
  
  const [companies, setCompanies] = useState<{ id: string; name: string }[]>([]);
  const [resumeFileName, setResumeFileName] = useState<string | null>(null);
  const [profileFileName, setProfileFileName] = useState<string | null>(null);


  const [isDirty, setIsDirty] = useState(false);
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get("/api/companies");
        setCompanies(res.data);
      } catch (err) {
        console.error("Failed to load companies", err);
      }
    };
    fetchCompanies();
  }, []);
  const courseDurationByBranch: Record<string, number> = {
    CSE: 4,
    ECE: 4,
    MECH: 4,
    MME: 4,
    CIVIL: 4,
    EEE: 4,
    CHEM: 4,
    "AI/ML": 4,
  };
  

  useEffect(() => {
    const courseDurationByBranch: Record<string, number> = {
      CSE: 4,
      ECE: 4,
      MECH: 4,
      MME:4,
      CIVIL:4,
      EEE:4,
      CHEM:4,
      "AI/ML":4,
    };
  
    const duration = courseDurationByBranch[form.branch || ""] || 4;
  
    if (form.admissionYear) {
      const gradYear = parseInt(form.admissionYear.toString()) + duration;
      setForm((prev) => ({
        ...prev,
        graduationYear: gradYear,
      }));
    }
  }, [form.admissionYear, form.branch]);
  
  useEffect(() => {
    if (sessionUser?.email) {
        axios.get(`/api/users/${sessionUser.id}`)
        .then(res => {
          setForm(res.data);
          setDbUser(res.data);
        })
        .catch(err => {
          toast.error("Failed to fetch user data.");
        });
    }
  }, [sessionUser]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
  
    setForm((prev) => ({
      ...prev,
      [name]:
        value === ""
          ? undefined
          : type === "number"
          ? Number(value)
          : value,
    }));
  
    setIsDirty(true);
  };
  
  
  function cleanUndefinedAndNull<T extends object>(obj: T): Partial<T> {
    const cleaned: Partial<T> = {};
    for (const key in obj) {
      const value = obj[key];
      if (value !== null && value !== "" && value !== undefined) {
        cleaned[key] = value;
      }
    }
    return cleaned;
  }
  

  

  const handleSubmit = async () => {
    if (!dbUser?.id) return toast.error("User ID is missing");
    setLoading(true);
    const rawPayload: Partial<User> = {
      ...form,
      skills: skills.length > 0 ? skills : undefined,
      achievements: achievements.length > 0 ? achievements : undefined,
    };
  
    const cleanedPayload = cleanUndefinedAndNull(rawPayload); // 👈 removes all undefined, "", null
  
    
    try {
        await axios.put(`/api/users/${dbUser.id}`, cleanedPayload);
        // console.log(cleanedPayload)
      toast.success("Profile updated successfully");
      setIsDirty(false);
      router.push("/profile");
    } catch (err: any) {
      const error = err?.response?.data?.error;
      toast.error(Array.isArray(error) ? error[0]?.message : error || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = ""; // Required for Chrome
      }
    };
  
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);
  
  useEffect(() => {
    if (prevPathRef.current !== pathname) {
      if (isDirty) {
        const confirmLeave = confirm("You have unsaved changes. Are you sure you want to leave?");
        if (!confirmLeave) {
          // Revert back to previous path using `router.back()` or reload
          router.push(prevPathRef.current); // "Undo" navigation
        } else {
          prevPathRef.current = pathname;
        }
      } else {
        prevPathRef.current = pathname;
      }
    }
  }, [pathname,isDirty,router]);
  

  if (status === "loading") return <div className="p-6">Loading session...</div>;
  // if (!sessionUser?.email) return <div className="p-4">Not authorized</div>;
  if (!dbUser) return <div className="p-4">Loading user data...</div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <Toaster richColors position="top-center" />
      <div className="bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-[#14326E] mb-6">Edit Your Profile</h1>
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-6 w-full">
          {/* Profile Image + Upload */}
          <div className="flex flex-col items-center sm:items-start gap-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
            <Image
            src={form.profileImage || dbUser?.image || "/default-user.jpg"}
            alt="Profile"
            width={96}
            height={96}
            className="w-24 h-24 object-cover rounded-full border"
          />
            <ProfileImageUpload
              onUpload={(url, fileName) => {
                setForm((prev) => {
                  const updated = { ...prev, profileImage: url };
                  // console.log("✅ Updated form:", updated); // ✅ Correct place to log
                  return updated;
                });
                console.log(form);
                setProfileFileName(fileName);
                setIsDirty(true);
              }}
              
            />

            {profileFileName && (
              <p className="text-sm text-gray-600 mt-1">{profileFileName}</p>
            )}
          </div>

          {/* Resume Upload */}
          <div className="flex flex-col items-center sm:items-start gap-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Resume</label>
            {form.resumeUrl && (
              <a
                href={form.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline mb-2 text-sm"
              >
                View Uploaded Resume
              </a>
            )}
            <ResumeUpload
              onUpload={(url, fileName) => {
                // console.log(url);
                setForm((prev) => ({ ...prev, resumeUrl: url }));
                setResumeFileName(fileName);
                setIsDirty(true);
              }}
            />
            {resumeFileName && (
              <p className="text-sm text-gray-600 mt-1">{resumeFileName}</p>
            )}
          </div>
        </div>



        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FloatingInput label="Name" name="name" value={form.name || ""} onChange={handleChange} />
          <FloatingInput label="Email" name="email" value={form.email || ""} onChange={handleChange} disabled />
          <FloatingInput label="Phone" name="phone" value={form.phone || ""} onChange={handleChange} />
          {/* <FloatingInput label="Profile Image URL" name="profileImage" value={form.profileImage || ""} onChange={handleChange} /> */}
          <FloatingInput label="LinkedIn URL" name="linkedIn" value={form.linkedIn || ""} onChange={handleChange} />
        </div>

        {dbUser.role === "student" && (
          <>
            <h2 className="mt-8 text-xl font-semibold text-[#14326E]">Academic Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <label className="text-sm font-semibold text-gray-700">
            Branch
            <select
              name="branch"
              value={form.branch || ""}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">-- Select Branch --</option>
              {Object.keys(courseDurationByBranch).map((branch) => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
          </label>

              
              <FloatingInput
              label="Admission Year"
              type="number"
              name="admissionYear"
              value={form.admissionYear || ""}
              onChange={handleChange}
            />

            <FloatingInput
              label="Graduation Year"
              type="number"
              name="graduationYear"
              value={form.graduationYear || ""}
              disabled
              onChange={() => {}}
            />

              <FloatingInput label="Roll Number" name="rollNumber" value={form.rollNumber || ""} onChange={handleChange} />
              <FloatingInput label="CGPA" type="number" step="0.01" name="cgpa" value={form.cgpa || ""} onChange={handleChange} />
              {/* <FloatingInput label="Resume URL" name="resumeUrl" value={form.resumeUrl || ""} onChange={handleChange} /> */}
              <FloatingInput label="Portfolio URL" name="portfolioUrl" value={form.portfolioUrl || ""} onChange={handleChange} />
            </div>
            <TagInput label="Skills" tags={skills} setTags={setSkills} />
            <TagInput label="Achievements" tags={achievements} setTags={setAchievements} />

          </>
        )}

        {dbUser.role === "recruiter" && (
      <>
        <h2 className="mt-8 text-xl font-semibold text-[#14326E]">Company Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <label className="text-sm font-semibold text-gray-700">
            Company
            <select
              name="companyId"
              value={form.companyId || ""}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">-- Select Company --</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </label>
          {/* Optional: Preview selected company logo if needed */}
        </div>
      </>
    )}

        <div className="mt-10">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-[#14326E] hover:bg-[#102954] text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-200 w-full md:w-auto"
          >
            {loading ? (
                <div className="flex items-center gap-2">
                    <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                    Updating...
                </div>
                ) : (
                "Save Changes"
                )}

          </button>
        </div>
      </div>
    </div>
  );
}

// Floating Label Input
function FloatingInput({
  label,
  name,
  value,
  onChange,
  disabled = false,
  type = "text",
  step,
}: {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  type?: string;
  step?: string;
}) {
  return (
    <div className="relative">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        step={step}
        className="peer w-full border border-gray-300 rounded-md px-3 pt-5 pb-2 focus:outline-none focus:border-[#14326E] focus:ring-1 focus:ring-[#14326E] transition-all disabled:bg-gray-100"
        placeholder=" "
      />
      <label
        htmlFor={name}
        className="absolute text-gray-500 text-xs left-3 top-2 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-[#14326E]"
      >
        {label}
      </label>
    </div>
  );
}


function TagInput({
    label,
    tags,
    setTags,
  }: {
    label: string;
    tags: string[];
    setTags: (tags: string[]) => void;
  }) {
    const [input, setInput] = useState("");
  
    const handleAdd = () => {
      if (input && !tags.includes(input)) {
        setTags([...tags, input]);
        setInput("");
      }
    };
  
    const handleRemove = (tag: string) => {
      setTags(tags.filter(t => t !== tag));
    };
  
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <div className="flex gap-2 mt-1 mb-2 flex-wrap">
          {tags.map((tag, idx) => (
            <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center gap-1">
              {tag}
              <button onClick={() => handleRemove(tag)} className="text-red-500 hover:text-red-700">&times;</button>
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            className="border px-3 py-1 rounded w-full"
          />
          <button
            onClick={handleAdd}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      </div>
    );
  }
  