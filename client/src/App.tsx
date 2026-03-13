import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

function App() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route 
            path="/signup" 
            element={<Navigate to="/dashboard" replace />} /> {/* Clerk handles signup in dashboard or separate page if needed */}
          <Route 
            path="/signin" 
            element={<Navigate to="/dashboard" replace />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <>
              <SignedIn>
                <Dashboard />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          } />
        </Routes>
      </BrowserRouter>
    </ClerkProvider>
  );
}

export default App;
