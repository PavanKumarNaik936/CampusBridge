"use client";

import { useEffect, useState ,useRef} from "react";
import { useSession } from "next-auth/react";
import { usePathname,useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";
import axios from "axios";
import { User } from "@/generated/prisma";



export default function EditProfilePage() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
    const router = useRouter();
  const sessionUser = session?.user;

  const prevPathRef = useRef(pathname);

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<User>>({});
  const [loading, setLoading] = useState(false);
  const [dbUser, setDbUser] = useState<Partial<User> | null>(null);
  const [skills, setSkills] = useState<string[]>(form.skills || []);
  const [achievements, setAchievements] = useState<string[]>(form.achievements || []);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isDirty, setIsDirty] = useState(false);


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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setIsDirty(true); 
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
      setForm((prev) => ({ ...prev, profileImage: reader.result as string }));
    };
    reader.readAsDataURL(file);
    setIsDirty(true); 
  };
  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    setResumeFile(file);
  
    // Optional: Convert to base64 or upload to a cloud storage (if needed)
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, resumeUrl: reader.result as string }));
    };
    reader.readAsDataURL(file); // ⚠️ optional – only if you're storing base64
    setIsDirty(true); 
  };
  
  

  const handleSubmit = async () => {
    if (!dbUser?.id) return toast.error("User ID is missing");
    setLoading(true);
    try {
        await axios.put(`/api/users/${dbUser.id}`, {
            ...form,
            skills,
            achievements,
          });
          
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
  }, [pathname]);
  

  if (status === "loading") return <div className="p-6">Loading session...</div>;
  if (!sessionUser?.email) return <div className="p-4">Not authorized</div>;
  if (!dbUser) return <div className="p-4">Loading user data...</div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <Toaster richColors position="top-center" />
      <div className="bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-[#14326E] mb-6">Edit Your Profile</h1>
        <div className="flex flex-col md:flex-row items-center gap-6 mb-6">

                <div className="flex items-center gap-6 mb-6">
                {/* Left: Image */}
                <div>
                    <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
                    <img
                    src={
                        previewImage ||
                        form.profileImage ||
                        dbUser?.image || // fallback to auth image
                        "/default-avatar.png" // 🔁 your fallback default image path
                    }
                    alt="Profile"
                    className="w-32 h-32 object-cover rounded-full border"
                    />
                    {previewImage && <p className="text-sm text-gray-600 mt-1">Image selected</p>}

                </div>
        </div>


        {/* Right: File Input */}
        <div className="flex flex-col justify-center">
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload New</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>
        </div>

                        {/* Resume Upload Section */}
                        <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
            Resume
            </label>
            {form.resumeUrl && (
            <a
                href={form.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline mb-2 block text-sm"
            >
                View Uploaded Resume
            </a>
            )}
        </div>

        <div className="flex flex-col justify-center">
            <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-2">
            Upload Resume (PDF)
            </label>
            <input
            id="resume"
            type="file"
            accept=".pdf"
            onChange={handleResumeChange}
            />
            {resumeFile && (
            <p className="text-sm text-gray-600 mt-1">{resumeFile.name}</p>
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
              <FloatingInput label="Branch" name="branch" value={form.branch || ""} onChange={handleChange} />
              <FloatingInput label="Year" type="number" name="year" value={form.year || ""} onChange={handleChange} />
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
              <FloatingInput label="Company" name="company" value={form.company || ""} onChange={handleChange} />
              <FloatingInput label="Company Logo URL" name="companyLogo" value={form.companyLogo || ""} onChange={handleChange} />
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
  