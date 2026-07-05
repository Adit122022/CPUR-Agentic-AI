import { SignIn } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import {
  Sparkles,
  ShieldCheck,
  BarChart3,
  Boxes,
} from "lucide-react";

export default function Login() {
  const features = [
    {
      icon: <BarChart3 size={20} />,
      title: "Demand Forecasting",
      desc: "Predict future sales with AI-powered insights.",
    },
    {
      icon: <Boxes size={20} />,
      title: "Inventory Management",
      desc: "Track stock levels and optimize replenishment.",
    },
    {
      icon: <ShieldCheck size={20} />,
      title: "Enterprise Security",
      desc: "Protected authentication powered by Clerk.",
    },
  ];

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-background text-foreground select-none">

      {/* Background */}
      <div className="absolute inset-0 dot-bg" />

      <motion.div
        animate={{
          x: [0, 80, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-white/5 blur-[130px]"
      />

      <motion.div
        animate={{
          x: [0, -60, 0],
          y: [0, 60, 0],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-white/5 blur-[150px]"
      />

      <div className="relative z-10 -pt-3 flex min-h-screen">

        {/* Left Side */}
        <div className="hidden lg:flex w-1/2 flex-col justify-center pl-20">

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: .7 }}
          >
            <h1 className="text-4xl font-black leading-tight mb-4">

              ClearShelf

            </h1>
            <div className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-1 text-[10px] uppercase tracking-[0.25em] ">

              <Sparkles className="h-3 w-3" />

              <span>AI Retail Platform</span>

            </div>



            <p className="mt-4 max-w-xl text-sm text-muted-foreground leading-8">

              Make smarter retail decisions using AI-powered forecasting,
              intelligent inventory optimization, and real-time business
              analytics.

            </p>

            <div className="mt-8 space-y-6">

              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * .15 }}
                  className="flex gap-5"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card">

                    {feature.icon}

                  </div>

                  <div>

                    <h3 className="font-semibold text-base">

                      {feature.title}

                    </h3>

                    <p className="text-muted-foreground text-sm">

                      {feature.desc}

                    </p>

                  </div>
                </motion.div>
              ))}

            </div>

          </motion.div>

        </div>

        {/* Right Side */}

        <div className="flex flex-1 items-center justify-center p-8">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .7 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card/70 backdrop-blur-2xl shadow-2xl"
          >

            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent" />

            <div className="relative pt-8 px-8">

              <div className="-mb-4 text-center">

                <h2 className="text-3xl font-bold">

                  Welcome Back

                </h2>

                <p className="mt-1 text-muted-foreground">

                  Sign in to continue to your dashboard

                </p>

              </div>

              <SignIn
                routing="hash"
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "w-full !bg-transparent !border !border-transparent !shadow-none",
                    headerTitle: "hidden",
                    headerSubtitle: "hidden",
                    socialButtonsBlockButton:
                      "!bg-zinc-900 !hover:!bg-zinc-800 !rounded-xl !text-white",
                    socialButtonsBlockButtonText: "!text-white  !font-semibold",
                    formButtonPrimary:
                      "!bg-white !text-black hover:!bg-gray-200 !rounded-xl !font-bold transition-all",
                    formFieldInput:
                      "!bg-zinc-900 !border-zinc-700 !rounded-lg !text-white",
                    footerAction: { display: "none" },
                    footerActionText: "hidden",
                    footerActionLink: "hidden",
                  },
                }}
              />

            </div>

          </motion.div>

        </div>

      </div>

    </div>
  );
}

