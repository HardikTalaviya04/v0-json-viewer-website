import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"

export const metadata = {
  title: "Terms and Conditions - JSON Viewer",
  description: "Read our terms and conditions for using JSON Viewer.",
  robots: { index: true, follow: true },
}

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 md:py-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Terms and Conditions</h1>
          <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="space-y-6">
          <Card className="p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By accessing and using JSON Viewer, you accept and agree to be bound by the terms and provision of this
              agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </Card>

          <Card className="p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
            <p className="text-muted-foreground mb-4">
              Permission is granted to temporarily download one copy of the materials (information or software) on JSON
              Viewer for personal, non-commercial transitory viewing only. Under this license you may not:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose</li>
              <li>Attempt to decompile or reverse engineer any software</li>
              <li>Remove any copyright or proprietary notations</li>
              <li>Mirror the materials on any other server</li>
            </ul>
          </Card>

          <Card className="p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-4">3. Disclaimer</h2>
            <p className="text-muted-foreground">
              The materials on JSON Viewer are provided on an 'as is' basis. JSON Viewer makes no warranties, expressed
              or implied, and hereby disclaims all other warranties.
            </p>
          </Card>

          <Card className="p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-4">4. Limitations</h2>
            <p className="text-muted-foreground">
              JSON Viewer shall not be liable for any damages (including loss of data or profit) arising out of the use
              or inability to use the materials, even if notified of the possibility of such damage.
            </p>
          </Card>

          <Card className="p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-4">5. Accuracy of Materials</h2>
            <p className="text-muted-foreground">
              The materials on JSON Viewer could include technical or typographical errors. JSON Viewer does not warrant
              that any materials are accurate, complete, or current and may make changes without notice.
            </p>
          </Card>

          <Card className="p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-4">6. Links</h2>
            <p className="text-muted-foreground">
              JSON Viewer has not reviewed all sites linked to its website and is not responsible for the contents of
              any linked site. Use of any linked website is at the user's own risk.
            </p>
          </Card>

          <Card className="p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-4">7. Modifications</h2>
            <p className="text-muted-foreground">
              JSON Viewer may revise these terms of service at any time without notice. By using this website, you agree
              to be bound by the current version of these terms.
            </p>
          </Card>

          <Card className="p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-4">8. Contact Us</h2>
            <p className="text-muted-foreground">
              If you have questions about these Terms and Conditions, please contact us at support@jsonviewer.app
            </p>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
