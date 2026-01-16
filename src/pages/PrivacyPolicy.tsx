export const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-black text-white p-8 md:p-20">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold">Privacy Policy</h1>
        <p className="text-zinc-400">Last updated: January 15, 2026</p>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">1. Introduction</h2>
          <p className="text-zinc-300">
            Taskflow ("we", "our", or "us") is committed to protecting your privacy. This Privacy
            Policy explains how your personal information is collected, used, and disclosed by
            Taskflow.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">2. Local-First Architecture</h2>
          <p className="text-zinc-300">
            Taskflow is designed as a "Local-First" application. This means:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-zinc-300">
            <li>
              By default, all your data (tasks, projects, settings) is stored locally on your device
              using IndexedDB and LocalStorage.
            </li>
            <li>We do not have access to your local data.</li>
            <li>
              Your data remains on your device unless you actively choose to use our Cloud Sync
              features.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">3. Data We Collect (Pro Cloud Users)</h2>
          <p className="text-zinc-300">
            If you choose to upgrade to Taskflow Pro and enable Cloud Sync, we collect the
            following:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-zinc-300">
            <li>
              <strong>Account Information:</strong> Your email address and authentication
              credentials (via Supabase Auth).
            </li>
            <li>
              <strong>Synced Data:</strong> An encrypted copy of your tasks and projects to
              facilitate synchronization between your devices.
            </li>
            <li>
              <strong>Payment Information:</strong> Processed securely by our payment provider
              (Stripe). We do not store your credit card details.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">4. How We Use Your Data</h2>
          <p className="text-zinc-300">
            We use the data we collect solely to provide, maintain, and improve the Taskflow
            service. We do not sell your personal data to third parties.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">5. Data Retention</h2>
          <p className="text-zinc-300">
            You can delete your account and all associated cloud data at any time from the settings
            menu. Local data on your devices must be deleted manually by clearing your browser data.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">6. Contact Us</h2>
          <p className="text-zinc-300">
            If you have any questions about this Privacy Policy, please contact us at
            wenceye@gmail.com.
          </p>
        </section>
      </div>
    </div>
  );
};
