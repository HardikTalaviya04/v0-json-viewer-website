import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"

export const metadata = {
  title: "Disclaimer - JSON Viewer",
  description: "Read our disclaimer for JSON Viewer service.",
  robots: { index: true, follow: true },
}

export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 md:py-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Disclaimer</h1>
          <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="space-y-6">
          <Card className="p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-4">General Disclaimer</h2>
            <p className="text-muted-foreground">
              The information provided by JSON Viewer is for general informational purposes only. All information on the
              site is provided in good faith, however we make no representation or warranty of any kind regarding the
              accuracy, adequacy, or completeness of any information.
            </p>
          </Card>

          <Card className="p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-4">Service "As Is"</h2>
            <p className="text-muted-foreground">
              JSON Viewer is provided on an "as is" basis. We make no warranties and hereby disclaim all implied
              warranties including merchantability, fitness for a particular purpose, and non-infringement of rights.
            </p>
          </Card>

          <Card className="p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
            <p className="text-muted-foreground mb-4">JSON Viewer shall not be liable for damages including:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Loss of revenue or anticipated profits</li>
              <li>Loss of business</li>
              <li>Loss of data</li>
              <li>Loss of use or productivity</li>
              <li>Any consequential, indirect, or special damages</li>
            </ul>
          </Card>

          <Card className="p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-4">Accuracy of Content</h2>
            <p className="text-muted-foreground">
              While we strive to provide accurate information through JSON Viewer, we do not warrant the accuracy,
              timeliness, or completeness. You use JSON Viewer at your own risk.
            </p>
          </Card>

          <Card className="p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-4">Data Processing</h2>
            <p className="text-muted-foreground">
              JSON Viewer processes JSON data in your browser. We do not guarantee the security of any data you input.
              Do not input sensitive information you are not willing to potentially expose.
            </p>
          </Card>

          <Card className="p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-4">Third-Party Links</h2>
            <p className="text-muted-foreground">
              JSON Viewer contains links to third-party websites. We are not responsible for their content or accuracy.
              Your use of third-party websites is governed by their own terms and conditions.
            </p>
          </Card>

          <Card className="p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-4">Availability</h2>
            <p className="text-muted-foreground">
              We do not guarantee JSON Viewer will be available at all times. We may experience technical difficulties,
              perform maintenance, or make updates that could temporarily interrupt access.
            </p>
          </Card>

          <Card className="p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-4">Contact</h2>
            <p className="text-muted-foreground">
              For questions regarding this disclaimer, please contact us at support@jsonviewer.app
            </p>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
