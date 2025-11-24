import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"

export const metadata = {
  title: "Privacy Policy - JSON Viewer",
  description: "Read our privacy policy to understand how we handle your data and privacy.",
  robots: { index: true, follow: true },
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 md:py-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="space-y-6">
          <Card className="p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="text-muted-foreground">
              JSON Viewer ("we", "us", "our") operates the jsonviewer.app website. This page informs you of our policies
              regarding the collection, use, and disclosure of personal data when you use our Service.
            </p>
          </Card>

          <Card className="p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-4">2. Information Collection and Use</h2>
            <p className="text-muted-foreground mb-4">
              We collect information for various purposes to provide and improve our Service:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Usage analytics through Google Analytics and Firebase Analytics</li>
              <li>Device information (browser type, IP address)</li>
              <li>User interactions with our tools</li>
              <li>Information provided through contact forms</li>
            </ul>
          </Card>

          <Card className="p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-4">3. Data Security</h2>
            <p className="text-muted-foreground">
              The security of your data is important to us, but no method of transmission over the Internet or method of
              electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your
              personal information, we cannot guarantee its absolute security.
            </p>
          </Card>

          <Card className="p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-4">4. Third-Party Services</h2>
            <p className="text-muted-foreground mb-4">
              Our Service may use third-party services for analytics and advertising:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Google Analytics</li>
              <li>Firebase Analytics</li>
              <li>Google AdSense</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              These services may collect information used to identify you and have their own privacy policies.
            </p>
          </Card>

          <Card className="p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-4">5. JSON Data Processing</h2>
            <p className="text-muted-foreground">
              JSON data you input into our viewer is processed locally in your browser. We do not store your JSON data
              on our servers unless you explicitly choose to share it using our share feature.
            </p>
          </Card>

          <Card className="p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-4">6. Cookies</h2>
            <p className="text-muted-foreground">
              We use cookies and similar tracking technologies to track activity on our Service and hold certain
              information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being
              sent.
            </p>
          </Card>

          <Card className="p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-4">7. Contact Us</h2>
            <p className="text-muted-foreground">
              If you have any questions about this Privacy Policy, please contact us at support@jsonviewer.app
            </p>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
