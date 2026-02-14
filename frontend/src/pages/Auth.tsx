import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Mail, Lock, User, ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, user, loading: authLoading } = useAuth();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ sync mode with URL
  useEffect(() => {
    const urlMode = searchParams.get("mode");
    setMode(urlMode === "signup" ? "signup" : "login");
  }, [searchParams]);

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      navigate("/", { replace: true });
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const url =
      mode === "signup"
        ?`${import.meta.env.VITE_API_URL}/user/signup`
        : `${import.meta.env.VITE_API_URL}/user/login`;

    const payload =
      mode === "signup"
        ? { name, email, password }
        : { email, password };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      if (mode === "signup") {
        toast({
          title: "Account created",
          description: "Please login to continue",
        });
        navigate("/auth?mode=login");
        return;
      }

      login();
      navigate("/");
    } catch (err: any) {
      toast({
        title: "Authentication failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-4">
              <Sparkles className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-2">
              {mode === "login" ? "Welcome back!" : "Create your account"}
            </h1>
          </div>

          <div className="bg-card rounded-2xl shadow-soft p-8 border">
            <form onSubmit={handleSubmit} className="space-y-5">
              {mode === "signup" && (
                <div>
                  <Label>Full Name</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} />
                </div>
              )}

              <div>
                <Label>Email</Label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>

              <div>
                <Label>Password</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-[rgb(31,199,165)] 
                text-white rounded-full
                hover:bg-[rgb(26,170,140)] transition flex items-center justify-center"

              >
                {mode === "login" ? "Sign In" : "Create Account"}
                <ArrowRight className="ml-2 w-4 h-4" />
              </button>
            </form>

            <button
              onClick={() =>
                navigate(`/auth?mode=${mode === "login" ? "signup" : "login"}`)
              }
              className="w-full h-12 border border-[rgb(31,199,165)]
           text-[rgb(31,199,165)] rounded-full
           hover:bg-[rgba(31,199,165,0.1)] transition"

            >
              {mode === "login" ? "Create an account" : "Sign in instead"}
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Auth;
